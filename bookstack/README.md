โปรเจกต์นี้ใช้สำหรับติดตั้ง BookStack และฐานข้อมูล MariaDB ผ่าน Docker Compose

## วิธีการติดตั้ง

### 1. เตรียมเครื่อง
- ติดตั้ง Docker และ Docker Compose ให้เรียบร้อย
- Clone โปรเจกต์นี้มาที่เครื่อง

### 2. ตรวจสอบ/แก้ไขค่าต่าง ๆ ใน `docker-compose.yml`
- `APP_URL` กำหนด URL สำหรับเรียกใช้งาน (เช่น http://localhost:6875)
- ตรวจสอบ `APP_KEY` ว่าถูกต้อง หากไม่มีกำหนดให้เข้า container แล้วรัน:
  ```
  docker exec -it bookstack php artisan key:generate --show
  ```
  แล้วนำค่าที่ได้ไปใส่ใน `APP_KEY`
- ตรวจสอบชื่อฐานข้อมูล, ชื่อผู้ใช้ และรหัสผ่านให้ตรงกันระหว่าง `bookstack` และ `mariadb`

### 3. สั่งรัน container
```
docker-compose up -d
```

### 4. การเข้าใช้งาน
- เปิดเว็บเบราว์เซอร์ไปที่ [http://localhost:6875](http://localhost:6875)

### 5. การหยุดและลบ container
```
docker-compose down
```

### 6. การสำรองข้อมูล
- ข้อมูลของแอปจะถูกเก็บไว้ที่โฟลเดอร์:
  - `./bookstack_app_data`
  - `./bookstack_db_data`
- ควรสำรองโฟลเดอร์เหล่านี้เป็นระยะ ๆ

---

> **Tip**: หากมีการเปลี่ยนแปลงเวอร์ชัน ให้แก้ไข `image` เวอร์ชัน ใน `docker-compose.yml` แล้วสั่ง:
```
docker-compose pull
docker-compose up -d
```

## Auth
```bash
admin@admin.com
password
```