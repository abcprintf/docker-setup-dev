[ภาษาไทย](README_TH.md) | [English](README.md)

# new-docker-setup (ภาษาไทย)

## โครงสร้างโฟลเดอร์หลัก

## ภาพรวมโครงการ

โปรเจกต์นี้เป็นชุดของเครื่องมือและบริการต่าง ๆ ที่รันแยกกันในแต่ละ container ด้วย Docker และ Docker Compose เหมาะสำหรับการตั้งค่า ทดสอบ และจัดการแอปพลิเคชันหรือโครงสร้างพื้นฐานแบบ open-source หลายตัวในสภาพแวดล้อมที่แยกจากกันอย่างเป็นระบบ โดยแต่ละโฟลเดอร์จะมี Docker setup พร้อมใช้งานสำหรับแต่ละบริการ

คุณสามารถสั่ง start, stop และจัดการแต่ละบริการได้อย่างอิสระ เหมาะกับการทดลองหรือใช้งานในสภาพแวดล้อม development

## คำอธิบายแต่ละบริการ

| โฟลเดอร์                | บริการ/เครื่องมือ         | คำอธิบาย |
|-------------------------|---------------------------|-----------|
| apache-tika-server      | Apache Tika Server        | ดึงข้อความและ metadata จากไฟล์เอกสารต่าง ๆ |
| bookstack               | BookStack                 | Wiki และระบบจัดการความรู้ |
| chat2db                 | Chat2DB                   | เครื่องมือจัดการและ query ฐานข้อมูล |
| elasticsearch           | Elasticsearch Stack       | ระบบค้นหาและวิเคราะห์ข้อมูล |
| ferretdb                | FerretDB                  | ฐานข้อมูล MongoDB ที่ใช้ PostgreSQL เป็น backend |
| hashicorp-vault         | HashiCorp Vault           | จัดการความลับและการเข้ารหัสข้อมูล |
| infisical               | Infisical                 | จัดการ secret สำหรับนักพัฒนา |
| jenkins                 | Jenkins                   | ระบบ automation สำหรับ CI/CD |
| jsreport                | jsreport                  | ระบบสร้างรายงานและไฟล์ PDF |
| jsoncrack               | JSON Crack                | เครื่องมือดูและแก้ไข JSON แบบ visual |
| kong                    | Kong                      | API gateway และจัดการ API |
| minio                   | MinIO                     | ระบบ object storage ที่ compatible กับ S3 |
| mongodb                 | MongoDB                   | ฐานข้อมูล NoSQL แบบ document |
| mysql                   | MySQL                     | ฐานข้อมูลเชิงสัมพันธ์ (Relational DB) |
| n8n                     | n8n                       | ระบบ workflow automation |
| neko                    | Neko                      | บริการ virtual browser streaming |
| nextcloud               | Nextcloud                 | ระบบแชร์ไฟล์และทำงานร่วมกัน |
| nginx                   | Nginx                     | เว็บเซิร์ฟเวอร์และ reverse proxy |
| nginxproxymanager       | Nginx Proxy Manager       | UI สำหรับจัดการ Nginx proxy |
| onlyoffice              | OnlyOffice                | ชุดเครื่องมือแก้ไขเอกสารออนไลน์ |
| openldap                | OpenLDAP                  | LDAP directory server |
| oracle                  | Oracle Database           | ฐานข้อมูลเชิงสัมพันธ์ Oracle |
| owncloud                | ownCloud                  | ระบบแชร์ไฟล์และทำงานร่วมกัน |
| paperless-ngx           | Paperless-ngx             | ระบบจัดการเอกสาร (DMS) |
| portainer               | Portainer                 | UI สำหรับจัดการ Docker container |
| postgres                | PostgreSQL                | ฐานข้อมูลเชิงสัมพันธ์ PostgreSQL |
| postgres-pgvector       | PostgreSQL + pgvector     | PostgreSQL พร้อม vector search extension |
| prometheus-grafana      | Prometheus & Grafana      | ระบบมอนิเตอร์และแสดงผลข้อมูล |
| rabbitMQ                | RabbitMQ                  | ระบบ message broker (AMQP) |
| redis-server            | Redis                     | ฐานข้อมูล key-value ในหน่วยความจำ |
| RocketChat              | Rocket.Chat               | ระบบแชทและทำงานร่วมกันในทีม |
| scylladb                | ScyllaDB                  | ฐานข้อมูล NoSQL ประสิทธิภาพสูง |
| seafile                 | Seafile                   | ระบบโฮสต์และแชร์ไฟล์ |
| sonarqube               | SonarQube                 | วิเคราะห์คุณภาพและความปลอดภัยของโค้ด |
| sqlserver               | SQL Server                | Microsoft SQL Server |
| stirlingpdf             | Stirling PDF              | เครื่องมือจัดการไฟล์ PDF |
| test-myapp              | Test MyApp                | ตัวอย่าง/ชุดทดสอบแอปพลิเคชัน |
| uptime-kuma             | Uptime Kuma               | ระบบมอนิเตอร์สถานะเซอร์วิส |
| webcheck                | WebCheck                  | ตรวจสอบสถานะเว็บไซต์ |
| windows                 | Windows                   | ทรัพยากรหรือ image ที่เกี่ยวกับ Windows |

