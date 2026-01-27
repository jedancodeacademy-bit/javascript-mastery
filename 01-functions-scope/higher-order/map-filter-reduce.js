/**
 * 🔄 Production-Ready Map, Filter, Reduce Patterns
 * 
 * This module demonstrates professional patterns for array transformations
 * with performance optimizations, error handling, and real-world use cases.
 */

'use strict';

/**
 * 🎯 UTILITY FUNCTIONS
 */

/**
 * Validates array input
 * @param {Array} arr - Array to validate
 * @param {string} method - Method name for error message
 * @throws {TypeError} If input is not an array
 */
function validateArray(arr, method = '') {
  if (!Array.isArray(arr)) {
    throw new TypeError(`${method}: Expected array, got ${typeof arr}`);
  }
}

/**
 * Creates a performance-optimized iterator
 * @param {Array} arr - Array to iterate
 * @returns {Object} Iterator with cached values
 */
function createOptimizedIterator(arr) {
  const length = arr.length;
  let index = 0;
  
  return {
    next() {
      if (index < length) {
        return { value: arr[index++], done: false };
      }
      return { done: true };
    },
    reset() {
      index = 0;
    },
    get length() {
      return length;
    }
  };
}

/**
 * 🗺️ ADVANCED MAP PATTERNS
 */

/**
 * Async map with concurrency control
 * @param {Array} array - Input array
 * @param {Function} mapper - Async mapping function
 * @param {Object} options - Configuration options
 * @returns {Promise<Array>} Mapped array
 */
async function asyncMap(array, mapper, options = {}) {
  validateArray(array, 'asyncMap');
  
  const {
    concurrency = 5,
    onProgress = null,
    stopOnError = false
  } = options;
  
  const results = new Array(array.length);
  const errors = [];
  let completed = 0;
  
  // Process in chunks
  for (let i = 0; i < array.length; i += concurrency) {
    const chunk = array.slice(i, i + concurrency);
    const chunkPromises = chunk.map((item, chunkIndex) => {
      const globalIndex = i + chunkIndex;
      
      return Promise.resolve()
        .then(() => mapper(item, globalIndex, array))
        .then(result => {
          results[globalIndex] = result;
          completed++;
          
          if (onProgress) {
            onProgress({
              completed,
              total: array.length,
              percent: (completed / array.length) * 100
            });
          }
        })
        .catch(error => {
          errors.push({
            index: globalIndex,
            item,
            error: error.message
          });
          
          if (stopOnError) {
            throw error;
          }
          
          // Store error as result
          results[globalIndex] = { error: error.message };
          completed++;
        });
    });
    
    try {
      await Promise.all(chunkPromises);
    } catch (error) {
      if (stopOnError) {
        throw error;
      }
    }
  }
  
  return {
    results,
    errors,
    success: errors.length === 0
  };
}

/**
 * Map with early exit condition
 * @param {Array} array - Input array
 * @param {Function} mapper - Mapping function
 * @param {Function} shouldContinue - Continue condition
 * @returns {Array} Mapped results
 */
function mapUntil(array, mapper, shouldContinue) {
  validateArray(array, 'mapUntil');
  
  const results = [];
  
  for (let i = 0; i < array.length; i++) {
    if (shouldContinue(array[i], i, array) === false) {
      break;
    }
    results.push(mapper(array[i], i, array));
  }
  
  return results;
}

/**
 * Map with error recovery
 * @param {Array} array - Input array
 * @param {Function} mapper - Mapping function
 * @param {Function} errorHandler - Error handler
 * @returns {Array} Mapped results
 */
function safeMap(array, mapper, errorHandler = null) {
  validateArray(array, 'safeMap');
  
  const results = new Array(array.length);
  
  for (let i = 0; i < array.length; i++) {
    try {
      results[i] = mapper(array[i], i, array);
    } catch (error) {
      if (errorHandler) {
        results[i] = errorHandler(error, array[i], i, array);
      } else {
        results[i] = { error: error.message };
      }
    }
  }
  
  return results;
}

/**
 * 🔍 ADVANCED FILTER PATTERNS
 */

