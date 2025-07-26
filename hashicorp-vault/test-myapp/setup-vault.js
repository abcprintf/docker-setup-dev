const vault = require('node-vault');

async function setupVaultData() {
  console.log('🚀 Setting up Vault with test data...\n');
  
  // Create vault client directly
  const vaultClient = vault({
    apiVersion: 'v1',
    endpoint: process.env.VAULT_ADDR || 'http://localhost:8201',
    token: process.env.VAULT_TOKEN || 'myroot'
  });
  
  try {
    // 1. ทดสอบการเชื่อมต่อ
    console.log('1. Testing Vault connection...');
    const status = await vaultClient.status();
    console.log('✅ Vault connection successful');
    console.log(`   - Sealed: ${status.sealed}`);
    console.log(`   - Version: ${status.version}`);
    console.log('');

    // 2. สร้าง Database Configuration
    console.log('2. Creating database configuration...');
    await vaultClient.write('secret/data/myapp/database', {
      data: {
        host: 'localhost',
        port: 3306,
        username: 'myapp_user',
        password: 'super_secret_password',
        name: 'myapp_devmix',
        ssl: false,
        connectionLimit: 10
      }
    });
    console.log('✅ Secret written to: secret/myapp/database');
    console.log('');

    // 3. สร้าง API Configuration
    console.log('3. Creating API configuration...');
    await vaultClient.write('secret/data/myapp/api', {
      data: {
        external_key: 'api_key_12345',
        stripe_secret: 'sk_test_12345',
        sendgrid_key: 'SG.12345',
        rate_limit: 1000
      }
    });
    console.log('✅ Secret written to: secret/myapp/api');
    console.log('');

    // 4. สร้าง JWT Configuration
    console.log('4. Creating JWT configuration...');
    await vaultClient.write('secret/data/myapp/jwt', {
      data: {
        secret: 'jwt_super_secret_key_2023',
        expiration: '24h',
        issuer: 'myapp.example.com'
      }
    });
    console.log('✅ Secret written to: secret/myapp/jwt');
    console.log('');

    // 5. สร้าง User Management Configuration
    console.log('5. Creating user management configuration...');
    await vaultClient.write('secret/data/myapp/users', {
      data: {
        default_role: 'user',
        admin_emails: ['admin@example.com'],
        password_min_length: 8,
        session_timeout: 3600
      }
    });
    console.log('✅ Secret written to: secret/myapp/users');
    console.log('');

    // 6. สร้าง External Services Configuration
    console.log('6. Creating external services configuration...');
    await vaultClient.write('secret/data/myapp/services', {
      data: {
        redis_url: 'redis://localhost:6379',
        elasticsearch_url: 'http://localhost:9200',
        rabbitmq_url: 'amqp://localhost:5672',
        s3_bucket: 'myapp-uploads',
        s3_region: 'us-east-1'
      }
    });
    console.log('✅ Secret written to: secret/myapp/services');
    console.log('');

    // 7. แสดงรายการ secrets ที่สร้าง
    console.log('7. Listing created secrets...');
    const secretsList = await vaultClient.list('secret/metadata/myapp/');
    console.log('   Created secrets:');
    secretsList.data.keys.forEach(secret => {
      console.log(`   - myapp/${secret}`);
    });
    console.log('');

    // 8. ทดสอบการอ่าน secret
    console.log('8. Testing secret retrieval...');
    const dbConfig = await vaultClient.read('secret/data/myapp/database');
    console.log(`   Database host: ${dbConfig.data.data.host}`);
    console.log(`   Database user: ${dbConfig.data.data.username}`);
    console.log('');

    console.log('✅ Vault setup completed successfully!');
    console.log('');
    console.log('🎯 Next steps:');
    console.log('   1. Run: npm install');
    console.log('   2. Run: npm start');
    console.log('   3. Visit: http://localhost:3000');
    console.log('');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// สร้าง Policy สำหรับ application
async function createAppPolicy() {
  console.log('📝 Creating application policy...');
  
  const vaultClient = vault({
    apiVersion: 'v1',
    endpoint: process.env.VAULT_ADDR || 'http://localhost:8201',
    token: process.env.VAULT_TOKEN || 'myroot'
  });
  
  const policyRules = `
# Allow reading secrets under myapp/
path "secret/data/myapp/*" {
  capabilities = ["read"]
}

# Allow listing secrets under myapp/
path "secret/metadata/myapp/*" {
  capabilities = ["list"]
}

# Allow token renewal
path "auth/token/renew-self" {
  capabilities = ["update"]
}

# Allow token lookup
path "auth/token/lookup-self" {
  capabilities = ["read"]
}
`;

  try {
    await vaultClient.addPolicy({
      name: 'myapp-policy',
      rules: policyRules
    });
    console.log('✅ Application policy created');
  } catch (error) {
    console.error('❌ Failed to create policy:', error.message);
  }
}

// Main execution
async function main() {
  try {
    if (process.argv.includes('--policy-only')) {
      await createAppPolicy();
    } else {
      await setupVaultData();
      await createAppPolicy();
    }
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { setupVaultData, createAppPolicy };
