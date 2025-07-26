# วิธีการเข้าถึง secrets ใน Vault UI

## 🔐 การ Login ใน Vault UI

### 1. เปิด Vault UI
```
http://localhost:8201
```

### 2. วิธี Login สำหรับ Team Members

#### สำหรับ Root Admin:
- **Method**: Token
- **Token**: `myroot`

#### สำหรับ Team Members:
- **Method**: Username & Password
- **Username/Password**:
  - `dev1` / `dev1pass123` (Developer)
  - `qa1` / `qa1pass123` (QA/Tester) 
  - `devops1` / `devops1pass123` (DevOps)
  - `teamlead` / `teamleadpass123` (Team Lead)

## 📂 โครงสร้าง Secrets ที่สร้างไว้

เมื่อ login แล้ว ไปที่ **Secrets** tab และคลิก **secret/** แล้วคุณจะเห็น:

```
📁 myapp/
├── 📁 dev/          (Development Environment)
│   ├── 🔑 database   (DB credentials)
│   ├── 🔑 api        (API keys)
│   └── 🔑 jwt        (JWT secrets)
├── 📁 test/         (Test Environment)
│   ├── 🔑 database
│   ├── 🔑 api
│   └── 🔑 jwt
├── 📁 staging/      (Staging Environment) 
│   ├── 🔑 database
│   ├── 🔑 api
│   └── 🔑 jwt
├── 📁 prod/         (Production Environment)
│   ├── 🔑 database
│   ├── 🔑 api
│   └── 🔑 jwt
└── 📁 shared/       (Shared Configuration)
    ├── 🔑 app        (App settings)
    ├── 🔑 features   (Feature flags)
    └── 🔑 monitoring (Monitoring config)
```

## 🚫 สิทธิการเข้าถึงตาม Role

| Role | dev/ | test/ | staging/ | prod/ | shared/ |
|------|------|-------|----------|-------|---------|
| **Developer** | ✅ อ่าน | ✅ อ่าน | ❌ ไม่ได้ | ❌ ไม่ได้ | ✅ อ่าน |
| **QA/Tester** | ✅ อ่าน/เขียน | ✅ อ่าน/เขียน | ✅ อ่าน/เขียน | ❌ ไม่ได้ | ✅ อ่าน |
| **Team Lead** | ✅ ทุกอย่าง | ✅ ทุกอย่าง | ✅ ทุกอย่าง | ✅ อ่าน | ✅ ทุกอย่าง |
| **DevOps** | ✅ ทุกอย่าง | ✅ ทุกอย่าง | ✅ ทุกอย่าง | ✅ ทุกอย่าง | ✅ ทุกอย่าง |

## 📝 ตัวอย่างการใช้งาน

### 1. ดู Database Credentials สำหรับ Development
1. Login ด้วย `dev1` / `dev1pass123`
2. ไปที่ **Secrets → secret → myapp → dev → database**
3. คลิก **👁️ View** เพื่อดู credentials

### 2. แก้ไข API Keys สำหรับ Test Environment
1. Login ด้วย `qa1` / `qa1pass123` 
2. ไปที่ **Secrets → secret → myapp → test → api**
3. คลิก **✏️ Edit** เพื่อแก้ไข
4. บันทึกการเปลี่ยนแปลง

### 3. ดู Production Secrets (เฉพาะ DevOps/Team Lead)
1. Login ด้วย `devops1` / `devops1pass123`
2. ไปที่ **Secrets → secret → myapp → prod → database**
3. จะเห็น production database credentials

## 🔍 การตรวจสอบ Secrets

หากไม่เห็น secrets ใน UI:

1. **ตรวจสอบ Login**: ให้แน่ใจว่า login ถูกต้อง
2. **ตรวจสอบ Permissions**: บาง role อาจไม่มีสิทธิเข้าถึงบาง environment
3. **รอสักครู่**: บางครั้ง UI ต้องการเวลาโหลด
4. **Refresh หน้า**: กด F5 หรือ refresh browser

## 🚀 ขั้นวย่อในการใช้งาน

1. ✅ **เปิด Vault UI**: http://localhost:8201
2. ✅ **เลือก Authentication Method**: Username & Password  
3. ✅ **Login ด้วย team account**: เช่น dev1/dev1pass123
4. ✅ **ไปที่ Secrets tab**: จะเห็น secret/ engine
5. ✅ **เปิด myapp folder**: จะเห็นโครงสร้าง environment ต่างๆ
6. ✅ **เลือก environment**: dev/, test/, staging/, prod/, shared/
7. ✅ **ดู secrets**: คลิกเพื่อดูหรือแก้ไข (ตามสิทธิ)

## 🎯 หมายเหตุ

- **Development Mode**: Vault กำลังใช้ dev mode เพื่อความง่ายในการทดสอบ
- **Data Persistence**: ข้อมูลจะหายเมื่อ restart container ใน dev mode
- **Security**: สำหรับ production ควรใช้ proper configuration ไม่ใช่ dev mode
- **Backup**: ควรสำรองข้อมูล secrets สำคัญก่อนทดสอบ