/**
 * Filter with async predicate
 * @param {Array} array - Input array
 * @param {Function} predicate - Async filter function
 * @returns {Promise<Array>} Filtered array
 */
async function asyncFilter(array, predicate) {
  validateArray(array, 'asyncFilter');
  
  const filterResults = await Promise.all(
    array.map((item, index) => 
      Promise.resolve()
        .then(() => predicate(item, index, array))
        .catch(() => false)
    )
  );
  
  return array.filter((_, index) => filterResults[index]);
}

/**
 * Filter with limit
 * @param {Array} array - Input array
 * @param {Function} predicate - Filter function
 * @param {number} limit - Maximum items to return
 * @returns {Array} Filtered array
 */
function filterWithLimit(array, predicate, limit) {
  validateArray(array, 'filterWithLimit');
  
  const results = [];
  
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      results.push(array[i]);
      
      if (results.length >= limit) {
        break;
      }
    }
  }
  
  return results;
}

/**
 * Filter with ranking
 * @param {Array} array - Input array
 * @param {Function} scorer - Scoring function
 * @param {number} threshold - Minimum score
 * @returns {Array} Filtered and sorted array
 */
function filterAndRank(array, scorer, threshold = 0) {
  validateArray(array, 'filterAndRank');
  
  const scored = array.map((item, index) => ({
    item,
    index,
    score: scorer(item, index, array)
  }));
  
  return scored
    .filter(entry => entry.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.item);
}

/**
 * ➕ ADVANCED REDUCE PATTERNS
 */

/**
 * Reduce with early exit
 * @param {Array} array - Input array
 * @param {Function} reducer - Reduce function
 * @param {*} initialValue - Initial value
 * @param {Function} shouldContinue - Continue condition
 * @returns {*} Reduced value
 */
function reduceUntil(array, reducer, initialValue, shouldContinue) {
  validateArray(array, 'reduceUntil');
  
  let accumulator = initialValue;
  
  for (let i = 0; i < array.length; i++) {
    if (shouldContinue(accumulator, array[i], i, array) === false) {
      break;
    }
    accumulator = reducer(accumulator, array[i], i, array);
  }
  
  return accumulator;
}

/**
 * Async reduce with concurrency
 * @param {Array} array - Input array
 * @param {Function} reducer - Async reduce function
 * @param {*} initialValue - Initial value
 * @param {Object} options - Configuration options
 * @returns {Promise<*>} Reduced value
 */
async function asyncReduce(array, reducer, initialValue, options = {}) {
  validateArray(array, 'asyncReduce');
  
  const { concurrency = 5 } = options;
  let accumulator = initialValue;
  let index = 0;
  
  // Process in chunks
  while (index < array.length) {
    const chunk = array.slice(index, index + concurrency);
    const chunkPromises = chunk.map((item, chunkIndex) => 
      Promise.resolve()
        .then(() => reducer(accumulator, item, index + chunkIndex, array))
    );
    
    const chunkResults = await Promise.all(chunkPromises);
    
    // Combine chunk results (depends on reducer logic)
    for (const result of chunkResults) {
      accumulator = result;
    }
    
    index += concurrency;
  }
  
  return accumulator;
}

/**
 * Reduce to object with validation
 * @param {Array} array - Input array
 * @param {Function} keyMapper - Key mapping function
 * @param {Function} valueMapper - Value mapping function
 * @param {Function} validator - Key/value validator
 * @returns {Object} Reduced object
 */
function reduceToObject(array, keyMapper, valueMapper, validator = null) {
  validateArray(array, 'reduceToObject');
  
  return array.reduce((acc, item, index) => {
    const key = keyMapper(item, index, array);
    const value = valueMapper(item, index, array);
    
    if (validator && !validator(key, value, item, index)) {
      return acc;
    }
    
    acc[key] = value;
    return acc;
  }, {});
}

/**
 * 🏭 PRODUCTION USE CASES
 */

/**
 * Process user data with transformations
 * @param {Array} users - Array of user objects
 * @returns {Object} Processed user data
 */
