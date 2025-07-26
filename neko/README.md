# Neko - Virtual Browser in the Cloud

Neko เป็นเว็บแอปพลิเคชันที่ให้คุณเข้าถึงเบราว์เซอร์จากระยะไกลผ่าน WebRTC ช่วยให้หลายคนสามารถใช้เบราว์เซอร์ร่วมกันได้พร้อมกัน

## ความต้องการระบบ

- Docker และ Docker Compose
- พอร์ต 8080 สำหรับ Web Interface
- พอร์ต 56000-56100/UDP สำหรับ WebRTC

## การติดตั้ง

1. Clone หรือดาวน์โหลด docker-compose.yml

2. รันคำสั่งเพื่อเริ่มต้น Neko:
```bash
docker-compose up -d
```

3. รอให้ container เริ่มทำงาน:
```bash
docker-compose logs -f neko
```

## การเข้าถึง

เปิดเว็บเบราว์เซอร์และไปที่:
```
http://localhost:8080
```

## บัญชีผู้ใช้เริ่มต้น

### ผู้ใช้ทั่วไป (Member)
- **Username**: user
- **Password**: neko

### ผู้ดูแลระบบ (Admin)
- **Username**: admin  
- **Password**: admin

## การกำหนดค่า

### Environment Variables

| Variable | ค่าเริ่มต้น | คำอธิบาย |
|----------|-------------|----------|
| `NEKO_WEBRTC_EPR` | `56000-56100` | ช่วงพอร์ต UDP สำหรับ WebRTC |
| `NEKO_WEBRTC_NAT1TO1` | `127.0.0.1` | IP Address สำหรับ NAT mapping |
| `NEKO_MEMBER_MULTIUSER_USER_PASSWORD` | `neko` | รหัสผ่านสำหรับผู้ใช้ทั่วไป |
| `NEKO_MEMBER_MULTIUSER_ADMIN_PASSWORD` | `admin` | รหัสผ่านสำหรับผู้ดูแลระบบ |

### การเปลี่ยนรหัสผ่าน

แก้ไขไฟล์ `docker-compose.yml`:
```yaml
environment:
  NEKO_MEMBER_MULTIUSER_USER_PASSWORD: "รหัสผ่านใหม่สำหรับผู้ใช้"
  NEKO_MEMBER_MULTIUSER_ADMIN_PASSWORD: "รหัสผ่านใหม่สำหรับแอดมิน"
```

จากนั้นรีสตาร์ท container:
```bash
docker-compose down
docker-compose up -d
```

### การใช้งานผ่าน External Network

หากต้องการให้เข้าถึงได้จากเครื่องอื่น ให้เปลี่ยน `NEKO_WEBRTC_NAT1TO1` เป็น IP ของเซิร์ฟเวอร์:
```yaml
environment:
  NEKO_WEBRTC_NAT1TO1: "192.168.1.100"  # เปลี่ยนเป็น IP ของเซิร์ฟเวอร์
```

## เบราว์เซอร์ที่รองรับ

Neko รองรับเบราว์เซอร์หลายตัว:
- Firefox (default)
- Chrome/Chromium
- Edge
- VLC Player

เพื่อเปลี่ยนเบราว์เซอร์ ให้แก้ไข image ในไฟล์ docker-compose.yml:
```yaml
# สำหรับ Chrome
image: ghcr.io/m1k1o/neko/chromium:latest

# สำหรับ VLC
image: ghcr.io/m1k1o/neko/vlc:latest
```

## คำสั่งที่มีประโยชน์

### ตรวจสอบสถานะ
```bash
docker-compose ps
```

### ดู Logs
```bash
docker-compose logs neko
```

### รีสตาร์ท
```bash
docker-compose restart neko
```

### หยุดการทำงาน
```bash
docker-compose down
```

### อัพเดท Image
```bash
docker-compose pull
docker-compose down
docker-compose up -d
```

## การแก้ไขปัญหา

### ไม่สามารถเชื่อมต่อได้
1. ตรวจสอบว่าพอร์ต 8080 และ 56000-56100/UDP เปิดอยู่
2. ตรวจสอบ Firewall settings
3. ตรวจสอบ `NEKO_WEBRTC_NAT1TO1` ว่าตั้งค่า IP ถูกต้อง

### เสียงหรือวิดีโอไม่ทำงาน
1. ตรวจสอบว่าเบราว์เซอร์อนุญาต Microphone/Camera access
2. ตรวจสอบการตั้งค่า WebRTC ในเบราว์เซอร์
3. ลองใช้เบราว์เซอร์อื่น

### ประสิทธิภาพไม่ดี
1. เพิ่ม CPU/RAM ให้กับ Docker
2. ใช้ hardware acceleration (หากรองรับ)
3. ลดความละเอียดของหน้าจอ

## ความปลอดภัย

⚠️ **คำเตือน**: เปลี่ยนรหัสผ่านเริ่มต้นก่อนใช้งานจริง!

- เปลี่ยนรหัสผ่าน admin และ user ทันที
- ใช้งานผ่าน HTTPS ในสภาพแวดล้อมการผลิต
- จำกัดการเข้าถึงด้วย reverse proxy หากจำเป็น

## ลิงค์ที่เป็นประโยชน์

- [Neko GitHub Repository](https://github.com/m1k1o/neko)
- [Neko Documentation](https://neko.m1k1o.net/)
- [Docker Hub Images](https://github.com/m1k1o/neko/pkgs/container/neko)

## License

โปรเจกต์นี้ใช้ Apache License 2.0