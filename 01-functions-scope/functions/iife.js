/**
 * 🔒 Production-Ready IIFE (Immediately Invoked Function Expressions)
 * 
 * This module demonstrates professional IIFE patterns for scope isolation,
 * module creation, and avoiding global namespace pollution.
 */

'use strict';

/**
 * 🎯 BASIC IIFE PATTERNS
 */

// 1. Classic IIFE
(function() {
  const privateVar = 'This is private';
  console.log('Classic IIFE:', privateVar);
})();

// 2. IIFE with Parameters
(function(global, document) {
  const version = '1.0.0';
  console.log('Version:', version, 'Global:', typeof global);
})(window, document);

// 3. Async IIFE
(async function() {
  const data = await Promise.resolve('Async data loaded');
  console.log('Async IIFE:', data);
})();

/**
 * 🏗️ MODULE PATTERNS
 */

// 1. Basic Module Pattern
const CounterModule = (function() {
  // Private state
  let count = 0;
  
  // Private methods
  function validateIncrement(amount) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Amount must be a positive number');
    }
  }
  
  // Public API
  return {
    increment(amount = 1) {
      validateIncrement(amount);
      count += amount;
      return this; // For chaining
    },
    
    decrement(amount = 1) {
      validateIncrement(amount);
      count = Math.max(0, count - amount);
      return this;
    },
    
    getCount() {
      return count;
    },
    
    reset() {
      count = 0;
      return this;
    }
  };
})();

// 2. Revealing Module Pattern
const UserRepository = (function() {
  // Private collection
  const users = new Map();
  let nextId = 1;
  
  // Private validation
  function validateUser(user) {
    if (!user || typeof user !== 'object') {
      throw new TypeError('User must be an object');
    }
    
    const { name, email } = user;
    
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      throw new Error('User must have a valid name (min 2 characters)');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('User must have a valid email');
    }
    
    return true;
  }
  
  // Private helper
  function generateId() {
    return `user_${nextId++}_${Date.now()}`;
  }
  
  // Public API - revealing private methods through public interface
  return {
    add(user) {
      validateUser(user);
      
      const id = generateId();
      const userWithMeta = {
        ...user,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      users.set(id, userWithMeta);
      return { ...userWithMeta };
    },
    
    get(id) {
      const user = users.get(id);
      return user ? { ...user } : null;
    },
    
    getAll() {
      return Array.from(users.values()).map(user => ({ ...user }));
    },
    
    update(id, updates) {
      const user = users.get(id);
      if (!user) return null;
      
      // Don't allow updating ID
      const { id: _, ...safeUpdates } = updates;
      
      const updatedUser = {
        ...user,
        ...safeUpdates,
        updatedAt: new Date().toISOString()
      };
      
      users.set(id, updatedUser);
      return { ...updatedUser };
    },
    
    delete(id) {
      return users.delete(id);
    },
    
    findByEmail(email) {
      return this.getAll().find(user => user.email === email);
    },
    
    count() {
      return users.size;
    },
    
    clear() {
      users.clear();
      nextId = 1;
    }
  };
})();

// 3. Singleton Pattern with IIFE
const Logger = (function() {
  let instance;
  
  function createLogger() {
    const logs = [];
    const levels = ['error', 'warn', 'info', 'debug'];
    
    function log(level, message, metadata = {}) {
      if (!levels.includes(level)) {
        level = 'info';
      }
      
      const entry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        metadata,
        caller: new Error().stack.split('\n')[2].trim()
      };
      
      logs.push(entry);
      
      // In production, you might send to external service
      console[level](`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`, metadata);
      
      // Keep only last 1000 logs in memory
      if (logs.length > 1000) {
        logs.shift();
      }
      
      return entry;
    }
    
    return {
      error: (msg, meta) => log('error', msg, meta),
      warn: (msg, meta) => log('warn', msg, meta),
      info: (msg, meta) => log('info', msg, meta),
      debug: (msg, meta) => log('debug', msg, meta),
      
      getLogs(level = null) {
        return level 
          ? logs.filter(log => log.level === level)
          : [...logs];
      },
      
      clearLogs() {
        logs.length = 0;
      },
      
      getStats() {
        const stats = {};
        levels.forEach(level => {
          stats[level] = logs.filter(log => log.level === level).length;
        });
        return stats;
      }
    };
  }
  
  return {
    getInstance() {
      if (!instance) {
        instance = createLogger();
      }
      return instance;
    }
  };
})();

