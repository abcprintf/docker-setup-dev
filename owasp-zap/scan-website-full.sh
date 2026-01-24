#!/bin/bash

# =================================================================
# OWASP ZAP Full Professional Scan (2026 Optimized for Mac M3)
# =================================================================

TARGET_URL="${1}"
API_KEY="secret_key_123"
ZAP_HOST="localhost"
ZAP_PORT="8080"
BASE_URL="http://${ZAP_HOST}:${ZAP_PORT}"
REPORT_DIR="./zap-reports"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

if [ -z "$TARGET_URL" ]; then
    echo "❌ Usage: ./scan-website-full.sh <target-url>"
    exit 1
fi

# ฟังก์ชันเรียก API ผ่าน Header (ปลอดภัยกว่า)
zap_api() {
    curl -s -H "X-ZAP-API-Key: ${API_KEY}" "${BASE_URL}${1}"
}

echo "===================================================="
echo "🛡️  Starting Optimized Security Audit"
echo "Target: $TARGET_URL"
echo "Time  : $(date)"
echo "===================================================="

# 1. เช็คความพร้อมของ ZAP
echo "[1/7] Connecting to ZAP..."
until $(zap_api "/JSON/core/view/version/" > /dev/null 2>&1); do
    echo "      Waiting for ZAP container to be ready..."
    sleep 5
done

# --- [Optimization] ปรับจูนเพื่อแก้ปัญหา CPU 100% และ WebSocket Error ---
echo "      Optimizing scan settings for CPU & Stability..."
# ลดจำนวน Browser ของ AJAX Spider เพื่อประหยัด CPU
zap_api "/JSON/ajaxSpider/action/setOptionNumberOfBrowsers/?Integer=2"
# ลดความเร็วในการยิง Active Scan (Threads)
zap_api "/JSON/ascan/action/setOptionThreadPerHost/?Integer=2"
# ปิดการสแกน WebSocket เพื่อลด Socket Error
zap_api "/JSON/websocket/action/setOptionForwardAllMessages/?Boolean=true"
# ปรับ DomXssScanRule (ที่กิน CPU หนัก) ให้ทำงานในระดับปกติ ไม่โหมเกินไป
zap_api "/JSON/ascan/action/setScannerAlertThreshold/?id=40026&threshold=HIGH"

# 2. Traditional Spider
echo "[2/7] Running Traditional Spider..."
SPIDER_ID=$(zap_api "/JSON/spider/action/scan/?url=${TARGET_URL}" | jq -r '.scan // empty')
while true; do
    STATUS=$(zap_api "/JSON/spider/view/status/?scanId=${SPIDER_ID}" | jq -r '.status // 0')
    echo -ne "      Progress: ${STATUS}% \r"
    [ "$STATUS" == "100" ] && break
    sleep 5
done
echo -e "\n      ✅ Spider Complete"

# 3. AJAX Spider
echo "[3/7] Running AJAX Spider (M3 Headless Chrome)..."
zap_api "/JSON/ajaxSpider/action/scan/?url=${TARGET_URL}" > /dev/null
while true; do
    AJAX_STATUS=$(zap_api "/JSON/ajaxSpider/view/status/" | jq -r '.status')
    echo -ne "      Status: ${AJAX_STATUS}   \r"
    [ "$AJAX_STATUS" == "stopped" ] && break
    sleep 5
done
echo -e "\n      ✅ AJAX Spider Complete"

# 4. รอ Passive Scan
echo "[4/7] Waiting for Passive Analysis..."
while true; do
    REMAINING=$(zap_api "/JSON/pscan/view/recordsToScan/" | jq -r '.recordsToScan // 0')
    echo -ne "      Queue: ${REMAINING} records   \r"
    [ "$REMAINING" == "0" ] && break
    sleep 3
done
echo -e "\n      ✅ Passive Analysis Complete"

# 5. Active Scan (พร้อมระบบเช็ค scanId แบบ Robust)
echo "[5/7] Starting Active Scan (Attack Mode)..."
ASCAN_RESPONSE=$(zap_api "/JSON/ascan/action/scan/?url=${TARGET_URL}&recurse=true")
ASCAN_ID=$(echo $ASCAN_RESPONSE | jq -r '.scan // empty')

if [ -z "$ASCAN_ID" ] || [ "$ASCAN_ID" == "null" ]; then
    echo "❌ Error: Failed to start Active Scan. Msg: $ASCAN_RESPONSE"
    exit 1
fi

echo "      Scan ID: $ASCAN_ID (Warming up...)"
sleep 10 # รอให้ ZAP ลงทะเบียน ID ให้เรียบร้อย

while true; do
    RAW_STATUS=$(zap_api "/JSON/ascan/view/status/?scanId=${ASCAN_ID}")
    
    # แก้ปัญหา DOES_NOT_EXIST
    if echo "$RAW_STATUS" | grep -q "DOES_NOT_EXIST"; then
        echo -ne "      Registering Scan... \r"
        sleep 5; continue
    fi

    STATUS=$(echo "$RAW_STATUS" | jq -r '.status // 0')
    echo -ne "      Attack Progress: ${STATUS}% \r"
    [ "$STATUS" == "100" ] && break
    sleep 10
done
echo -e "\n      ✅ Active Scan Complete"

# 6. สร้างรายงาน
echo "[6/7] Exporting Reports..."
mkdir -p "$REPORT_DIR"
HTML_REPORT="${REPORT_DIR}/full-report-${TIMESTAMP}.html"
curl -s -H "X-ZAP-API-Key: ${API_KEY}" "${BASE_URL}/OTHER/core/other/htmlreport/" -o "$HTML_REPORT"

# 7. สรุปผล
echo "[7/7] Audit Summary"
echo "----------------------------------------------------"
echo "📂 Report: $HTML_REPORT"
echo "Risk Levels Found:"
zap_api "/JSON/alert/view/alertCountsByRisk/?url=${TARGET_URL}" | jq '.alertCountsByRisk'
echo "===================================================="
echo "Audit Finished at: $(date)"
