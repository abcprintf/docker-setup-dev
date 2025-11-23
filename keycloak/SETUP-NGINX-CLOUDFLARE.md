# Keycloak Setup with Nginx Reverse Proxy + Cloudflare

การตั้งค่า Keycloak ให้ทำงานผ่าน Nginx Reverse Proxy และ Cloudflare สำหรับ domain: `sso.igenco.dev`

---

## 🔧 Configuration Overview

- **Domain**: `sso.igenco.dev`
- **Keycloak Internal Port**: `8099` (localhost only)
- **Nginx Reverse Proxy**: Port 80/443
- **Cloudflare**: SSL/TLS Termination

---

## 📋 Prerequisites

1. ✅ Keycloak running on `localhost:8099`
2. ✅ PostgreSQL database with `keycloak` database
3. ✅ Nginx installed
4. ✅ Domain `sso.igenco.dev` pointing to your server via Cloudflare

---

## 🚀 Setup Steps

### 1. Start Keycloak

```bash
cd /Users/abcprintf/DATA/_serverIGENCO/docker-setup-dev/keycloak
docker-compose -f docker-compose.only.yml up -d
```

### 2. Configure Nginx

#### ตัวเลือก A: Copy ไฟล์ config
```bash
sudo cp nginx-reverse-proxy.conf /etc/nginx/sites-available/keycloak
sudo ln -s /etc/nginx/sites-available/keycloak /etc/nginx/sites-enabled/
```

#### ตัวเลือก B: หรือเพิ่มใน existing Nginx config
นำเนื้อหาจาก `nginx-reverse-proxy.conf` ไปใส่ในไฟล์ config ของคุณ

### 3. ติดตั้ง SSL Certificate

#### ตัวเลือก A: Cloudflare Origin Certificate (แนะนำ)

1. ไปที่ Cloudflare Dashboard → SSL/TLS → Origin Server
2. สร้าง Origin Certificate
3. Download Certificate และ Private Key
4. บันทึกไฟล์:
   ```bash
   sudo mkdir -p /etc/nginx/ssl/cloudflare
   sudo nano /etc/nginx/ssl/cloudflare/sso.igenco.dev.pem
   # paste certificate
   
   sudo nano /etc/nginx/ssl/cloudflare/sso.igenco.dev.key
   # paste private key
   ```
5. แก้ไขใน nginx config:
   ```nginx
   ssl_certificate /etc/nginx/ssl/cloudflare/sso.igenco.dev.pem;
   ssl_certificate_key /etc/nginx/ssl/cloudflare/sso.igenco.dev.key;
   ```

