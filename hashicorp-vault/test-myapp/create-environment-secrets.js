const vault = require('node-vault');

async function createEnvironmentSecrets() {
  const vaultClient = vault({
    apiVersion: 'v1',
    endpoint: 'http://localhost:8201',
    token: 'myroot'
  });

  try {
    console.log('🔧 Creating environment-specific secrets...\n');

    // === DEVELOPMENT ENVIRONMENT ===
    console.log('📝 Creating Development environment secrets...');
    
    await vaultClient.write('secret/data/myapp/dev/database', {
      data: {
        host: 'dev-db.company.local',
        port: 3306,
        username: 'dev_user',
        password: 'dev_password_123',
        database: 'myapp_dev',
        ssl: false,
        connectionLimit: 10
      }
    });

    await vaultClient.write('secret/data/myapp/dev/api', {
      data: {
        stripe_key: 'sk_test_dev_stripe_key_here',
        sendgrid_key: 'SG.dev_sendgrid_key_here',
        external_api: 'dev_external_api_key_123',
        payment_webhook: 'https://dev.company.com/webhook/payment'
      }
    });

    await vaultClient.write('secret/data/myapp/dev/jwt', {
      data: {
        secret: 'dev_jwt_secret_key_2024',
        expiry: '24h',
        algorithm: 'HS256',
        refresh_secret: 'dev_refresh_secret_2024'
      }
    });

    console.log('✅ Development secrets created');

    // === TEST ENVIRONMENT ===
    console.log('📝 Creating Test environment secrets...');
    
    await vaultClient.write('secret/data/myapp/test/database', {
      data: {
        host: 'test-db.company.local',
        port: 3306,
        username: 'test_user',
        password: 'test_password_456',
        database: 'myapp_test',
        ssl: false,
        connectionLimit: 5
      }
    });

    await vaultClient.write('secret/data/myapp/test/api', {
      data: {
        stripe_key: 'sk_test_testing_stripe_key',
        sendgrid_key: 'SG.test_sendgrid_key',
        external_api: 'test_external_api_key_456',
        payment_webhook: 'https://test.company.com/webhook/payment'
      }
    });

    await vaultClient.write('secret/data/myapp/test/jwt', {
      data: {
        secret: 'test_jwt_secret_key_2024',
        expiry: '12h',
        algorithm: 'HS256',
        refresh_secret: 'test_refresh_secret_2024'
      }
    });

    console.log('✅ Test secrets created');

    // === STAGING ENVIRONMENT ===
    console.log('📝 Creating Staging environment secrets...');
    
    await vaultClient.write('secret/data/myapp/staging/database', {
      data: {
        host: 'staging-db.company.local',
        port: 5432,
        username: 'staging_user',
        password: 'staging_password_789',
        database: 'myapp_staging',
        ssl: true,
        connectionLimit: 20
      }
    });

    await vaultClient.write('secret/data/myapp/staging/api', {
      data: {
        stripe_key: 'sk_test_staging_stripe_key',
        sendgrid_key: 'SG.staging_sendgrid_key',
        external_api: 'staging_external_api_key_789',
        payment_webhook: 'https://staging.company.com/webhook/payment'
      }
    });

    await vaultClient.write('secret/data/myapp/staging/jwt', {
      data: {
        secret: 'staging_jwt_secret_key_2024',
        expiry: '8h',
        algorithm: 'HS256',
        refresh_secret: 'staging_refresh_secret_2024'
      }
    });

    console.log('✅ Staging secrets created');

    // === PRODUCTION ENVIRONMENT ===
    console.log('📝 Creating Production environment secrets...');
    
    await vaultClient.write('secret/data/myapp/prod/database', {
      data: {
        host: 'prod-db-cluster.company.com',
        port: 5432,
        username: 'prod_user_encrypted',
        password: 'super_secret_prod_password_2024',
        database: 'myapp_production',
        ssl: true,
        connectionLimit: 50
      }
    });

    await vaultClient.write('secret/data/myapp/prod/api', {
      data: {
        stripe_key: 'sk_live_real_production_stripe_key',
        sendgrid_key: 'SG.real_production_sendgrid_key',
        external_api: 'real_production_external_api_key',
        payment_webhook: 'https://app.company.com/webhook/payment'
      }
    });

    await vaultClient.write('secret/data/myapp/prod/jwt', {
      data: {
        secret: 'production_jwt_secret_key_2024_very_secure',
        expiry: '4h',
        algorithm: 'HS256',
        refresh_secret: 'production_refresh_secret_2024_very_secure'
      }
    });

    console.log('✅ Production secrets created');

    // === SHARED CONFIGURATION ===
    console.log('📝 Creating Shared configuration...');
    
    await vaultClient.write('secret/data/myapp/shared/app', {
      data: {
        app_name: 'MyApp IGENCO',
        company: 'IGENCO',
        version: '1.0.0',
        support_email: 'support@igenco.com',
        admin_email: 'admin@igenco.com',
        debug_mode: 'false'
      }
    });

    await vaultClient.write('secret/data/myapp/shared/features', {
      data: {
        feature_flags: 'advanced_analytics,premium_support,real_time_notifications',
        rate_limit: '1000',
        max_upload_size: '50MB',
        session_timeout: '3600',
        cache_ttl: '300'
      }
    });

    await vaultClient.write('secret/data/myapp/shared/monitoring', {
      data: {
        sentry_dsn: 'https://sentry.io/projects/myapp',
        datadog_api_key: 'datadog_api_key_here',
        newrelic_license: 'newrelic_license_here',
        log_level: 'info'
      }
    });

    console.log('✅ Shared configuration created');

    // แสดงสรุป
    console.log('\n🎉 All environment secrets created successfully!\n');
    console.log('📋 Created secrets structure:');
    console.log('├── myapp/dev/        (Development)');
    console.log('│   ├── database');
    console.log('│   ├── api');
    console.log('│   └── jwt');
    console.log('├── myapp/test/       (Testing)');
    console.log('│   ├── database');
    console.log('│   ├── api');
    console.log('│   └── jwt');
    console.log('├── myapp/staging/    (Staging)');
    console.log('│   ├── database');
    console.log('│   ├── api');
    console.log('│   └── jwt');
    console.log('├── myapp/prod/       (Production)');
    console.log('│   ├── database');
    console.log('│   ├── api');
    console.log('│   └── jwt');
    console.log('└── myapp/shared/     (Shared Config)');
    console.log('    ├── app');
    console.log('    ├── features');
    console.log('    └── monitoring');

    console.log('\n🔍 Verify secrets:');
    console.log('vault kv list secret/myapp/');
    console.log('vault kv get secret/myapp/dev/database');

  } catch (error) {
    console.error('❌ Error creating environment secrets:', error.message);
    process.exit(1);
  }
}

createEnvironmentSecrets();