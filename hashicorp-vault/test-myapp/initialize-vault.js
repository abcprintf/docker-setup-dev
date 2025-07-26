const vault = require('node-vault');

async function initializeVault() {
  try {
    console.log('🔧 Initializing Vault in production mode...\n');

    // Create vault client without token first
    const vaultClient = vault({
      apiVersion: 'v1',
      endpoint: 'http://localhost:8201'
    });

    // Check if Vault is already initialized
    const status = await vaultClient.status();
    console.log('📊 Vault status:');
    console.log(`   Sealed: ${status.sealed}`);
    console.log(`   Initialized: ${status.initialized}`);

    if (!status.initialized) {
      console.log('\n🔐 Initializing Vault...');
      
      // Initialize Vault with 1 key share and threshold
      const initResult = await vaultClient.init({
        secret_shares: 1,
        secret_threshold: 1
      });

      console.log('✅ Vault initialized successfully!');
      console.log('\n🔑 Save these keys safely:');
      console.log('Root Token:', initResult.root_token);
      console.log('Unseal Key:', initResult.keys[0]);

      // Unseal the vault
      console.log('\n🔓 Unsealing Vault...');
      await vaultClient.unseal({ secret_shares: 1, key: initResult.keys[0] });
      
      // Set the root token for future operations
      vaultClient.token = initResult.root_token;
      console.log('✅ Vault unsealed successfully!');

      // Create a setup script with the tokens
      const setupScript = `#!/bin/bash
# Vault Setup Variables
export VAULT_ADDR='http://localhost:8201'
export VAULT_TOKEN='${initResult.root_token}'
export VAULT_UNSEAL_KEY='${initResult.keys[0]}'

echo "🎉 Vault setup complete!"
echo "Root Token: $VAULT_TOKEN"
echo "Unseal Key: $VAULT_UNSEAL_KEY"
`;

      require('fs').writeFileSync('/Users/abcprintf/DATA/_serverIGENCO/docker-setup-dev/hashicorp-vault/vault-setup.sh', setupScript);
      console.log('\n📝 Setup script saved to vault-setup.sh');

      return {
        root_token: initResult.root_token,
        unseal_key: initResult.keys[0]
      };

    } else {
      console.log('✅ Vault is already initialized');
      
      if (status.sealed) {
        console.log('⚠️  Vault is sealed. You need to unseal it manually.');
        console.log('Run: vault operator unseal <unseal_key>');
      } else {
        console.log('✅ Vault is ready to use');
      }
      
      return null;
    }

  } catch (error) {
    console.error('❌ Error initializing Vault:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.statusCode);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

initializeVault().then((result) => {
  if (result) {
    console.log('\n🚀 Next steps:');
    console.log('1. Run: source vault-setup.sh');
    console.log('2. Run: node setup-kv-engine.js');
    console.log('3. Run: node create-environment-secrets.js');
    console.log('4. Run: node setup-team-access.js');
  }
});
