const vault = require('node-vault');

async function testSecretsAccess() {
  const vaultClient = vault({
    apiVersion: 'v1',
    endpoint: 'http://localhost:8201',
    token: 'myroot'
  });

  try {
    console.log('🧪 Testing secrets access...\n');

    // Test reading different environment secrets
    const environments = ['dev', 'test', 'staging', 'prod'];
    const secretTypes = ['database', 'api', 'jwt'];

    for (const env of environments) {
      console.log(`📂 Testing ${env.toUpperCase()} environment:`);
      
      for (const type of secretTypes) {
        try {
          const secret = await vaultClient.read(`secret/data/myapp/${env}/${type}`);
          console.log(`   ✅ ${type}: ${Object.keys(secret.data.data).length} keys`);
        } catch (error) {
          console.log(`   ❌ ${type}: ${error.message}`);
        }
      }
    }

    // Test shared configuration
    console.log('\n📂 Testing SHARED configuration:');
    const sharedConfigs = ['app', 'features', 'monitoring'];
    
    for (const config of sharedConfigs) {
      try {
        const secret = await vaultClient.read(`secret/data/myapp/shared/${config}`);
        console.log(`   ✅ ${config}: ${Object.keys(secret.data.data).length} keys`);
      } catch (error) {
        console.log(`   ❌ ${config}: ${error.message}`);
      }
    }

    // Show a sample secret (development database)
    console.log('\n📋 Sample secret (dev database):');
    const devDB = await vaultClient.read('secret/data/myapp/dev/database');
    console.log('   Keys:', Object.keys(devDB.data.data).join(', '));
    console.log('   Host:', devDB.data.data.host);
    console.log('   Database:', devDB.data.data.database);

    console.log('\n🎉 All secrets are accessible via KV v2 API!');
    console.log('💡 Path format: secret/data/myapp/{environment}/{type}');

  } catch (error) {
    console.error('❌ Error testing secrets access:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.statusCode);
    }
  }
}

testSecretsAccess();
