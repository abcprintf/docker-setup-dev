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