```
apache-tika-server/
bookstack/
chat2db/
elasticsearch/
ferretdb/
hashicorp-vault/
infisical/
jenkins/
jsreport/
jsoncrack/
kong/
minio/
mongodb/
mysql/
n8n/
neko/
nextcloud/
nginx/
nginxproxymanager/
onlyoffice/
openldap/
oracle/
owncloud/
paperless-ngx/
portainer/
postgres/
postgres-pgvector/
prometheus-grafana/
rabbitMQ/
redis-server/
RocketChat/
scylladb/
seafile/
sonarqube/
sqlserver/
stirlingpdf/
test-myapp/
uptime-kuma/
webcheck/
windows/
```

## แนวทางการเพิ่มหรือแก้ไข Service ใหม่

1. **สร้างโฟลเดอร์ใหม่** ที่ root โดยตั้งชื่อให้สื่อความหมาย (เช่น `myservice/`)
2. **เพิ่มไฟล์ `docker-compose.yml`** (หรือ `Dockerfile` ถ้าจำเป็น) ในโฟลเดอร์นั้น ดูตัวอย่างจาก service อื่น ๆ
3. **ควรมี `README.md`** ในโฟลเดอร์ service เพื่ออธิบายการใช้งานและ config ที่สำคัญ
4. **แยก config/data** (เช่น โฟลเดอร์ `data/`, `config/`) เพื่อความเป็นระเบียบ
5. **อัปเดต README.md หลัก**
    - เพิ่มชื่อโฟลเดอร์ในรายการโครงสร้าง
    - เพิ่มคำอธิบายสั้น ๆ ในตารางบริการ
6. **ใช้ตัวพิมพ์เล็กและขีดกลาง** (lowercase, hyphen) ในชื่อโฟลเดอร์/ไฟล์
7. **ทดสอบ service** ด้วย `docker-compose up` ให้แน่ใจว่าใช้งานได้
8. **(ถ้ามี) เพิ่มไฟล์ตัวอย่าง env** เช่น `.env.example`

## การใช้งาน Git Submodules

โปรเจกต์นี้ใช้ Git submodules เพื่อรวม repository ภายนอกเข้ามา Submodules ช่วยให้เราสามารถเก็บโปรเจกต์ภายนอกเป็น repository แยกต่างหากในขณะที่รวมอยู่ในโปรเจกต์หลักของเรา

### Submodule คืออะไร?

Git submodule คือ repository ที่ฝังอยู่ในอีก repository หนึ่ง มันมี history ของตัวเองและสามารถอัปเดตแยกอิสระได้ ในโปรเจกต์นี้ เราใช้ submodules สำหรับบริการที่มี upstream repository ของตัวเอง (เช่น `jsoncrack`)

### การตั้งค่าครั้งแรก (Clone ครั้งแรก)

หากคุณกำลัง clone repository นี้ครั้งแรกและต้องการรวม submodules ทั้งหมด:

```bash
# Clone พร้อมกับ submodules ทั้งหมด
git clone --recurse-submodules https://github.com/abcprintf/docker-setup-dev.git

# หรือถ้า clone ไปแล้วโดยไม่มี submodules
git clone https://github.com/abcprintf/docker-setup-dev.git
cd docker-setup-dev
git submodule init
git submodule update
```

