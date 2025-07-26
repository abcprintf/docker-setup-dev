# Vault Test Application

Node.js application สำหรับทดสอบการใช้งาน HashiCorp Vault

## Features

- 🔐 เชื่อมต่อกับ HashiCorp Vault
- ⚙️ จัดการ Configuration จาก Vault
- 🔑 อ่าน/เขียน Secrets
- 📋 Cache Management
- 🌐 Web Interface สำหรับทดสอบ
- 🧪 Unit Tests
- 📊 Real-time Status Monitoring

## Prerequisites

- Node.js 16+
- HashiCorp Vault (running at http://localhost:8201)
- Vault Root Token: `myroot`

## Installation

```bash
# Install dependencies
npm install

# Setup Vault with test data
npm run setup

# Start the application
npm start
```

## Usage

### 1. Setup Vault Data

ก่อนรันแอปพลิเคชัน ให้ setup ข้อมูลใน Vault:

```bash
npm run setup
```

คำสั่งนี้จะสร้าง secrets ต่างๆ ใน Vault:
- `myapp/database` - Database configuration
- `myapp/api` - API keys และ external services
- `myapp/jwt` - JWT configuration
- `myapp/users` - User management settings
- `myapp/services` - External services configuration

### 2. Start Application

```bash
# Production mode
npm start

# Development mode (with nodemon)
npm run dev
```

### 3. Access Web Interface

เปิดเว็บเบราว์เซอร์และไปที่: http://localhost:3000

## API Endpoints

### Health Check
```bash
GET /health
```

### Vault Status
```bash
GET /api/vault/status
```

### Configuration
```bash
# Get current configuration
GET /api/config

# Reload configuration from Vault
POST /api/config/reload
```

### Secrets Management
```bash
# List secrets
GET /api/vault/secrets?path=myapp/

# Read specific secret
GET /api/vault/secret/:path

# Write secret
POST /api/vault/secret/:path

# Delete secret
DELETE /api/vault/secret/:path
```

### Cache Management
```bash
# Get cache statistics
GET /api/vault/cache

# Clear cache
DELETE /api/vault/cache
```

### Database Test
```bash
# Test database connection using Vault secrets
GET /api/database/test
```

## Environment Variables

```bash
# Vault Configuration
VAULT_ADDR=http://localhost:8201
VAULT_TOKEN=myroot

# Application Configuration
PORT=3000
NODE_ENV=development
```

## Configuration Structure

แอปพลิเคชันจะโหลด configuration จาก Vault ตาม structure นี้:

```
secret/myapp/
├── database/          # Database configuration
│   ├── host
│   ├── port
│   ├── username
│   ├── password
│   └── name
├── api/               # API keys
│   ├── external_key
│   ├── stripe_secret
│   └── sendgrid_key
├── jwt/               # JWT configuration
│   ├── secret
│   ├── expiration
│   └── issuer
├── users/             # User management
│   ├── default_role
│   └── admin_emails
└── services/          # External services
    ├── redis_url
    ├── elasticsearch_url
    └── rabbitmq_url
```

## Code Examples

### Basic Usage

```javascript
const VaultManager = require('./vault-manager');

// Create Vault client
const vault = new VaultManager({
  endpoint: 'http://localhost:8201',
  token: 'myroot'
});

// Test connection
await vault.testConnection();

// Write secret
await vault.writeSecret('myapp/test', {
  key: 'value',
  password: 'secret123'
});

// Read secret
const secret = await vault.readSecret('myapp/test');
console.log(secret); // { key: 'value', password: 'secret123' }
```

### Configuration Management

```javascript
const ConfigManager = require('./config-manager');

// Create config manager
const config = new ConfigManager();

// Load all configuration from Vault
await config.loadConfig();

// Setup environment variables
await config.setupEnvironmentVariables();

// Access configuration
const dbHost = config.get('database.host');
const jwtSecret = config.get('jwt.secret');
```

### Using with Express.js

```javascript
const express = require('express');
const VaultManager = require('./vault-manager');

const app = express();
const vault = new VaultManager();

// Middleware to load secrets
app.use(async (req, res, next) => {
  try {
    req.secrets = await vault.readSecret('myapp/api');
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to load secrets' });
  }
});

app.get('/api/data', (req, res) => {
  // Use secrets from middleware
  const apiKey = req.secrets.external_key;
  // ... rest of your logic
});
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Structure

```javascript
const VaultManager = require('./vault-manager');

describe('VaultManager', () => {
  let vault;
  
  beforeAll(() => {
    vault = new VaultManager();
  });
  
  test('should connect to Vault', async () => {
    const status = await vault.testConnection();
    expect(status.sealed).toBe(false);
  });
  
  test('should handle secrets', async () => {
    await vault.writeSecret('test/data', { key: 'value' });
    const result = await vault.readSecret('test/data');
    expect(result.key).toBe('value');
  });
});
```

## Security Best Practices

### 1. Token Management

```javascript
// ❌ Don't hardcode tokens
const vault = new VaultManager({
  token: 'myroot'  // Bad!
});

// ✅ Use environment variables
const vault = new VaultManager({
  token: process.env.VAULT_TOKEN
});
```

### 2. Error Handling

```javascript
// ✅ Always handle Vault errors
try {
  const secret = await vault.readSecret('path/to/secret');
  if (!secret) {
    throw new Error('Secret not found');
  }
  return secret;
} catch (error) {
  console.error('Vault error:', error.message);
  // Handle fallback or throw appropriate error
}
```

### 3. Caching

```javascript
// ✅ Use caching for frequently accessed secrets
const vault = new VaultManager({
  cacheTimeout: 5 * 60 * 1000  // 5 minutes
});

// Clear cache when needed
if (configChanged) {
  vault.clearCache();
}
```

## Troubleshooting

### Common Issues

1. **Connection Failed**
   ```bash
   # Check if Vault is running
   curl http://localhost:8201/v1/sys/health
   
   # Check environment variables
   echo $VAULT_ADDR
   echo $VAULT_TOKEN
   ```

2. **Secret Not Found**
   ```bash
   # List available secrets
   curl -H "X-Vault-Token: myroot" \
     http://localhost:8201/v1/secret/metadata/myapp/
   ```

3. **Permission Denied**
   ```bash
   # Check token capabilities
   curl -H "X-Vault-Token: myroot" \
     -X POST \
     http://localhost:8201/v1/sys/capabilities-self \
     -d '{"path": "secret/data/myapp/database"}'
   ```

### Debugging

Enable debug logging:

```javascript
// Add to your code
const vault = new VaultManager({
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN
});

// Override console.log for debugging
const originalLog = console.log;
console.log = (...args) => {
  originalLog(`[${new Date().toISOString()}]`, ...args);
};
```

## Production Deployment

### Environment Variables

```bash
# Production .env
VAULT_ADDR=https://vault.company.com:8200
VAULT_TOKEN=s.xyz123...
NODE_ENV=production
PORT=3000

# Optional: Cache settings
VAULT_CACHE_TIMEOUT=300000  # 5 minutes
```

### Health Checks

```bash
# Application health
curl http://localhost:3000/health

# Vault connectivity
curl http://localhost:3000/api/vault/status
```

### Monitoring

```javascript
// Add monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});
```

## Development

### Project Structure

```
test-myapp/
├── app.js                 # Main Express application
├── vault-manager.js       # Vault client wrapper
├── config-manager.js      # Configuration management
├── setup-vault.js         # Vault data setup script
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables
├── public/
│   └── index.html        # Web interface
└── tests/
    └── vault-manager.test.js  # Unit tests
```

### Adding New Features

1. **New Secret Path**
   ```javascript
   // Add to setup-vault.js
   await vault.writeSecret('myapp/newservice', {
     api_key: 'new_service_key',
     endpoint: 'https://api.newservice.com'
   });
   
   // Add to config-manager.js
   const serviceConfig = await this.vault.readSecret('myapp/newservice');
   if (serviceConfig) {
     this.config.newservice = serviceConfig;
   }
   ```

2. **New API Endpoint**
   ```javascript
   // Add to app.js
   app.get('/api/newservice/config', (req, res) => {
     try {
       const config = configManager.get('newservice');
       res.json({ success: true, config });
     } catch (error) {
       res.status(500).json({ success: false, error: error.message });
     }
   });
   ```

## License

MIT License
