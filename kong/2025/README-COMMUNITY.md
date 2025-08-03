# Kong Gateway Community Edition with Monitoring

## สิ่งที่ได้จากการตั้งค่านี้

### 1. Kong Gateway Community
- Kong Gateway Community Edition v3.8.0
- Admin API สำหรับจัดการ services, routes, plugins
- Prometheus metrics endpoint สำหรับ monitoring

### 2. PostgreSQL Database
- Database สำหรับเก็บข้อมูล Kong configuration
- Persistent storage ด้วย named volumes

### 3. Prometheus Monitoring
- Prometheus สำหรับเก็บและ query metrics
- Web UI สำหรับดู metrics และสร้าง graphs
- Auto-discovery Kong metrics endpoint

### 4. Konga Admin GUI
- Web UI สำหรับจัดการ Kong (community alternative)
- Dashboard สำหรับ services, routes, consumers
- Plugin management ผ่าน Web interface

## วิธีการใช้งาน

### 1. เริ่มต้น services:
```bash
docker-compose up -d
```

### 2. ตรวจสอบสถานะ:
```bash
docker-compose ps
```

### 3. เข้าใช้งาน Kong Admin API:
```bash
# ตรวจสอบสถานะ Kong
curl http://localhost:8001

# ดูรายการ services
curl http://localhost:8001/services

# ดูรายการ routes
curl http://localhost:8001/routes

# ดูรายการ plugins
curl http://localhost:8001/plugins
```

### 4. เข้าใช้งาน Konga (Kong Admin GUI):
- URL: http://localhost:1337
- การตั้งค่าครั้งแรก:
  1. สร้าง Admin user account
  2. เพิ่ม Kong connection: `http://kong-gateway:8001`
  3. เริ่มจัดการ Kong ผ่าน Web UI

### 5. เข้าใช้งาน Prometheus:
- URL: http://localhost:9090
- ใน Prometheus คุณสามารถ query metrics ต่างๆ เช่น:
  - `kong_http_requests_total`: จำนวน HTTP requests
  - `kong_latency_bucket`: latency distribution
  - `kong_bandwidth_bytes`: bandwidth usage

### 6. ดู Kong Metrics:
```bash
# ดู metrics ทั้งหมดที่ Kong export
curl http://localhost:8001/metrics
```

## การสร้าง Service และ Route สำหรับทดสอบ

### 1. สร้าง Service:
```bash
curl -i -X POST http://localhost:8001/services \
  --data "name=example-service" \
  --data "url=http://httpbin.org"
```

### 2. สร้าง Route:
```bash
curl -i -X POST http://localhost:8001/services/example-service/routes \
  --data "hosts[]=example.com" \
  --data "paths[]=/test"
```

### 3. ทดสอบการใช้งาน:
```bash
# ส่ง request ผ่าน Kong proxy
curl -i -H "Host: example.com" http://localhost:8000/test/get

# ตรวจสอบ metrics หลังจากส่ง request
curl http://localhost:8001/metrics | grep kong_http_requests_total
```

## การ Monitor ใน Community Edition

### ใน Kong Community คุณสามารถ monitor ได้ผ่าน:

1. **Admin API**:
   - `/status`: สถานะของ Kong
   - `/metrics`: Prometheus metrics
   - Services/Routes/Consumers statistics

2. **Prometheus Metrics**:
   - HTTP request counts
   - Response times
   - Bandwidth usage
   - Error rates
   - Plugin-specific metrics

3. **Logs**:
   - Access logs (proxy และ admin)
   - Error logs
   - Plugin logs

### ตัวอย่าง Prometheus Queries:

```promql
# Total requests per service
sum(rate(kong_http_requests_total[5m])) by (service)

# Average latency
histogram_quantile(0.95, rate(kong_latency_bucket[5m]))

# Error rate
sum(rate(kong_http_requests_total{status=~"5.."}[5m])) / sum(rate(kong_http_requests_total[5m]))

# Bandwidth usage
sum(rate(kong_bandwidth_bytes[5m])) by (type, service)
```

## ข้อจำกัดของ Community Edition

Community Edition ไม่มีฟีเจอร์เหล่านี้ (ต้องใช้ Enterprise):
- Kong Manager (Web GUI)
- Dev Portal
- Kong Vitals (built-in analytics)
- RBAC (Role-Based Access Control)
- Enterprise plugins

แต่คุณยังสามารถ monitor ได้ผ่าน:
- Prometheus + Grafana
- ELK Stack สำหรับ logs
- Custom dashboards

## การแก้ไขปัญหา

### 1. ตรวจสอบ Kong status:
```bash
docker-compose logs kong-gateway
```

### 2. ตรวจสอบ Database connection:
```bash
docker-compose logs kong-database
```

### 3. ตรวจสอบ Prometheus:
```bash
docker-compose logs prometheus
```

### 4. Restart services:
```bash
docker-compose restart kong-gateway
```

## การเพิ่ม Grafana (Optional)

หากต้องการ visualization ที่สวยงามกว่า สามารถเพิ่ม Grafana:

```yaml
  grafana:
    image: grafana/grafana:latest
    container_name: kong-grafana
    networks:
      - kong-ee-net
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
```

แล้วใช้ Grafana dashboard สำหรับ Kong monitoring!
