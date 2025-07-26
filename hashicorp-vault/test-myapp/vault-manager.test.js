const VaultManager = require('./vault-manager');

describe('VaultManager', () => {
  let vault;
  
  beforeAll(() => {
    vault = new VaultManager({
      endpoint: process.env.VAULT_ADDR || 'http://localhost:8201',
      token: process.env.VAULT_TOKEN || 'myroot'
    });
  });
  
  test('should connect to Vault', async () => {
    const status = await vault.testConnection();
    expect(status).toBeDefined();
    expect(status.sealed).toBe(false);
  });
  
  test('should write and read secrets', async () => {
    const testData = {
      username: 'testuser',
      password: 'testpass',
      api_key: 'test123'
    };
    
    // Write secret
    await vault.writeSecret('test/credentials', testData);
    
    // Read secret
    const retrieved = await vault.readSecret('test/credentials');
    
    expect(retrieved).toEqual(testData);
  });
  
  test('should handle non-existent secrets', async () => {
    const result = await vault.readSecret('nonexistent/path');
    expect(result).toBeNull();
  });
  
  test('should list secrets', async () => {
    // Ensure we have at least one secret
    await vault.writeSecret('test/item1', { key: 'value1' });
    await vault.writeSecret('test/item2', { key: 'value2' });
    
    const secrets = await vault.listSecrets('test/');
    expect(secrets).toContain('item1');
    expect(secrets).toContain('item2');
  });
  
  test('should cache secrets', async () => {
    const testData = { cached: true, timestamp: Date.now() };
    
    // Write and read secret
    await vault.writeSecret('test/cache', testData);
    const first = await vault.readSecret('test/cache');
    const second = await vault.readSecret('test/cache'); // Should be cached
    
    expect(first).toEqual(testData);
    expect(second).toEqual(testData);
    
    // Check cache stats
    const stats = vault.getCacheStats();
    expect(stats.size).toBeGreaterThan(0);
  });
  
  afterAll(async () => {
    // Cleanup test secrets
    try {
      await vault.deleteSecret('test/credentials');
      await vault.deleteSecret('test/cache');
      await vault.deleteSecret('test/item1');
      await vault.deleteSecret('test/item2');
    } catch (error) {
      // Ignore cleanup errors
    }
  });
});
