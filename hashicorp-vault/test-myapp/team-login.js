const vault = require('node-vault');
const readline = require('readline');

async function teamLogin() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = (question) => {
    return new Promise((resolve) => rl.question(question, resolve));
  };

  try {
    console.log('🔐 Vault Team Login Helper\n');

    const username = await askQuestion('Username: ');
    const password = await askQuestion('Password: ');

    const vaultClient = vault({
      apiVersion: 'v1',
      endpoint: process.env.VAULT_ADDR || 'http://localhost:8201'
    });

    console.log('\n🔄 Authenticating...');
    
    const result = await vaultClient.userpassLogin({
      username: username,
      password: password
    });

    console.log('\n✅ Login successful!');
    console.log(`🎫 Token: ${result.auth.client_token}`);
    console.log(`📋 Policies: ${result.auth.policies.join(', ')}`);
    console.log(`⏰ Token TTL: ${result.auth.lease_duration} seconds`);

    console.log('\n📝 Export this token:');
    console.log(`export VAULT_TOKEN=${result.auth.client_token}`);

    // ทดสอบการเข้าถึง secrets
    vaultClient.token = result.auth.client_token;
    
    console.log('\n🧪 Testing access permissions...');
    
    const testPaths = [
      'secret/data/myapp/dev/database',
      'secret/data/myapp/test/database', 
      'secret/data/myapp/staging/database',
      'secret/data/myapp/prod/database',
      'secret/data/myapp/shared/app'
    ];

    for (const path of testPaths) {
      try {
        await vaultClient.read(path);
        console.log(`✅ ${path} - ACCESSIBLE`);
      } catch (error) {
        if (error.response?.statusCode === 403) {
          console.log(`❌ ${path} - FORBIDDEN`);
        } else if (error.response?.statusCode === 404) {
          console.log(`⚠️  ${path} - NOT FOUND`);
        } else {
          console.log(`❓ ${path} - ERROR: ${error.message}`);
        }
      }
    }

  } catch (error) {
    console.error('\n❌ Login failed:', error.message);
  } finally {
    rl.close();
  }
}

teamLogin();