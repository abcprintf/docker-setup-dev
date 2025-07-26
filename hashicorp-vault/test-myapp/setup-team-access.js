const vault = require('node-vault');

async function setupTeamAccess() {
  const vaultClient = vault({
    apiVersion: 'v1',
    endpoint: 'http://localhost:8201',
    token: 'myroot' // Admin token
  });

  try {
    console.log('🔧 Setting up team access for Vault...\n');

    // 1. เปิดใช้ userpass authentication method
    console.log('1. Enabling userpass authentication...');
    try {
      await vaultClient.write('sys/auth/userpass', {
        type: 'userpass'
      });
      console.log('✅ Userpass auth enabled');
    } catch (error) {
      if (error.message.includes('path is already in use')) {
        console.log('ℹ️  Userpass auth already enabled');
      } else {
        throw error;
      }
    }

    // 2. สร้าง Policies สำหรับ roles ต่างๆ
    console.log('\n2. Creating team policies...');
    
    // Developer Policy - อ่านได้เฉพาะ dev secrets
    const devPolicy = `
# Developer Policy - สำหรับ development environment เท่านั้น
path "secret/data/myapp/dev/*" {
  capabilities = ["read", "list"]
}

path "secret/data/myapp/shared/*" {
  capabilities = ["read", "list"]
}

path "secret/data/myapp/test/*" {
  capabilities = ["read", "list"]
}

# ไม่สามารถเข้าถึง production
path "secret/data/myapp/prod/*" {
  capabilities = ["deny"]
}

path "secret/data/myapp/staging/*" {
  capabilities = ["deny"]
}

# อ่าน metadata ได้
path "secret/metadata/myapp/dev/*" {
  capabilities = ["read", "list"]
}
`;

    await vaultClient.write('sys/policy/developer', {
      policy: devPolicy
    });
    console.log('✅ Developer policy created');

    // QA/Tester Policy - อ่านได้ทั้ง dev และ test
    const qaPolicy = `
# QA/Tester Policy
path "secret/data/myapp/dev/*" {
  capabilities = ["read", "list"]
}

path "secret/data/myapp/test/*" {
  capabilities = ["read", "list", "create", "update"]
}

path "secret/data/myapp/staging/*" {
  capabilities = ["read", "list"]
}

path "secret/data/myapp/shared/*" {
  capabilities = ["read", "list"]
}

# ไม่สามารถเข้าถึง production
path "secret/data/myapp/prod/*" {
  capabilities = ["deny"]
}
`;

    await vaultClient.write('sys/policy/qa-tester', {
      policy: qaPolicy
    });
    console.log('✅ QA/Tester policy created');

    // DevOps Policy - เข้าถึงได้เกือบทุกอย่าง
    const devopsPolicy = `
# DevOps Policy
path "secret/data/myapp/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

path "secret/metadata/myapp/*" {
  capabilities = ["read", "list", "delete"]
}

# สามารถจัดการ auth methods
path "auth/userpass/users/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# อ่าน policies ได้
path "sys/policy/*" {
  capabilities = ["read", "list"]
}
`;

    await vaultClient.write('sys/policy/devops', {
      policy: devopsPolicy
    });
    console.log('✅ DevOps policy created');

    // Team Lead Policy - เข้าถึง staging และบางส่วนของ production
    const teamLeadPolicy = `
# Team Lead Policy
path "secret/data/myapp/dev/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

path "secret/data/myapp/test/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

path "secret/data/myapp/staging/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

path "secret/data/myapp/shared/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# อ่าน production ได้แต่ไม่สามารถแก้ไข
path "secret/data/myapp/prod/*" {
  capabilities = ["read", "list"]
}
`;

    await vaultClient.write('sys/policy/team-lead', {
      policy: teamLeadPolicy
    });
    console.log('✅ Team Lead policy created');

    // 3. สร้าง Users สำหรับทีม
    console.log('\n3. Creating team users...');

    // Developer Users
    const developers = [
      { username: 'dev1', password: 'dev1pass123', name: 'นาย Developer หนึ่ง' },
      { username: 'dev2', password: 'dev2pass123', name: 'นาง Developer สอง' },
      { username: 'dev3', password: 'dev3pass123', name: 'นาย Developer สาม' }
    ];

    for (const dev of developers) {
      await vaultClient.write(`auth/userpass/users/${dev.username}`, {
        password: dev.password,
        policies: 'developer'
      });
      console.log(`✅ Developer user created: ${dev.username} (${dev.name})`);
    }

    // QA Users
    const qaUsers = [
      { username: 'qa1', password: 'qa1pass123', name: 'นาย QA หนึ่ง' },
      { username: 'qa2', password: 'qa2pass123', name: 'นาง QA สอง' }
    ];

    for (const qa of qaUsers) {
      await vaultClient.write(`auth/userpass/users/${qa.username}`, {
        password: qa.password,
        policies: 'qa-tester'
      });
      console.log(`✅ QA user created: ${qa.username} (${qa.name})`);
    }

    // DevOps Users
    const devopsUsers = [
      { username: 'devops1', password: 'devops1pass123', name: 'นาย DevOps หนึ่ง' },
      { username: 'devops2', password: 'devops2pass123', name: 'นาง DevOps สอง' }
    ];

    for (const devops of devopsUsers) {
      await vaultClient.write(`auth/userpass/users/${devops.username}`, {
        password: devops.password,
        policies: 'devops'
      });
      console.log(`✅ DevOps user created: ${devops.username} (${devops.name})`);
    }

    // Team Lead
    await vaultClient.write('auth/userpass/users/teamlead', {
      password: 'teamleadpass123',
      policies: 'team-lead'
    });
    console.log('✅ Team Lead user created: teamlead');

    // 4. สร้าง Environment-specific secrets
    console.log('\n4. Setting up environment-specific secrets...');

    // Development secrets
    await vaultClient.write('secret/data/myapp/dev/database', {
      data: {
        host: 'dev-db.company.com',
        port: 3306,
        username: 'dev_user',
        password: 'dev_password_123',
        database: 'myapp_dev'
      }
    });

    await vaultClient.write('secret/data/myapp/dev/api', {
      data: {
        stripe_key: 'sk_test_dev_stripe_key',
        sendgrid_key: 'SG.dev_sendgrid_key',
        external_api: 'dev_external_api_key'
      }
    });

    console.log('✅ Development secrets created');

    // Test secrets
    await vaultClient.write('secret/data/myapp/test/database', {
      data: {
        host: 'test-db.company.com',
        port: 3306,
        username: 'test_user',
        password: 'test_password_456',
        database: 'myapp_test'
      }
    });

    console.log('✅ Test secrets created');

    // Staging secrets
    await vaultClient.write('secret/data/myapp/staging/database', {
      data: {
        host: 'staging-db.company.com',
        port: 5432,
        username: 'staging_user',
        password: 'staging_password_789',
        database: 'myapp_staging'
      }
    });

    console.log('✅ Staging secrets created');

    // Production secrets (high security)
    await vaultClient.write('secret/data/myapp/prod/database', {
      data: {
        host: 'prod-db-cluster.company.com',
        port: 5432,
        username: 'prod_user_encrypted',
        password: 'super_secret_prod_password_2024',
        database: 'myapp_production'
      }
    });

    await vaultClient.write('secret/data/myapp/prod/api', {
      data: {
        stripe_key: 'sk_live_real_production_stripe_key',
        sendgrid_key: 'SG.real_production_sendgrid_key',
        external_api: 'real_production_external_api_key'
      }
    });

    console.log('✅ Production secrets created');

    // Shared configuration
    await vaultClient.write('secret/data/myapp/shared/app', {
      data: {
        app_name: 'MyApp',
        company: 'IGENCO',
        version: '1.0.0',
        support_email: 'support@company.com'
      }
    });

    console.log('✅ Shared configuration created');

    // 5. แสดงสรุปผล
    console.log('\n🎉 Team access setup completed!\n');
    console.log('📋 User Accounts Created:');
    console.log('┌─────────────┬──────────────────┬─────────────────┐');
    console.log('│ Username    │ Password         │ Role            │');
    console.log('├─────────────┼──────────────────┼─────────────────┤');
    console.log('│ dev1        │ dev1pass123      │ Developer       │');
    console.log('│ dev2        │ dev2pass123      │ Developer       │'); 
    console.log('│ dev3        │ dev3pass123      │ Developer       │');
    console.log('│ qa1         │ qa1pass123       │ QA/Tester       │');
    console.log('│ qa2         │ qa2pass123       │ QA/Tester       │');
    console.log('│ devops1     │ devops1pass123   │ DevOps          │');
    console.log('│ devops2     │ devops2pass123   │ DevOps          │');
    console.log('│ teamlead    │ teamleadpass123  │ Team Lead       │');
    console.log('└─────────────┴──────────────────┴─────────────────┘');

    console.log('\n🔐 Access Permissions:');
    console.log('• Developer: อ่านได้เฉพาะ dev/, test/, shared/');
    console.log('• QA/Tester: อ่าน/เขียนได้ dev/, test/, staging/, shared/');
    console.log('• Team Lead: เข้าถึงได้ทุกอย่างยกเว้น prod/ (อ่านอย่างเดียว)');
    console.log('• DevOps: เข้าถึงได้ทุกอย่าง รวมถึง user management');

    console.log('\n🌐 How to login:');
    console.log('# ตัวอย่างการ login สำหรับ developer');
    console.log('vault auth -method=userpass username=dev1 password=dev1pass123');
    console.log('');
    console.log('# หรือใช้ environment variables');
    console.log('export VAULT_AUTH_METHOD=userpass');
    console.log('export VAULT_USERNAME=dev1');
    console.log('export VAULT_PASSWORD=dev1pass123');

  } catch (error) {
    console.error('❌ Error setting up team access:', error.message);
    process.exit(1);
  }
}

setupTeamAccess();