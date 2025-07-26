const VaultManager = require('./vault-manager');

class ConfigManager {
  constructor() {
    this.vault = new VaultManager();
    this.config = {};
    this.isLoaded = false;
  }

  /**
   * โหลด configuration จาก Vault
   */
  async loadConfig() {
    console.log('📥 Loading configuration from Vault...');
    
    try {
      // โหลด database configuration
      const dbConfig = await this.vault.readSecret('myapp/database');
      if (dbConfig) {
        this.config.database = dbConfig;
        console.log('   ✅ Database config loaded');
      }

      // โหลด API keys
      const apiConfig = await this.vault.readSecret('myapp/api');
      if (apiConfig) {
        this.config.api = apiConfig;
        console.log('   ✅ API config loaded');
      }

      // โหลด JWT configuration
      const jwtConfig = await this.vault.readSecret('myapp/jwt');
      if (jwtConfig) {
        this.config.jwt = jwtConfig;
        console.log('   ✅ JWT config loaded');
      }

      this.isLoaded = true;
      console.log('✅ Configuration loaded successfully');
      
    } catch (error) {
      console.error('❌ Failed to load configuration:', error.message);
      throw error;
    }
  }

  /**
   * ดึงค่า configuration
   */
  get(path, defaultValue = null) {
    if (!this.isLoaded) {
      throw new Error('Configuration not loaded. Call loadConfig() first.');
    }

    const keys = path.split('.');
    let value = this.config;
    
    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        return defaultValue;
      }
    }
    
    return value;
  }

  /**
   * ตั้งค่า environment variables จาก Vault
   */
  async setupEnvironmentVariables() {
    console.log('🔧 Setting up environment variables...');
    
    const mappings = {
      'DB_HOST': 'database.host',
      'DB_USER': 'database.username', 
      'DB_PASS': 'database.password',
      'DB_NAME': 'database.name',
      'JWT_SECRET': 'jwt.secret',
      'API_KEY': 'api.external_key'
    };

    for (const [envVar, configPath] of Object.entries(mappings)) {
      try {
        const value = this.get(configPath);
        if (value) {
          process.env[envVar] = value;
          console.log(`   ✅ ${envVar} set from vault`);
        }
      } catch (error) {
        console.warn(`   ⚠️  Failed to set ${envVar}: ${error.message}`);
      }
    }
  }

  /**
   * แสดง configuration (ซ่อน sensitive data)
   */
  displayConfig() {
    console.log('\n📋 Current Configuration:');
    
    if (this.config.database) {
      console.log('   Database:');
      console.log(`     Host: ${this.config.database.host || 'N/A'}`);
      console.log(`     User: ${this.config.database.username || 'N/A'}`);
      console.log(`     Password: ${'*'.repeat((this.config.database.password || '').length)}`);
      console.log(`     Database: ${this.config.database.name || 'N/A'}`);
    }

    if (this.config.api) {
      console.log('   API:');
      Object.keys(this.config.api).forEach(key => {
        const value = this.config.api[key];
        console.log(`     ${key}: ${'*'.repeat(value.length)}`);
      });
    }

    if (this.config.jwt) {
      console.log('   JWT:');
      console.log(`     Secret: ${'*'.repeat((this.config.jwt.secret || '').length)}`);
    }
  }

  /**
   * Reload configuration
   */
  async reload() {
    console.log('🔄 Reloading configuration...');
    this.config = {};
    this.isLoaded = false;
    this.vault.clearCache();
    await this.loadConfig();
  }
}

module.exports = ConfigManager;
