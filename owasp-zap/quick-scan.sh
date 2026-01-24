#!/bin/bash

# OWASP ZAP Quick Scan Script
# Usage: ./quick-scan.sh <target-url>

TARGET_URL="${1:-https://erp2025.gutsgroup.com/}"
API_KEY="secret_key_123"
ZAP_HOST="localhost"
ZAP_PORT="8080"
BASE_URL="http://${ZAP_HOST}:${ZAP_PORT}"

echo "Quick Scanning: $TARGET_URL"
echo ""

# Access URL
echo "1. Accessing URL..."
curl -s "${BASE_URL}/JSON/core/action/accessUrl/?apikey=${API_KEY}&url=${TARGET_URL}" > /dev/null

# Spider scan (quick mode)
echo "2. Starting quick spider..."
SPIDER_ID=$(curl -s "${BASE_URL}/JSON/spider/action/scan/?apikey=${API_KEY}&url=${TARGET_URL}&maxChildren=10" | grep -o '"scan":"[^"]*"' | cut -d'"' -f4)

# รอ Spider เสร็จ
sleep 30

# ดูผลการสแกนแบบรวดเร็ว
echo ""
echo "3. Quick Alert Summary:"
curl -s "${BASE_URL}/JSON/core/view/alerts/?apikey=${API_KEY}&baseurl=${TARGET_URL}&start=0&count=10" | python3 -m json.tool

echo ""
echo "For full scan, use: ./scan-website.sh $TARGET_URL"
