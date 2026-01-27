# 🔄 Higher-Order Functions: Production Guide

## 📚 Overview
Comprehensive guide to higher-order functions with production patterns, performance considerations, and real-world applications.

## 🎯 What are Higher-Order Functions?
Functions that either:
1. Take other functions as arguments
2. Return functions as results
3. Both

## 🏗️ Core Patterns

### 1. Function Composition
```javascript
const compose = (...fns) => 
  (initialValue) => 
    fns.reduceRight((acc, fn) => fn(acc), initialValue);
```

### 2. Currying
```javascript
const curry = (fn) => {
  const arity = fn.length;
  
  return function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
    } else {
      return (...moreArgs) => 
        curried.apply(this, args.concat(moreArgs));
    }
  };
};
```

### 3. Partial Application
```javascript
const partial = (fn, ...presetArgs) => 
  (...laterArgs) => 
    fn(...presetArgs, ...laterArgs);
```

## 🚀 Production Patterns

### 1. Middleware Pipeline
```javascript
function createMiddlewarePipeline() {
  const middlewares = [];
  
  return {
    use(fn) {
      middlewares.push(fn);
      return this;
    },
    
    async execute(input) {
      let currentIndex = 0;
      const context = { input, output: null };
      
      const next = async () => {
        if (currentIndex >= middlewares.length) {
          return;
        }
        
        const middleware = middlewares[currentIndex];
        currentIndex++;
        
        await middleware(context, next);
      };
      
      await next();
      return context.output;
    }
  };
}
```

### 2. Retry Logic
```javascript
function withRetry(fn, maxAttempts = 3, delay = 1000) {
  return async function(...args) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        console.log(`Attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxAttempts) {
          await new Promise(resolve => 
            setTimeout(resolve, delay * attempt)
          );
        }
      }
    }
    
    throw lastError;
  };
}
```

### 3. Memoization
```javascript
function memoize(fn, options = {}) {
  const {
    maxSize = 100,
    ttl = 0,
    serializer = JSON.stringify
  } = options;
  
  const cache = new Map();
  const lru = [];
  
  return function(...args) {
    const key = serializer(args);
    
    if (cache.has(key)) {
      const entry = cache.get(key);
      
      if (!ttl || Date.now() - entry.timestamp < ttl) {
        // Update LRU
        const index = lru.indexOf(key);
        if (index > -1) {
          lru.splice(index, 1);
        }
        lru.push(key);
        
        return entry.value;
      }
      
      cache.delete(key);
    }
    
    const value = fn.apply(this, args);
    const entry = { value, timestamp: Date.now() };
    
    cache.set(key, entry);
    lru.push(key);
    
    // Manage cache size
    while (cache.size > maxSize && lru.length > 0) {
      const oldestKey = lru.shift();
      cache.delete(oldestKey);
    }
    
    return value;
  };
}
```

## 🏭 Advanced Patterns

### 1. Dependency Injection
```javascript
function createContainer() {
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
    }
  };
}
```

### 2. Event Emitter
```javascript
function createEventEmitter() {
  const listeners = new Map();
  
  return {
    on(event, listener) {
      if (!listeners.has(event)) {
        listeners.set(event, []);
      }
      listeners.get(event).push(listener);
      
      return () => this.off(event, listener);
    },
    
    off(event, listener) {
      const eventListeners = listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(listener);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    },
    
    emit(event, ...args) {
      const eventListeners = listeners.get(event) || [];
      eventListeners.forEach(listener => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    },
    
    once(event, listener) {
      const onceWrapper = (...args) => {
        this.off(event, onceWrapper);
        listener(...args);
      };
      
      return this.on(event, onceWrapper);
    }
  };
}
```

## 📊 Performance Considerations

### 1. Avoid Creating Functions in Loops
```javascript
// ❌ Bad
function processItems(items) {
  return items.map(item => expensiveOperation(item));
}

// ✅ Good
function processItems(items) {
  const process = item => expensiveOperation(item);
  return items.map(process);
}
```

### 2. Use Built-in Methods
```javascript
// Use native array methods when possible
// They're optimized by JavaScript engines
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, n) => acc + n, 0);
const evens = numbers.filter(n => n % 2 === 0);
```

## 🎯 Real-World Applications

### 1. API Client
```javascript
function createApiClient(baseURL) {
  return {
    get: (endpoint) => 
      fetch(`${baseURL}${endpoint}`).then(r => r.json()),
    
    post: (endpoint, data) => 
      fetch(`${baseURL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    
    withAuth: (token) => ({
      get: (endpoint) => 
        fetch(`${baseURL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json())
    })
  };
}
```

### 2. Validation Pipeline
```javascript
function createValidator(rules) {
  return function validate(data) {
    const errors = [];
    
    rules.forEach(rule => {
      const result = rule(data);
      if (result !== true) {
        errors.push(result);
      }
    });
    
    return errors.length === 0 ? true : errors;
  };
}

// Usage
const validateUser = createValidator([
  data => data.name && data.name.length >= 2 || 'Name too short',
  data => data.email && data.email.includes('@') || 'Invalid email'
]);
```

## 🧪 Testing Higher-Order Functions

```javascript
function testHigherOrderFunctions() {
  const tests = [];
  
  function test(description, fn) {
    try {
      fn();
      console.log(`✅ ${description}`);
      return true;
    } catch (error) {
      console.error(`❌ ${description}:`, error.message);
      return false;
    }
  }
  
  // Test composition
  test('Function composition', () => {
    const add = x => x + 1;
    const multiply = x => x * 2;
    const composed = compose(multiply, add);
    
    if (composed(5) !== 12) {
      throw new Error('Composition failed');
    }
  });
  
  // Test currying
  test('Currying', () => {
    const add = (a, b, c) => a + b + c;
    const curriedAdd = curry(add);
    
    if (curriedAdd(1)(2)(3) !== 6) {
      throw new Error('Currying failed');
    }
  });
}
```

## 📈 Best Practices

1. **Keep functions pure** when possible
2. **Use descriptive names** for higher-order functions
3. **Document parameter types** and return values
4. **Handle errors** in composed functions
5. **Consider performance** with large datasets
6. **Test edge cases** thoroughly
7. **Use TypeScript** for better type safety
8. **Profile memory usage** with closures