function processUserData(users) {
  validateArray(users, 'processUserData');
  
  // 1. Filter active users
  const activeUsers = users.filter(user => 
    user.status === 'active' && 
    user.email && 
    user.email.includes('@')
  );
  
  // 2. Map to required format
  const formattedUsers = activeUsers.map((user, index) => ({
    id: user.id || `user_${index}`,
    email: user.email.toLowerCase().trim(),
    name: user.name ? 
      user.name.trim().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ') : 
      'Unknown',
    joinDate: user.createdAt || new Date().toISOString(),
    metadata: {
      originalIndex: index,
      processedAt: new Date().toISOString()
    }
  }));
  
  // 3. Group by domain
  const usersByDomain = formattedUsers.reduce((acc, user) => {
    const domain = user.email.split('@')[1];
    
    if (!acc[domain]) {
      acc[domain] = [];
    }
    
    acc[domain].push(user);
    return acc;
  }, {});
  
  // 4. Calculate statistics
  const stats = formattedUsers.reduce((acc, user) => {
    acc.totalUsers++;
    acc.nameLengths.push(user.name.length);
    acc.domains.add(user.email.split('@')[1]);
    
    return acc;
  }, {
    totalUsers: 0,
    nameLengths: [],
    domains: new Set()
  });
  
  stats.averageNameLength = stats.nameLengths.length > 0 ?
    stats.nameLengths.reduce((sum, len) => sum + len, 0) / stats.nameLengths.length :
    0;
  stats.uniqueDomains = stats.domains.size;
  delete stats.domains;
  delete stats.nameLengths;
  
  return {
    users: formattedUsers,
    grouped: usersByDomain,
    statistics: stats,
    summary: {
      total: formattedUsers.length,
      active: activeUsers.length,
      inactive: users.length - activeUsers.length
    }
  };
}

/**
 * Process sales data with analytics
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Sales analytics
 */
function analyzeSales(transactions) {
  validateArray(transactions, 'analyzeSales');
  
  // Filter valid transactions
  const validTransactions = transactions.filter(t => 
    t.amount > 0 && 
    t.currency && 
    t.date
  );
  
  // Group by date
  const dailySales = validTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toISOString().split('T')[0];
    
    if (!acc[date]) {
      acc[date] = {
        date,
        total: 0,
        count: 0,
        transactions: [],
        currencies: new Set()
      };
    }
    
    acc[date].total += transaction.amount;
    acc[date].count++;
    acc[date].transactions.push(transaction);
    acc[date].currencies.add(transaction.currency);
    
    return acc;
  }, {});
  
  // Calculate metrics
  const metrics = Object.values(dailySales).reduce((acc, day) => {
    acc.totalSales += day.total;
    acc.totalTransactions += day.count;
    acc.days.push(day.date);
    
    if (day.total > acc.bestDay.amount) {
      acc.bestDay = { date: day.date, amount: day.total };
    }
    
    acc.averageTransaction = acc.totalSales / acc.totalTransactions;
    
    return acc;
  }, {
    totalSales: 0,
    totalTransactions: 0,
    bestDay: { date: '', amount: 0 },
    averageTransaction: 0,
    days: []
  });
  
  // Top products
  const productSales = validTransactions.reduce((acc, transaction) => {
    if (transaction.productId) {
      if (!acc[transaction.productId]) {
        acc[transaction.productId] = {
          productId: transaction.productId,
          total: 0,
          count: 0
        };
      }
      
      acc[transaction.productId].total += transaction.amount;
      acc[transaction.productId].count++;
    }
    
    return acc;
  }, {});
  
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
  
  return {
    summary: {
      totalTransactions: transactions.length,
      validTransactions: validTransactions.length,
      invalidTransactions: transactions.length - validTransactions.length
    },
    daily: dailySales,
    metrics,
    topProducts,
    timeline: Object.values(dailySales)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(day => ({
        date: day.date,
        total: day.total,
        count: day.count
      }))
  };
}

/**
 * 🚀 PERFORMANCE OPTIMIZATIONS
 */

/**
 * Optimized map for large arrays
 * @param {Array} array - Input array
 * @param {Function} mapper - Mapping function
 * @param {Object} options - Performance options
 * @returns {Array} Mapped array
 */
