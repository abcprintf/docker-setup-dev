# HashiCorp Vault - Secrets Management

HashiCorp Vault เป็นเครื่องมือสำหรับจัดการ secrets, encryption keys และการควบคุมการเข้าถึงข้อมูลสำคัญอย่างปลอดภัย

## ความต้องการระบบ

- Docker และ Docker Compose
- พอร์ต 8201 สำหรับ Vault API และ Web UI (เปลี่ยนจาก 8200 เพื่อหลีกเลี่ยงการชนกัน)
- RAM อย่างน้อย 512MB
- Storage สำหรับเก็บข้อมูล (ในโหมด Production)

## การติดตั้ง

### 1. เตรียมโครงสร้างไฟล์

```bash
mkdir -p hashicorp-vault/config
cd hashicorp-vault
```

### 2. รัน Vault

```bash
docker-compose up -d
```

### 3. ตรวจสอบสถานะ

```bash
docker-compose logs -f vault
```

### 4. เข้าถึง Vault Web UI

เปิดเว็บเบราว์เซอร์และไปที่:
```
http://localhost:8201
```

## การตั้งค่าเริ่มต้น (Development Mode)

**สำคัญ**: การตั้งค่าปัจจุบันใช้โหมด Development ซึ่งเหมาะสำหรับการทดสอบเท่านั้น

### 1. เข้าสู่ระบบ

- **Root Token**: `myroot` (ตั้งค่าไว้ในไฟล์ docker-compose.yml)
- **URL**: `http://localhost:8201`

ใน Dev mode ไม่ต้อง Initialize หรือ Unseal เพราะ Vault จะทำให้อัตโนมัติ

### 2. การเข้าถึงผ่าน CLI

```bash
# เข้าไปใน container
docker-compose exec vault sh

# ตั้งค่า environment
export VAULT_ADDR='http://0.0.0.0:8201'
export VAULT_TOKEN='myroot'

# ทดสอบการเชื่อมต่อ
vault status
```

## การเปลี่ยนเป็น Production Mode

⚠️ **สำคัญ**: Dev mode ไม่เหมาะสำหรับการใช้งานจริง เพื่อเปลี่ยนเป็น Production mode:

### 1. แก้ไขไฟล์ docker-compose.yml

```yaml
services:
  vault:
    image: hashicorp/vault:latest
    container_name: vault
    restart: unless-stopped
    ports:
      - "8201:8201"
    volumes:
      - vault-data:/vault/data
      - vault-logs:/vault/logs
      - ./config:/vault/config
    cap_add:
      - IPC_LOCK
    environment:
      VAULT_ADDR: 'http://0.0.0.0:8201'
    command: vault server -config=/vault/config/vault.hcl
```

### 2. สร้างไฟล์ config/vault.hcl

```hcl
storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address       = "0.0.0.0:8201"
  tls_disable   = true
}

ui = true
disable_mlock = true
api_addr = "http://0.0.0.0:8201"
cluster_addr = "http://0.0.0.0:8202"
```

### 3. Initialize และ Unseal

```bash
# Initialize Vault (ทำครั้งเดียวเท่านั้น)
docker-compose exec vault vault operator init

# Unseal ด้วย 3 keys จาก 5 keys
docker-compose exec vault vault operator unseal <key1>
docker-compose exec vault vault operator unseal <key2>
docker-compose exec vault vault operator unseal <key3>
```

## การใช้งานพื้นฐาน

### การจัดการ Secrets

```bash
# เก็บ secret
vault kv put secret/myapp username=admin password=secretpass

# อ่าน secret
vault kv get secret/myapp

# ลบ secret
vault kv delete secret/myapp

# แสดงรายการ secrets
vault kv list secret/
```

### การสร้าง Policy

```bash
# สร้างไฟล์ policy
cat > myapp-policy.hcl << EOF
path "secret/data/myapp/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
EOF

# นำเข้า policy
vault policy write myapp-policy myapp-policy.hcl
```

### การจัดการ Authentication

```bash
# เปิดใช้ userpass auth method
vault auth enable userpass

# สร้าง user
vault write auth/userpass/users/myuser \
    password=mypassword \
    policies=myapp-policy

# Login ด้วย user
vault auth -method=userpass username=myuser password=mypassword
```

## การกำหนดค่าขั้นสูง

### การใช้ TLS/SSL

แก้ไขไฟล์ `config/vault.hcl`:

```hcl
listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_disable   = false
  tls_cert_file = "/vault/config/vault.crt"
  tls_key_file  = "/vault/config/vault.key"
}
```

### Database Backend (แทน File Backend)

แก้ไข docker-compose.yml เพื่อเพิ่ม PostgreSQL:

```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: vault
      POSTGRES_USER: vault
      POSTGRES_PASSWORD: vaultpass
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

แก้ไข vault configuration:

```hcl
storage "postgresql" {
  connection_url = "postgres://vault:vaultpass@postgres:5432/vault?sslmode=disable"
}
```

## Environment Variables

| Variable | ค่าเริ่มต้น | คำอธิบาย |
|----------|-------------|----------|
| `VAULT_ADDR` | `https://0.0.0.0:8200` | Vault server address |
| `VAULT_TOKEN` | - | Token สำหรับ authentication |
| `VAULT_SKIP_VERIFY` | `false` | ข้าม SSL verification |
| `VAULT_FORMAT` | `table` | รูปแบบ output |

## คำสั่งที่มีประโยชน์

### การจัดการ Container

```bash
# ตรวจสอบสถานะ
docker-compose ps

# ดู logs
docker-compose logs vault

# เข้าไปใน container
docker-compose exec vault sh

# รีสตาร์ท
docker-compose restart vault

# หยุดการทำงาน
docker-compose down

# หยุดและลบข้อมูล
docker-compose down -v
```