// 4. Configuration Manager
const ConfigManager = (function() {
  const config = new Map();
  const defaults = new Map();
  const validators = new Map();
  const subscribers = new Set();
  
  // Private helper
  function notifySubscribers(key, value) {
    subscribers.forEach(callback => callback(key, value));
  }
  
  return {
    setDefault(key, value, validator = null) {
      defaults.set(key, value);
      if (validator) validators.set(key, validator);
      
      if (!config.has(key)) {
        this.set(key, value);
      }
      
      return this;
    },
    
    set(key, value) {
      const validator = validators.get(key);
      
      if (validator && !validator(value)) {
        throw new Error(`Invalid value for ${key}: ${value}`);
      }
      
      const oldValue = config.get(key);
      config.set(key, value);
      
      if (oldValue !== value) {
        notifySubscribers(key, value);
      }
      
      return this;
    },
    
    get(key, fallback = null) {
      if (config.has(key)) {
        return config.get(key);
      }
      
      if (defaults.has(key)) {
        const defaultValue = defaults.get(key);
        config.set(key, defaultValue);
        return defaultValue;
      }
    
      return fallback;
    },
    
    getAll() {
      const result = {};
      for (const [key, value] of config) {
        result[key] = value;
      }
      return result;
    },
    
    reset(key = null) {
      if (key) {
        const defaultValue = defaults.get(key);
        if (defaultValue !== undefined) {
          this.set(key, defaultValue);
        } else {
          config.delete(key);
        }
      } else {
        config.clear();
        defaults.forEach((value, key) => {
          config.set(key, value);
        });
      }
      return this;
    },
    
    subscribe(callback) {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
    
    // For debugging
    _debug() {
      return {
        config: Array.from(config.entries()),
        defaults: Array.from(defaults.entries()),
        subscribers: subscribers.size
      };
    }
  };
})();

/**
 * 🔧 ADVANCED PATTERNS
 */

// 1. Namespace Pattern
const MyApp = (function() {
  // Private namespace
  const internals = {};
  
  // Public namespace
  const api = {};
  
  // Initialize internal modules
  internals.modules = new Map();
  
  // Module registration system
  api.registerModule = function(name, moduleFactory) {
    if (internals.modules.has(name)) {
      throw new Error(`Module ${name} already registered`);
    }
    
    const module = moduleFactory(api);
    internals.modules.set(name, module);
    return module;
  };
  
  api.getModule = function(name) {
    const module = internals.modules.get(name);
    if (!module) {
      throw new Error(`Module ${name} not found`);
    }
    return module;
  };
  
  // Initialize core modules
  api.registerModule('config', () => ConfigManager);
  api.registerModule('logger', () => Logger.getInstance());
  api.registerModule('users', () => UserRepository);
  
  return api;
})();

// 2. Dependency Injection Container
const Container = (function() {
  const services = new Map();
  const instances = new Map();
  
  return {
    register(name, factory, isSingleton = true) {
      services.set(name, { factory, isSingleton });
      return this;
    },
    
    resolve(name) {
      const service = services.get(name);
      
      if (!service) {
        throw new Error(`Service ${name} not registered`);
      }
      
      if (service.isSingleton && instances.has(name)) {
        return instances.get(name);
      }
      
      const instance = service.factory(this);
      
      if (service.isSingleton) {
        instances.set(name, instance);
      }
      
      return instance;
    },
    
    reset() {
      services.clear();
      instances.clear();
    }
  };
})();

/**
 * 🧪 TESTING UTILITIES
 */

// Test Runner in IIFE
(function() {
  const tests = [];
  let passed = 0;
  let failed = 0;
  
  const TestRunner = {
    describe(name, fn) {
      tests.push({ name, fn });
    },
    
    run() {
      console.log('🧪 Running IIFE Pattern Tests...\n');
      
      tests.forEach(test => {
        try {
          test.fn();
          console.log(`✅ ${test.name}`);
          passed++;
        } catch (error) {
          console.error(`❌ ${test.name}:`, error.message);
          failed++;
        }
      });
      
      console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
    }
  };
  
  // Export if in browser, otherwise keep local
  if (typeof window !== 'undefined') {
    window.TestRunner = TestRunner;
  }
})();

/**
 * 🚀 EXPORTS
 */
module.exports = {
  // Module patterns
  CounterModule,
  UserRepository,
  Logger,
  ConfigManager,
  MyApp,
  Container,
  
  // Utility function
  createSingleton: function(factory) {
    let instance;
    return function() {
      if (!instance) {
        instance = factory();
      }
      return instance;
    };
  }
};

// Example usage
if (require.main === module) {
  console.log('🔒 IIFE Pattern Examples:\n');
  
  // Test CounterModule
  CounterModule.increment(5).decrement(2);
  console.log('Counter:', CounterModule.getCount());
  
  // Test UserRepository
  const user = UserRepository.add({
    name: 'John Doe',
    email: 'john@example.com'
  });
  console.log('User added:', user.name);
  
  // Test ConfigManager
  ConfigManager
    .setDefault('apiUrl', 'https://api.example.com')
    .setDefault('timeout', 5000, val => val > 0);
  
  ConfigManager.set('timeout', 10000);
  console.log('Config timeout:', ConfigManager.get('timeout'));
  
  // Test MyApp namespace
  console.log('MyApp modules:', Object.keys(MyApp));
}
