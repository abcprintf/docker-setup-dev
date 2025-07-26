const vault = require('node-vault');

async function setupKVEngine() {
  const vaultClient = vault({
    apiVersion: 'v1',
    endpoint: 'http://localhost:8201',
    token: 'myroot'
  });

  try {
    console.log('🔧 Setting up KV v2 engine...\n');

    // Check current mounts
    try {
      const mounts = await vaultClient.mounts();
      console.log('📋 Current secret/ mount status:');
      
      if (mounts.data && mounts.data['secret/']) {
        const secretMount = mounts.data['secret/'];
        console.log(`   Type: ${secretMount.type}`);
        console.log(`   Version: ${secretMount.options?.version || 'v1'}`);
        
        if (secretMount.options?.version === '2') {
          console.log('✅ KV v2 is already enabled!');
          return;
        }
      }
    } catch (error) {
      console.log('⚠️  Could not check mounts, proceeding with setup...');
    }

    // Disable existing secret mount if it exists
    try {
      await vaultClient.unmount({ mount_point: 'secret' });
      console.log('🗑️  Removed existing secret/ mount');
    } catch (error) {
      console.log('ℹ️  No existing secret/ mount to remove');
    }

    // Enable KV v2 at secret/
    await vaultClient.mount({
      mount_point: 'secret',
      type: 'kv',
      options: {
        version: '2'
      }
    });

    console.log('✅ KV v2 engine enabled at secret/');
    console.log('   You can now use paths like: secret/data/myapp/...');
    
    // Test the setup
    console.log('\n🧪 Testing KV v2 setup...');
    
    // Write a test secret
    await vaultClient.write('secret/data/test', {
      data: {
        message: 'KV v2 is working!',
        timestamp: new Date().toISOString()
      }
    });
    
    console.log('✅ Successfully wrote test secret');
    
    // Read it back
    const testRead = await vaultClient.read('secret/data/test');
    console.log('✅ Successfully read test secret');
    console.log('   Data:', testRead.data.data);
    
    // Clean up test secret
    await vaultClient.delete('secret/data/test');
    console.log('✅ Test secret cleaned up');
    
    console.log('\n🎉 KV v2 engine is ready!');
    console.log('📝 Now you can run create-environment-secrets.js');

  } catch (error) {
    console.error('❌ Error setting up KV engine:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.statusCode);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

setupKVEngine();
