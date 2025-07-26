# Team Access Guide for HashiCorp Vault

## Quick Start for Team Members

### 1. Setup Team Access (Admin Only)
```bash
# เฉพาะ Admin/DevOps ทำครั้งแรก
node setup-team-access.js
```

### 2. Access Methods

#### Web UI (Recommended for Beginners)
1. เปิด browser: http://localhost:8000
2. เลือก Authentication Method: **Userpass**
3. ใส่ username/password ตามที่ได้รับ

#### Command Line
```bash
# Login ด้วย script
node team-login.js

# หรือ manual login
vault auth -method=userpass username=YOUR_USERNAME password=YOUR_PASSWORD

# หรือ export variables
export VAULT_ADDR=http://localhost:8201
export VAULT_TOKEN=$(vault write -field=token auth/userpass/login username=YOUR_USERNAME password=YOUR_PASSWORD)
```

### 3. Team Accounts

| Role | Username | Access Level |
|------|----------|-------------|
| Developer | dev1, dev2, dev3 | Dev & Test environments |
| QA/Tester | qa1, qa2 | Dev, Test & Staging |
| Team Lead | teamlead | All except Prod (read-only) |
| DevOps | devops1, devops2 | Full access |

### 4. Available Secrets by Role

#### Developers (dev1, dev2, dev3)
```bash
# สามารถอ่านได้
vault kv get secret/myapp/dev/database
vault kv get secret/myapp/dev/api
vault kv get secret/myapp/test/database
vault kv get secret/myapp/shared/app

# ไม่สามารถเข้าถึง
vault kv get secret/myapp/prod/database  # ❌ Forbidden
```

#### QA/Testers (qa1, qa2)
```bash
# สามารถอ่าน/เขียนได้
vault kv put secret/myapp/test/config key=value
vault kv get secret/myapp/staging/database

# ไม่สามารถเข้าถึง production
vault kv get secret/myapp/prod/database  # ❌ Forbidden
```

#### Team Lead (teamlead)
```bash
# เข้าถึงได้เกือบทุกอย่าง
vault kv get secret/myapp/dev/database
vault kv get secret/myapp/staging/database
vault kv get secret/myapp/prod/database    # ✅ Read-only
vault kv put secret/myapp/prod/database key=value  # ❌ Forbidden
```

#### DevOps (devops1, devops2)
```bash
# เข้าถึงได้ทุกอย่าง
vault kv put secret/myapp/prod/database host=new-host
vault policy write new-policy policy.hcl
vault auth-enable github
```

### 5. Common Commands

```bash
# ดู secrets ที่เข้าถึงได้
vault kv list secret/myapp/

# อ่าน secret
vault kv get secret/myapp/dev/database

# เขียน secret (ถ้ามีสิทธิ์)
vault kv put secret/myapp/dev/config debug=true

# ดู policies ที่มี
vault token lookup -format=json | jq .data.policies

# ต่ออายุ token
vault token renew
```

### 6. Environment Integration

#### Node.js Application
```javascript
const vault = require('node-vault');

// Login ด้วย team credentials
const vaultClient = vault({
  apiVersion: 'v1',
  endpoint: 'http://localhost:8201'
});

const result = await vaultClient.userpassLogin({
  username: process.env.VAULT_USERNAME,
  password: process.env.VAULT_PASSWORD
});

vaultClient.token = result.auth.client_token;

// ใช้งาน secrets ตาม permission
const config = await vaultClient.read('secret/data/myapp/dev/database');
```

### 7. Security Best Practices

1. **อย่าแชร์ passwords**: ทุกคนมี account ของตัวเอง
2. **ใช้ strong passwords**: password ยาวและซับซ้อน
3. **Token expiry**: ต่ออายุ token เมื่อจำเป็น
4. **Principle of least privilege**: เข้าถึงเฉพาะที่จำเป็น
5. **Audit logs**: กิจกรรมทั้งหมดถูก log ไว้

### 8. Troubleshooting

#### Permission Denied
```bash
# ตรวจสอบ policies ที่มี
vault token lookup

# ตรวจสอบว่า path ถูกต้องหรือไม่
vault kv list secret/myapp/

# Login ใหม่ถ้า token หมดอายุ
node team-login.js
```

#### Token Expired
```bash
# ต่ออายุ token
vault token renew

# หรือ login ใหม่
vault auth -method=userpass username=YOUR_USERNAME
```

### 9. Contact Information

- **DevOps Team**: devops@company.com
- **Vault Admin**: vault-admin@company.com
- **Emergency**: emergency@company.com

## Environment Specific Access

### Development
- **Purpose**: การพัฒนาและทดสอบ local
- **Access**: Developers, QA, Team Lead, DevOps
- **Data**: ข้อมูลทดสอบ, database ท้องถิ่น

### Test/Staging
- **Purpose**: การทดสอบก่อน release
- **Access**: QA, Team Lead, DevOps
- **Data**: ข้อมูลใกล้เคียงกับ production

### Production
- **Purpose**: ระบบจริงที่ใช้งาน
- **Access**: DevOps (full), Team Lead (read-only)
- **Data**: ข้อมูลจริง, sensitive information