### การเพิ่ม Submodule ใหม่

เพื่อเพิ่ม repository ภายนอกเป็น submodule:

```bash
# เพิ่ม submodule
git submodule add <repository-url> <folder-name>

# ตัวอย่าง:
git submodule add https://github.com/AykutSarac/jsoncrack.com.git jsoncrack

# Commit การเปลี่ยนแปลง
git add .gitmodules <folder-name>
git commit -m "Add <service-name> submodule"
git push
```

### การอัปเดต Submodules

เพื่ออัปเดต submodule ให้เป็นเวอร์ชันล่าสุดจาก repository ต้นทาง:

```bash
# อัปเดต submodule เฉพาะตัวเป็นเวอร์ชันล่าสุด
cd <submodule-folder>
git pull origin main  # หรือ master ขึ้นกับชื่อ branch

# กลับไปที่โปรเจกต์หลักและ commit การอัปเดต
cd ..
git add <submodule-folder>
git commit -m "Update <submodule-name> to latest version"
git push
```

หรืออัปเดต submodules ทั้งหมดพร้อมกัน:

```bash
# อัปเดต submodules ทั้งหมดเป็น commit ล่าสุด
git submodule update --remote --merge

# Commit การอัปเดต
git add .
git commit -m "Update all submodules"
git push
```

### ตรวจสอบสถานะ Submodule

```bash
# ดูสถานะ submodule
git submodule status

# ดูการตั้งค่า submodule
cat .gitmodules
```

### การลบ Submodule

หากต้องการลบ submodule:

```bash
# ลบ entry ของ submodule จาก .git/config
git submodule deinit -f <submodule-folder>

# ลบ submodule จาก working tree และ .git/modules
git rm -f <submodule-folder>

# Commit การเปลี่ยนแปลง
git commit -m "Remove <submodule-name> submodule"
git push
```

### ปัญหาที่พบบ่อยกับ Submodule

**ปัญหา: โฟลเดอร์ submodule ว่างเปล่าหลัง clone**
```bash
git submodule init
git submodule update
```

**ปัญหา: Detached HEAD ใน submodule**
```bash
cd <submodule-folder>
git checkout main  # หรือ branch ที่ต้องการ
cd ..
```

**ปัญหา: การเปลี่ยนแปลงใน submodule ไม่ถูก track**
- Submodules ถูก track เป็น commit เฉพาะ ไม่ใช่ branch
- หลังจากอัปเดตใน submodule ต้องกลับมาที่ parent repository และ commit การเปลี่ยนแปลง

### แนวทางปฏิบัติที่ดี

1. **ควร commit การอัปเดต submodule เสมอ** ใน parent repository หลังจากอัปเดต submodule
2. **จดบันทึกว่า branch ไหน** ที่แต่ละ submodule ควร track (โดยทั่วไปคือ `main` หรือ `master`)
3. **สื่อสารกับทีม** เมื่อมีการอัปเดต submodules เพื่อหลีกเลี่ยง conflicts
4. **ใช้ flag `--recurse-submodules`** เมื่อ clone เพื่อ initialize submodules โดยอัตโนมัติ
5. **ตรวจสอบสถานะ submodule เป็นประจำ** ด้วย `git submodule status`

## การ contribute หรือแจ้งปัญหา

### วิธี contribute

1. fork repo นี้และสร้าง branch ใหม่สำหรับการแก้ไข
2. แก้ไขตาม convention ของโปรเจกต์
3. ทดสอบให้แน่ใจว่าใช้งานได้
4. ส่ง Pull Request (PR) มาที่ branch `main` พร้อมคำอธิบาย
5. รอการ review และ feedback

### การแจ้งปัญหา

หากพบ bug หรืออยากเสนอฟีเจอร์ใหม่ ให้เปิด issue ใน GitHub repo พร้อมรายละเอียด (ขั้นตอน, log, screenshot ฯลฯ)

### ช่องทางติดต่อ

สอบถามหรือพูดคุยเพิ่มเติม ใช้ GitHub Issues หรือ comment ใน Pull Request หรือทักเจ้าของ repo ได้ที่ [abcprintf](https://github.com/abcprintf)
