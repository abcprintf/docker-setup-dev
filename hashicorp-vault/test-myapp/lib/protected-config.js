const crypto = require('crypto');

class ProtectedConfig {
  constructor(rawConfig, options = {}) {
    this._encrypted = new Map();
    this._masked = new Map();
    this._accessKey = options.accessPassword || crypto.randomBytes(32).toString('hex');
    
    // เข้ารหัสและสร้าง masked version
    this._processConfig(rawConfig);
    
    // ใช้ Proxy เพื่อดักจับการเข้าถึง
    return new Proxy(this, {
      get(target, prop, receiver) {
        // ดักจับ built-in methods
        if (prop === 'toString' || prop === Symbol.toPrimitive) {
          return () => '[ProtectedConfig - Secrets Hidden]';
        }
        
        if (prop === 'toJSON' || prop === 'inspect' || prop === Symbol.for('nodejs.util.inspect.custom')) {
          return () => target._getAllMasked();
        }
        
        if (prop === 'valueOf') {
          return () => '[ProtectedConfig - Secrets Hidden]';
        }
        
        // Method สำหรับดึงค่าจริง (ต้องมี access key)
        if (prop === 'getRealValue') {
          return (password) => {
            if (!password || password !== target._accessKey) {
              console.warn('🚨 SECURITY: Unauthorized access attempt to protected config');
              throw new Error('Access denied: Invalid password');
            }
            
            // ถอดรหัสและคืนค่าทั้งหมด
            const realValues = {};
            for (const [key, encryptedValue] of target._encrypted.entries()) {
              realValues[key] = target._decrypt(key);
            }
            return realValues;
          };
        }
        
        // Method สำหรับดึงค่า masked
        if (prop === 'getMaskedValue') {
          return (path) => target._masked.get(path);
        }
        
        // ถ้าเป็น property ปกติ ส่ง masked value กลับไป
        if (target._masked.has(prop)) {
          return target._masked.get(prop);
        }
        
        // ถ้าไม่มี property นี้
        if (typeof target[prop] === 'function') {
          return target[prop].bind(target);
        }
        
        return undefined;
      },
      
      set(target, prop, value) {
        // ป้องกันการตั้งค่าใหม่
        console.warn(`⚠️  Attempt to modify protected config property: ${prop}`);
        return false;
      },
      
      ownKeys(target) {
        // แสดงเฉพาะ masked keys
        return Array.from(target._masked.keys());
      },
      
      has(target, prop) {
        return target._masked.has(prop);
      }
    });
  }
  
  _processConfig(config) {
    // ตรวจสอบว่า config เป็น null/undefined หรือไม่
    if (!config || typeof config !== 'object') {
      console.warn('⚠️  Invalid config data, using empty object');
      config = {};
    }
    
    for (const [key, value] of Object.entries(config)) {
      // เข้ารหัสค่าจริง
      this._encrypted.set(key, this._encrypt(value));
      
      // สร้าง masked version
      this._masked.set(key, this._maskValue(value));
    }
  }
  
  _encrypt(data) {
    const key = crypto.scryptSync(this._accessKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }
  
  _decrypt(key) {
    const encrypted = this._encrypted.get(key);
    if (!encrypted) return undefined;
    
    try {
      const [ivHex, encryptedData] = encrypted.split(':');
      const derivedKey = crypto.scryptSync(this._accessKey, 'salt', 32);
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, iv);
      
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
    } catch (error) {
      throw new Error('Failed to decrypt configuration');
    }
  }
  
  _maskValue(value) {
    if (typeof value === 'string') {
      return this._maskString(value);
    }
    
    if (typeof value === 'object' && value !== null) {
      const masked = {};
      for (const [k, v] of Object.entries(value)) {
        if (this._isSensitiveKey(k)) {
          masked[k] = this._maskString(String(v));
        } else {
          masked[k] = v;
        }
      }
      return masked;
    }
    
    return value;
  }
  
  _maskString(str) {
    if (!str || str.length === 0) return '***';
    if (str.length <= 4) return '***';
    
    const start = Math.min(2, Math.floor(str.length * 0.2));
    const end = Math.min(2, Math.floor(str.length * 0.2));
    const middle = Math.min(8, str.length - start - end);
    
    return str.substring(0, start) + '*'.repeat(middle) + str.substring(str.length - end);
  }
  
  _isSensitiveKey(key) {
    const sensitivePatterns = [
      'password', 'secret', 'key', 'token', 'credential', 'pass',
      'auth', 'private', 'jwt', 'api', 'access', 'refresh'
    ];
    
    const lowerKey = key.toLowerCase();
    return sensitivePatterns.some(pattern => lowerKey.includes(pattern));
  }
  
  _getAllMasked() {
    const result = {};
    for (const [key, value] of this._masked.entries()) {
      result[key] = value;
    }
    return result;
  }
  
  // Method สำหรับ debugging (แสดงเฉพาะ structure)
  getStructure() {
    const structure = {};
    for (const [key, value] of this._masked.entries()) {
      if (typeof value === 'object' && value !== null) {
        structure[key] = Object.keys(value);
      } else {
        structure[key] = typeof value;
      }
    }
    return structure;
  }
}

// Helper class สำหรับจัดการ access key
class ConfigAccess {
  constructor() {
    this._accessKey = process.env.CONFIG_ACCESS_PASSWORD || process.env.CONFIG_ACCESS_KEY || null;
    
    if (!this._accessKey) {
      console.warn('⚠️  CONFIG_ACCESS_PASSWORD not set - real config access disabled');
    }
  }
  
  createProtectedConfig(rawConfig) {
    return new ProtectedConfig(rawConfig, { accessPassword: this._accessKey });
  }
  
  createProxy(configObject) {
    return new Proxy(configObject, {
      get(target, prop) {
        return target[prop];
      },
      set() {
        throw new Error('Cannot modify protected configuration');
      }
    });
  }
  
  getRealValue(protectedConfig, path) {
    if (!this._accessKey) {
      throw new Error('CONFIG_ACCESS_PASSWORD not configured');
    }
    
    return protectedConfig.getRealValue(this._accessKey);
  }
}

module.exports = { ProtectedConfig, ConfigAccess };
