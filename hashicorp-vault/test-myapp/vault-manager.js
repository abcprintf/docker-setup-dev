const vault = require('node-vault');

class VaultManager {
  constructor(options = {}) {
    this.client = vault({
      apiVersion: 'v1',
      endpoint: options.endpoint || process.env.VAULT_ADDR || 'http://localhost:8201',
      token: options.token || process.env.VAULT_TOKEN
    });
    
    this.cache = new Map();
    this.cacheTimeout = options.cacheTimeout || 5 * 60 * 1000; // 5 minutes
  }

  /**
   * ทดสอบการเชื่อมต่อกับ Vault
   */
  async testConnection() {
    try {
      const status = await this.client.status();
      console.log('✅ Vault connection successful');
      console.log(`   - Sealed: ${status.sealed}`);
      console.log(`   - Version: ${status.version}`);
      return status;
    } catch (error) {
      console.error('❌ Vault connection failed:', error.message);
      throw error;
    }
  }

  /**
   * เขียน secret ไปยัง Vault
   */
  async writeSecret(path, data) {
    try {
      // For KV v2, use kv.write method
      const result = await this.client.write(`secret/data/${path}`, {
        data: data
      });
      console.log(`✅ Secret written to: secret/${path}`);
      
      // Clear cache for this path
      this.cache.delete(path);
      
      return result;
    } catch (error) {
      console.error(`❌ Error writing secret to ${path}:`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.statusCode);
        console.error('Response body:', error.response.body);
      }
      throw error;
    }
  }

  /**
   * อ่าน secret จาก Vault (มี caching)
   */
  async readSecret(path) {
    // ตรวจสอบ cache ก่อน
    const cacheKey = path;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log(`📋 Using cached secret: secret/${path}`);
        return cached.data;
      }
    }

    try {
      const result = await this.client.read(`secret/data/${path}`);
      const secretData = result.data.data; // KV v2 format
      
      // เก็บใน cache
      this.cache.set(cacheKey, {
        data: secretData,
        timestamp: Date.now()
      });
      
      console.log(`✅ Secret read from: secret/${path}`);
      return secretData;
    } catch (error) {
      if (error.response && error.response.statusCode === 404) {
        console.warn(`⚠️  Secret not found: secret/${path}`);
        return null;
      }
      console.error(`❌ Error reading secret from ${path}:`, error.message);
      throw error;
    }
  }

  /**
   * ลบ secret
   */
  async deleteSecret(path) {
    try {
      await this.client.delete(`secret/data/${path}`);
      console.log(`🗑️  Secret deleted: secret/${path}`);
      
      // Clear cache
      this.cache.delete(path);
    } catch (error) {
      console.error(`❌ Error deleting secret ${path}:`, error.message);
      throw error;
    }
  }

  /**
   * แสดงรายการ secrets
   */
  async listSecrets(path = '') {
    try {
      const result = await this.client.list(`secret/metadata/${path}`);
      return result.data.keys;
    } catch (error) {
      if (error.response && error.response.statusCode === 404) {
        return [];
      }
      console.error(`❌ Error listing secrets:`, error.message);
      throw error;
    }
  }

  /**
   * สร้าง Policy
   */
  async createPolicy(name, policy) {
    try {
      await this.client.addPolicy({
        name: name,
        rules: policy
      });
      console.log(`✅ Policy created: ${name}`);
    } catch (error) {
      console.error(`❌ Error creating policy ${name}:`, error.message);
      throw error;
    }
  }

  /**
   * Authentication ด้วย userpass
   */
  async loginWithUserPass(username, password) {
    try {
      const result = await this.client.userpassLogin({
        username: username,
        password: password
      });

      // อัพเดท token
      this.client.token = result.auth.client_token;
      
      console.log(`✅ Logged in as: ${username}`);
      console.log(`   - Policies: ${result.auth.policies.join(', ')}`);
      console.log(`   - Token TTL: ${result.auth.lease_duration}s`);
      
      return {
        token: result.auth.client_token,
        policies: result.auth.policies,
        lease_duration: result.auth.lease_duration
      };
    } catch (error) {
      console.error(`❌ Login failed for ${username}:`, error.message);
      throw error;
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log('🧹 Cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

module.exports = VaultManager;
