const vault = require('node-vault');

async function testTeamAccess() {
  console.log('🔐 Testing team user access...\n');

  // Test different user accounts
  const testUsers = [
    { username: 'dev1', password: 'dev1pass123', role: 'Developer' },
    { username: 'qa1', password: 'qa1pass123', role: 'QA/Tester' },
    { username: 'devops1', password: 'devops1pass123', role: 'DevOps' },
    { username: 'teamlead', password: 'teamleadpass123', role: 'Team Lead' }
  ];

  for (const user of testUsers) {
    console.log(`👤 Testing ${user.role} (${user.username}):`);
    
    try {
      // Create a new vault client for this user
      const userVault = vault({
        apiVersion: 'v1',
        endpoint: 'http://localhost:8201'
      });

      // Login with userpass
      const loginResult = await userVault.userpassLogin({
        username: user.username,
        password: user.password
      });

      // Set the token for subsequent requests
      userVault.token = loginResult.auth.client_token;
      
      console.log('   ✅ Login successful');
      
      // Test access to different environments
      const accessTests = [
        { path: 'secret/data/myapp/dev/database', env: 'development' },
        { path: 'secret/data/myapp/test/database', env: 'test' },
        { path: 'secret/data/myapp/staging/database', env: 'staging' },
        { path: 'secret/data/myapp/prod/database', env: 'production' },
        { path: 'secret/data/myapp/shared/app', env: 'shared' }
      ];

      for (const test of accessTests) {
        try {
          await userVault.read(test.path);
          console.log(`   ✅ Can read ${test.env}`);
        } catch (error) {
          if (error.response?.statusCode === 403) {
            console.log(`   🚫 Cannot read ${test.env} (permission denied)`);
          } else {
            console.log(`   ❌ Error reading ${test.env}: ${error.message}`);
          }
        }
      }

    } catch (error) {
      console.log(`   ❌ Login failed: ${error.message}`);
    }
    
    console.log('');
  }

  console.log('🎉 Team access testing completed!');
}

testTeamAccess().catch(console.error);
