require('dotenv').config();
const express = require('express');
const cors = require('cors');
const VaultManager = require('./vault-manager');
const ConfigManager = require('./config-manager');

const app = express();
const port = process.env.PORT || 3000;

// Global instances
let vaultManager;
let configManager;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize Vault and Config
async function initializeApp() {
  try {
    console.log('🚀 Initializing application...\n');
    
    // Initialize Vault Manager
    vaultManager = new VaultManager();
    await vaultManager.testConnection();
    
    // Initialize Config Manager
    configManager = new ConfigManager();
    await configManager.loadConfig();
    await configManager.setupEnvironmentVariables();
    
    console.log('✅ Application initialized successfully\n');
    
  } catch (error) {
    console.error('❌ Application initialization failed:', error.message);
    process.exit(1);
  }
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    vault_connected: !!vaultManager,
    config_loaded: configManager?.isLoaded || false
  });
});

// Vault status
app.get('/api/vault/status', async (req, res) => {
  try {
    const status = await vaultManager.testConnection();
    res.json({
      success: true,
      status: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get configuration (sanitized)
app.get('/api/config', (req, res) => {
  try {
    const config = {
      database: {
        host: configManager.get('database.host'),
        port: configManager.get('database.port'),
        name: configManager.get('database.name'),
        // ไม่ส่ง password
      },
      api: {
        rate_limit: configManager.get('api.rate_limit')
        // ไม่ส่ง keys
      },
      jwt: {
        expiration: configManager.get('jwt.expiration'),
        issuer: configManager.get('jwt.issuer')
        // ไม่ส่ง secret
      }
    };
    
    res.json({
      success: true,
      config: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// List secrets
app.get('/api/vault/secrets', async (req, res) => {
  try {
    const path = req.query.path || 'myapp/';
    const secrets = await vaultManager.listSecrets(path);
    
    res.json({
      success: true,
      path: path,
      secrets: secrets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Read specific secret (admin only - for demo)
app.get('/api/vault/secret/:path', async (req, res) => {
  try {
    const path = req.params.path;
    const secret = await vaultManager.readSecret(`myapp/${path}`);
    
    if (!secret) {
      return res.status(404).json({
        success: false,
        error: 'Secret not found'
      });
    }
    
    res.json({
      success: true,
      path: `myapp/${path}`,
      secret: secret
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Write secret (admin only - for demo)
app.post('/api/vault/secret/:path', async (req, res) => {
  try {
    const path = req.params.path;
    const data = req.body;
    
    await vaultManager.writeSecret(`myapp/${path}`, data);
    
    res.json({
      success: true,
      message: `Secret written to myapp/${path}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete secret (admin only - for demo)
app.delete('/api/vault/secret/:path', async (req, res) => {
  try {
    const path = req.params.path;
    await vaultManager.deleteSecret(`myapp/${path}`);
    
    res.json({
      success: true,
      message: `Secret deleted from myapp/${path}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Reload configuration
app.post('/api/config/reload', async (req, res) => {
  try {
    await configManager.reload();
    await configManager.setupEnvironmentVariables();
    
    res.json({
      success: true,
      message: 'Configuration reloaded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Cache statistics
app.get('/api/vault/cache', (req, res) => {
  try {
    const stats = vaultManager.getCacheStats();
    res.json({
      success: true,
      cache: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Clear cache
app.delete('/api/vault/cache', (req, res) => {
  try {
    vaultManager.clearCache();
    res.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Simulate database connection using Vault secrets
app.get('/api/database/test', (req, res) => {
  try {
    const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS ? '***' : undefined,
      database: process.env.DB_NAME
    };
    
    res.json({
      success: true,
      message: 'Database configuration loaded from Vault',
      config: dbConfig,
      ready: !!(dbConfig.host && dbConfig.user && process.env.DB_PASS)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
async function startServer() {
  await initializeApp();
  
  app.listen(port, () => {
    console.log('🎯 Vault Test Application');
    console.log(`   Server: http://localhost:${port}`);
    console.log(`   Health: http://localhost:${port}/health`);
    console.log(`   Config: http://localhost:${port}/api/config`);
    console.log(`   Vault:  ${process.env.VAULT_ADDR}`);
    console.log('');
    
    // Display current configuration
    if (configManager) {
      configManager.displayConfig();
    }
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n📛 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n📛 Shutting down gracefully...');
  process.exit(0);
});

// Start the application
if (require.main === module) {
  startServer();
}

module.exports = app;
