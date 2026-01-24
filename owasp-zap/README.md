# OWASP ZAP - Web Application Security Scanner

## การใช้งาน

### 1. เริ่ม Container
```bash
docker-compose up -d
```

### 2. ตรวจสอบสถานะ
```bash
docker ps | grep owasp-zap
```

### 3. สแกนเว็บไซต์

#### วิธีที่ 1: Quick Scan (30 วินาที - เหมาะสำหรับทดสอบ)
```bash
chmod +x quick-scan.sh
./quick-scan.sh https://<website>/
```

#### วิธีที่ 2: Simple Scan (2-5 นาที - Spider + Passive Scan แนะนำ!)
```bash
chmod +x simple-scan.sh
./simple-scan.sh https://<website>/
```

#### วิธีที่ 3: Manual Active Scan (15-60 นาที - หาช่องโหว่แบบลึก)
```bash
# ขั้นตอนที่ 1: รัน Simple Scan ก่อน
./simple-scan.sh https://<website>/

# ขั้นตอนที่ 2: รัน Active Scan
chmod +x manual-active-scan.sh
./manual-active-scan.sh https://<website>/
```

#### วิธีที่ 4: Full Automated Scan (อาจมีปัญหา - ไม่แนะนำ)
```bash
chmod +x scan-website.sh
./scan-website.sh https://<website>/
```

### 4. ดู Report
Reports จะถูกบันทึกไว้ที่: `./zap-wrk/reports/`

## API Endpoints ที่มีประโยชน์

### ดูข้อมูล Alerts
```bash
curl "http://localhost:8080/JSON/core/view/alerts/?apikey=secret_key_123" | python3 -m json.tool
```

### ดูสรุป Alerts
```bash
curl "http://localhost:8080/JSON/core/view/alertsSummary/?apikey=secret_key_123" | python3 -m json.tool
```

### ดู URLs ที่ค้นพบ
```bash
curl "http://localhost:8080/JSON/core/view/urls/?apikey=secret_key_123" | python3 -m json.tool
```

### Spider Status
```bash
curl "http://localhost:8080/JSON/spider/view/status/?apikey=secret_key_123&scanId=0"
```

### Active Scan Status
```bash
curl "http://localhost:8080/JSON/ascan/view/status/?apikey=secret_key_123&scanId=0"
```

## ดาวน์โหลด Report

### HTML Report
```bash
curl "http://localhost:8080/OTHER/core/other/htmlreport/?apikey=secret_key_123" -o zap-report.html
```

### XML Report
```bash
curl "http://localhost:8080/OTHER/core/other/xmlreport/?apikey=secret_key_123" -o zap-report.xml
```

### JSON Report
```bash
curl "http://localhost:8080/JSON/core/view/alerts/?apikey=secret_key_123" -o zap-alerts.json
```

## เข้าใช้งาน ZAP UI

OWASP ZAP Web UI: http://localhost:8080

**API Key:** `secret_key_123`

## ข้อมูลเพิ่มเติม

- [ZAP API Documentation](https://www.zaproxy.org/docs/api/)
- [ZAP Automation](https://www.zaproxy.org/docs/automate/)
- [ZAP Docker](https://www.zaproxy.org/docs/docker/)

## Risk Levels

- **High**: ช่องโหว่ที่เสี่ยงมาก ต้องแก้ไขทันที
- **Medium**: ช่องโหว่ปานกลาง ควรแก้ไข
- **Low**: ช่องโหว่เล็กน้อย แนะนำให้แก้ไข
- **Informational**: ข้อมูลเพื่อการปรับปรุง