### การตรวจสอบสถานะ Vault

```bash
# สถานะ Vault
vault status

# ตรวจสอบ seal status
vault operator key-status

# แสดงรายการ auth methods
vault auth list

# แสดงรายการ secrets engines
vault secrets list
```

### การ Backup และ Restore

```bash
# Backup
docker-compose exec vault vault operator raft snapshot save backup.snap

# Restore
docker-compose exec vault vault operator raft snapshot restore backup.snap
```

## การแก้ไขปัญหา

### Vault ถูก Sealed

```bash
# ตรวจสอบสถานะ
vault status

# Unseal ด้วย keys (ต้องใช้ 3 keys)
vault operator unseal <key1>
vault operator unseal <key2>
vault operator unseal <key3>
```

### ไม่สามารถเข้าถึงได้

1. ตรวจสอบว่าพอร์ต 8200 เปิดอยู่
2. ตรวจสอบ logs: `docker-compose logs vault`
3. ตรวจสอบ firewall settings

### หน่วยความจำไม่พอ

เพิ่ม memory limit ใน docker-compose.yml:

```yaml
services:
  vault:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

### Permission Denied

```bash
# เปลี่ยน ownership ของ directory
sudo chown -R 100:1000 ./config
sudo chown -R 100:1000 ./data
```

## ความปลอดภัย

### ⚠️ คำเตือนสำคัญ

1. **เก็บ Unseal Keys และ Root Token อย่างปลอดภัย**
2. **ไม่ใช้ Root Token ในการใช้งานประจำ**
3. **เปิดใช้ TLS ในสภาพแวดล้อมการผลิต**
4. **ตั้งค่า Auto-unseal ในการใช้งานจริง**
5. **สร้าง backup เป็นประจำ**

### แนวทางปฏิบัติที่ดี

```bash
# สร้าง admin user แทนการใช้ root token
vault auth enable userpass
vault policy write admin-policy - << EOF
path "*" {
  capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}
EOF

vault write auth/userpass/users/admin \
    password=strongpassword \
    policies=admin-policy

# ปิดการใช้งาน root token (ระวัง!)
vault token revoke <root-token>
```

## การ Monitor และ Audit

### เปิดใช้ Audit Log

```bash
vault audit enable file file_path=/vault/logs/audit.log
```

### Health Check

```bash
curl -s http://localhost:8201/v1/sys/health | jq
```

## ตัวอย่างการใช้งาน

### 1. เก็บ Database Credentials

```bash
vault kv put secret/database/mysql \
    host=mysql.example.com \
    username=dbuser \
    password=dbpass123
```

### 2. Dynamic Secrets สำหรับ Database

```bash
# เปิดใช้ database secrets engine
vault secrets enable database

# กำหนดค่า database connection
vault write database/config/mysql \
    plugin_name=mysql-database-plugin \
    connection_url="{{username}}:{{password}}@tcp(mysql:3306)/" \
    allowed_roles="readonly"

# สร้าง role
vault write database/roles/readonly \
    db_name=mysql \
    creation_statements="CREATE USER '{{name}}'@'%' IDENTIFIED BY '{{password}}';GRANT SELECT ON *.* TO '{{name}}'@'%';" \
    default_ttl="1h" \
    max_ttl="24h"

# ขอ credentials
vault read database/creds/readonly
```

### 3. PKI (Certificate Authority)

```bash
# เปิดใช้ PKI
vault secrets enable pki
vault secrets tune -max-lease-ttl=87600h pki

# สร้าง root CA
vault write pki/root/generate/internal \
    common_name=example.com \
    ttl=87600h

# กำหนดค่า URLs
vault write pki/config/urls \
    issuing_certificates="http://localhost:8201/v1/pki/ca" \
    crl_distribution_points="http://localhost:8201/v1/pki/crl"

# สร้าง role
vault write pki/roles/example-dot-com \
    allowed_domains=example.com \
    allow_subdomains=true \
    max_ttl=72h

# ขอ certificate
vault write pki/issue/example-dot-com \
    common_name=test.example.com
```

## API Examples

### REST API

```bash
# Health check
curl http://localhost:8201/v1/sys/health

# List secrets (ต้อง authentication)
curl -H "X-Vault-Token: $VAULT_TOKEN" \
     http://localhost:8201/v1/secret/metadata

# Read secret
curl -H "X-Vault-Token: $VAULT_TOKEN" \
     http://localhost:8201/v1/secret/data/myapp
```

## Integration กับ Applications

### Python Example

```python
import hvac

# สร้าง client
client = hvac.Client(url='http://localhost:8201')

# Login
client.token = 'your-token'

# เขียน secret
client.secrets.kv.v2.create_or_update_secret(
    path='myapp',
    secret={'username': 'admin', 'password': 'secret'}
)

# อ่าน secret
response = client.secrets.kv.v2.read_secret_version(path='myapp')
secret = response['data']['data']
print(f"Username: {secret['username']}")
```

### Environment Variables Integration

```bash
# Export Vault token
export VAULT_TOKEN=$(vault write -field=token auth/aws/login role=my-role)

# ใช้ใน application
export DB_PASSWORD=$(vault kv get -field=password secret/database/mysql)
```

## ลิงค์ที่เป็นประโยชน์

- [HashiCorp Vault Documentation](https://www.vaultproject.io/docs)
- [Vault API Documentation](https://www.vaultproject.io/api-docs)
- [Docker Hub - Vault](https://hub.docker.com/r/hashicorp/vault)
- [Vault Tutorials](https://learn.hashicorp.com/vault)
- [Vault GitHub Repository](https://github.com/hashicorp/vault)

## License

HashiCorp Vault ใช้ Business Source License (BSL) 1.1