function optimizedMap(array, mapper, options = {}) {
  validateArray(array, 'optimizedMap');
  
  const {
    batchSize = 1000,
    yieldInterval = 16 // ~60fps
  } = options;
  
  const results = new Array(array.length);
  let lastYield = Date.now();
  
  // Process in batches to avoid blocking
  for (let i = 0; i < array.length; i += batchSize) {
    const batchEnd = Math.min(i + batchSize, array.length);
    
    for (let j = i; j < batchEnd; j++) {
      results[j] = mapper(array[j], j, array);
    }
    
    // Yield to event loop periodically
    if (Date.now() - lastYield > yieldInterval) {
      // In browser: requestAnimationFrame, in Node: setImmediate
      if (typeof setImmediate === 'function') {
        await new Promise(resolve => setImmediate(resolve));
      }
      lastYield = Date.now();
    }
  }
  
  return results;
}

/**
 * Memory-efficient filter for large arrays
 * @param {Array} array - Input array
 * @param {Function} predicate - Filter function
 * @returns {Array} Filtered array
 */
function memoryEfficientFilter(array, predicate) {
  validateArray(array, 'memoryEfficientFilter');
  
  const results = [];
  const iterator = createOptimizedIterator(array);
  let entry;
  
  while (!(entry = iterator.next()).done) {
    if (predicate(entry.value, results.length, array)) {
      results.push(entry.value);
    }
  }
  
  return results;
}

/**
 * 🧪 TESTING UTILITIES
 */

function runMapFilterReduceTests() {
  console.log('🧪 Running Map, Filter, Reduce Tests...\n');
  
  const tests = [];
  let passed = 0;
  let failed = 0;
  
  function test(name, fn) {
    try {
      fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.error(`❌ ${name}:`, error.message);
      failed++;
    }
  }
  
  // Test basic functionality
  test('Basic map', () => {
    const arr = [1, 2, 3];
    const result = safeMap(arr, x => x * 2);
    if (result[0] !== 2 || result[1] !== 4 || result[2] !== 6) {
      throw new Error('Map failed');
    }
  });
  
  test('Basic filter', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = filterWithLimit(arr, x => x % 2 === 0, 2);
    if (result.length !== 2 || result[0] !== 2 || result[1] !== 4) {
      throw new Error('Filter failed');
    }
  });
  
  test('Basic reduce', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = reduceUntil(arr, (acc, x) => acc + x, 0, (acc, x) => x < 4);
    if (result !== 6) { // 1 + 2 + 3
      throw new Error('Reduce failed');
    }
  });
  
  // Test async functions
  test('Async map', async () => {
    const arr = [1, 2, 3];
    const result = await asyncMap(arr, async x => x * 2);
    if (!result.success || result.results[0] !== 2) {
      throw new Error('Async map failed');
    }
  });
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  return { passed, failed };
}

/**
 * 🚀 EXPORT MODULES
 */
module.exports = {
  // Map variations
  asyncMap,
  mapUntil,
  safeMap,
  optimizedMap,
  
  // Filter variations
  asyncFilter,
  filterWithLimit,
  filterAndRank,
  memoryEfficientFilter,
  
  // Reduce variations
  reduceUntil,
  asyncReduce,
  reduceToObject,
  
  // Production use cases
  processUserData,
  analyzeSales,
  
  // Testing
  runMapFilterReduceTests,
  
  // Utility functions
  validateArray,
  createOptimizedIterator
};

// Run tests if executed directly
if (require.main === module) {
  module.exports.runMapFilterReduceTests();
  
  console.log('\n🚀 Production Examples:\n');
  
  // Example: Process user data
  const users = [
    { id: 1, name: 'john doe', email: 'john@example.com', status: 'active', createdAt: '2024-01-01' },
    { id: 2, name: 'jane smith', email: 'jane@company.com', status: 'active' },
    { id: 3, name: 'bob', email: 'invalid-email', status: 'inactive' }
  ];
  
  const processed = module.exports.processUserData(users);
  console.log('Processed Users:', processed.summary);
  console.log('Statistics:', processed.statistics);
}