#### ตัวเลือก B: Let's Encrypt (ถ้าไม่ใช้ Cloudflare Origin Certificate)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d sso.igenco.dev
```

### 4. Test Nginx Configuration

```bash
sudo nginx -t
```

### 5. Restart Nginx

```bash
sudo systemctl restart nginx
```

---

## ☁️ Cloudflare Configuration

### 1. SSL/TLS Settings

ไปที่ Cloudflare Dashboard → SSL/TLS

- **SSL/TLS encryption mode**: `Full (strict)` หรือ `Full`
  - ใช้ `Full (strict)` ถ้าใช้ Cloudflare Origin Certificate
  - ใช้ `Full` ถ้าใช้ Let's Encrypt

### 2. DNS Settings

ตรวจสอบให้แน่ใจว่า DNS record ชี้ไปที่ server ของคุณ:

```
Type: A
Name: sso
Content: <your-server-ip>
Proxy status: Proxied (ส้ม ☁️)
```

### 3. Firewall Rules (Optional)

ไปที่ Security → WAF → Create rule

เพื่อเพิ่มความปลอดภัยให้กับ Keycloak Admin Console:

```
Expression: (http.host eq "sso.igenco.dev" and http.request.uri.path contains "/admin")
Action: Challenge (Managed Challenge)
```

### 4. Page Rules (Optional)

สร้าง Page Rule เพื่อ optimize performance:

```
URL: sso.igenco.dev/*
Settings:
  - Cache Level: Bypass
  - SSL: Full (strict)
```

---

## ✅ Verify Setup

### 1. Check Keycloak is Running

```bash
docker ps | grep keycloak
curl http://localhost:8099/health
```

### 2. Check Nginx

```bash
sudo systemctl status nginx
curl -I https://sso.igenco.dev
```

### 3. Access Keycloak

เปิดเบราว์เซอร์ไปที่:

- **Frontend**: https://sso.igenco.dev
- **Admin Console**: https://sso.igenco.dev/admin
- **Account Console**: https://sso.igenco.dev/realms/master/account

**Admin Credentials**:
- Username: `admin`
- Password: `admin_password_change_me`

---

## 🔍 Troubleshooting

### ปัญหา: Too many redirects

**สาเหตุ**: Cloudflare SSL mode ไม่ตรงกับ Nginx

**แก้ไข**:
- ตั้ง Cloudflare SSL/TLS mode เป็น `Full` หรือ `Full (strict)`
- ตรวจสอบว่า Nginx มี SSL certificate ติดตั้งแล้ว

### ปัญหา: 502 Bad Gateway

**สาเหตุ**: Nginx ติดต่อ Keycloak ไม่ได้

**แก้ไข**:
```bash
# Check Keycloak is running
docker ps | grep keycloak

# Check connection
curl http://localhost:8099/health

# Check Nginx error log
sudo tail -f /var/log/nginx/keycloak_error.log
```

### ปัญหา: Invalid redirect URI

**สาเหตุ**: Keycloak hostname configuration ไม่ถูกต้อง

**แก้ไข**:
1. เข้า Admin Console
2. ไปที่ Realm Settings → General
3. ตรวจสอบ Frontend URL ว่าเป็น `https://sso.igenco.dev`

### ปัญหา: Admin Console ไม่โหลด (WebSocket error)

**สาเหตุ**: Nginx ไม่ support WebSocket

**แก้ไข**: ตรวจสอบว่ามี config นี้ใน nginx:
```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

---

## 🔒 Security Best Practices

### 1. Change Default Passwords

แก้ไขใน `docker-compose.only.yml`:
```yaml
KEYCLOAK_ADMIN_PASSWORD: <strong-password>
KC_DB_PASSWORD: keycloak1234  # เปลี่ยนเป็น strong password
```

### 2. Enable Firewall

```bash
# Allow only SSH, HTTP, HTTPS
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Restrict Admin Console Access

เพิ่มใน Nginx config:
```nginx
location /admin {
    # Allow only specific IPs
    allow <your-office-ip>;
    deny all;
    
    proxy_pass http://keycloak_backend;
    # ... other proxy settings
}
```

### 4. Enable Rate Limiting

เพิ่มใน Nginx config:
```nginx
# ด้านบนสุดของ server block
limit_req_zone $binary_remote_addr zone=keycloak_limit:10m rate=10r/s;

# ใน location /
location / {
    limit_req zone=keycloak_limit burst=20 nodelay;
    # ... proxy settings
}
```

---

## 📊 Monitoring

### Check Logs

```bash
# Keycloak logs
docker-compose -f docker-compose.only.yml logs -f keycloak

# Nginx access logs
sudo tail -f /var/log/nginx/keycloak_access.log

# Nginx error logs
sudo tail -f /var/log/nginx/keycloak_error.log
```

### Health Check Endpoints

```bash
# Ready check
curl https://sso.igenco.dev/health/ready

# Live check
curl https://sso.igenco.dev/health/live

# General health
curl https://sso.igenco.dev/health
```

---

## 🔄 Backup

### Backup Database

```bash
docker exec postgres pg_dump -U keycloak keycloak > keycloak_backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
docker exec -i postgres psql -U keycloak keycloak < keycloak_backup_YYYYMMDD.sql
```

---

## 📚 References

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Keycloak Reverse Proxy Guide](https://www.keycloak.org/server/reverseproxy)
- [Cloudflare SSL/TLS](https://developers.cloudflare.com/ssl/)
- [Nginx Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)

---

## 🎉 Success!

ถ้าทุกอย่างเรียบร้อย คุณสามารถเข้าถึง Keycloak ได้ที่:

**https://sso.igenco.dev**

🔐 Login with:
- Username: `admin`
- Password: `admin_password_change_me`
