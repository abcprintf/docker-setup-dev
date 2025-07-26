const vault = require('node-vault');

async function checkKVEngine() {
  const vaultClient = vault({
    apiVersion: 'v1',
    endpoint: 'http://localhost:8201',
    token: 'myroot'
  });

  try {
    console.log('🔍 Checking secrets engines...\n');

    // List all mounted secrets engines
    const mounts = await vaultClient.mounts();
    console.log('📋 Current secrets engines:');
    
    for (const [path, config] of Object.entries(mounts)) {
      console.log(`├── ${path} (type: ${config.type}, version: ${config.options?.version || 'v1'})`);
    }

    console.log('\n🔧 Checking KV engine configuration...');
    
    // Check if secret/ mount exists and its version
    if (mounts['secret/']) {
      const secretMount = mounts['secret/'];
      console.log('✅ Found secret/ mount:');
      console.log(`   Type: ${secretMount.type}`);
      console.log(`   Version: ${secretMount.options?.version || 'v1'}`);
      
      if (secretMount.options?.version === '2') {
        console.log('✅ KV v2 is correctly configured!');
        console.log('   You should use paths like: secret/data/myapp/...');
      } else {
        console.log('⚠️  KV is using version 1');
        console.log('   For KV v1, use paths like: secret/myapp/...');
        console.log('   To use KV v2, the mount needs to be recreated');
      }
    } else {
      console.log('❌ No secret/ mount found');
    }

    // Test reading a secret to confirm the path structure
    console.log('\n🧪 Testing secret path access...');
    
    try {
      // Try KV v2 path first
      const testRead = await vaultClient.read('secret/data/myapp/dev/database');
      console.log('✅ KV v2 path works: secret/data/...');
      console.log('   Secret exists and is accessible');
    } catch (error) {
      if (error.response?.statusCode === 404) {
        console.log('⚠️  KV v2 path not found, trying KV v1...');
        
        try {
          const testReadV1 = await vaultClient.read('secret/myapp/dev/database');
          console.log('✅ KV v1 path works: secret/...');
          console.log('   You should use KV v1 paths (without /data/)');
        } catch (errorV1) {
          console.log('❌ Neither KV v1 nor v2 paths work');
          console.log('   Secret may not exist yet');
        }
      } else {
        console.log('❌ Error accessing secret:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Error checking KV engine:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.statusCode);
      console.error('Response data:', error.response.data);
    }
  }
}

checkKVEngine();
