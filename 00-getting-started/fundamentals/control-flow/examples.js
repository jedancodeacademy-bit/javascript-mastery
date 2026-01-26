// ============================================
// CONTROL FLOW - COMPREHENSIVE EXAMPLES
// ============================================

console.log("🎮 CONTROL FLOW EXAMPLES");
console.log("=======================\n");

// ==========================
// 1. CONDITIONAL STATEMENTS
// ==========================

console.log("1. CONDITIONAL STATEMENTS");
console.log("=========================\n");

// Basic if statement
console.log("🔹 Basic if Statement:");
const temperature = 25;
if (temperature > 30) {
    console.log(`Temperature ${temperature}°C: It's hot outside!`);
} else {
    console.log(`Temperature ${temperature}°C: Weather is pleasant.`);
}

// if...else if...else ladder
console.log("\n🔹 if...else if...else Ladder:");
const score = 85;
let grade;

if (score >= 90) {
    grade = "A";
    console.log(`Score ${score}: Excellent! Grade ${grade}`);
} else if (score >= 80) {
    grade = "B";
    console.log(`Score ${score}: Good job! Grade ${grade}`);
} else if (score >= 70) {
    grade = "C";
    console.log(`Score ${score}: Satisfactory. Grade ${grade}`);
} else if (score >= 60) {
    grade = "D";
    console.log(`Score ${score}: Needs improvement. Grade ${grade}`);
} else {
    grade = "F";
    console.log(`Score ${score}: Failed. Grade ${grade}`);
}

// Nested conditionals
console.log("\n🔹 Nested Conditionals:");
function checkAccess(age, hasLicense, isSober) {
    console.log(`Age: ${age}, Has License: ${hasLicense}, Is Sober: ${isSober}`);
    
    if (age >= 18) {
        if (hasLicense) {
            if (isSober) {
                return "✅ You can drive!";
            } else {
                return "❌ You cannot drive while intoxicated!";
            }
        } else {
            return "❌ You need a driver's license!";
        }
    } else {
        return "❌ You're too young to drive!";
    }
}

console.log(checkAccess(25, true, true));
console.log(checkAccess(17, true, true));
console.log(checkAccess(25, false, true));
console.log(checkAccess(25, true, false));

// Flattened with early returns
console.log("\n🔹 Flattened with Early Returns:");
function checkAccessBetter(age, hasLicense, isSober) {
    if (age < 18) return "❌ You're too young to drive!";
    if (!hasLicense) return "❌ You need a driver's license!";
    if (!isSober) return "❌ You cannot drive while intoxicated!";
    return "✅ You can drive!";
}

console.log(checkAccessBetter(25, true, true));
console.log(checkAccessBetter(17, true, true));

// Ternary operator
console.log("\n🔹 Ternary Operator:");
const isMember = true;
const discount = isMember ? 0.1 : 0;
console.log(`Member: ${isMember}, Discount: ${discount * 100}%`);

// Nested ternary (use sparingly)
const userScore = 85;
const userGrade = userScore >= 90 ? "A" :
                  userScore >= 80 ? "B" :
                  userScore >= 70 ? "C" :
                  userScore >= 60 ? "D" : "F";
console.log(`Score ${userScore}: Grade ${userGrade}`);

// Ternary with different return types
console.log("\n🔹 Ternary with Different Return Types:");
const user = { isAdmin: true, name: "John" };
const message = user.isAdmin 
    ? { type: "admin", text: `Welcome Admin ${user.name}!` }
    : { type: "user", text: `Welcome ${user.name}!` };
console.log("Message:", message);

// Conditional execution
console.log("\n🔹 Conditional Execution:");
const debugMode = true;
debugMode && console.log("Debug mode is enabled");
debugMode || console.log("This won't print");

// Real-world example: Authentication
console.log("\n🔹 Real-world Example: Authentication System:");
function authenticateUser(username, password, rememberMe = false) {
    // Simulate user database
    const users = {
        "admin": { password: "admin123", role: "admin" },
        "john": { password: "password", role: "user" },
        "jane": { password: "123456", role: "editor" }
    };

    // Validation
    if (!username || !password) {
        return { success: false, message: "Username and password are required" };
    }

    const user = users[username];
    
    if (!user) {
        return { success: false, message: "User not found" };
    }

    if (user.password !== password) {
        return { success: false, message: "Invalid password" };
    }

    // Success
    const session = {
        username,
        role: user.role,
        token: `token_${Date.now()}_${Math.random().toString(36).substr(2)}`,
        expires: rememberMe ? Date.now() + 30 * 24 * 60 * 60 * 1000 : Date.now() + 24 * 60 * 60 * 1000
    };

    return {
        success: true,
        message: "Login successful",
        session,
        redirect: user.role === "admin" ? "/admin" : "/dashboard"
    };
}

// Test authentication
console.log("Test 1 - Valid admin:", authenticateUser("admin", "admin123", true));
console.log("Test 2 - Invalid password:", authenticateUser("admin", "wrong"));
console.log("Test 3 - Missing username:", authenticateUser("", "password"));

// ==========================
// 2. SWITCH STATEMENTS
// ==========================

console.log("\n\n2. SWITCH STATEMENTS");
console.log("===================\n");

// Basic switch
console.log("🔹 Basic Switch Statement:");
const day = new Date().getDay();
let dayName;

switch (day) {
    case 0:
        dayName = "Sunday";
        break;
    case 1:
        dayName = "Monday";
        break;
    case 2:
        dayName = "Tuesday";
        break;
    case 3:
        dayName = "Wednesday";
        break;
    case 4:
        dayName = "Thursday";
        break;
    case 5:
        dayName = "Friday";
        break;
    case 6:
        dayName = "Saturday";
        break;
    default:
        dayName = "Invalid day";
}

console.log(`Day number: ${day}, Day name: ${dayName}`);

// Switch with fall-through
console.log("\n🔹 Switch with Fall-through:");
const month = new Date().getMonth();
let season;

switch (month) {
    case 11: // December
    case 0:  // January
    case 1:  // February
        season = "Winter ❄️";
        break;
    case 2:  // March
    case 3:  // April
    case 4:  // May
        season = "Spring 🌸";
        break;
    case 5:  // June
    case 6:  // July
    case 7:  // August
        season = "Summer ☀️";
        break;
    case 8:  // September
    case 9:  // October
    case 10: // November
        season = "Autumn 🍂";
        break;
    default:
        season = "Unknown";
}

console.log(`Month: ${month + 1}, Season: ${season}`);

// Switch with expressions
console.log("\n🔹 Switch with Expressions:");
const userScore2 = 85;
let grade2;

switch (true) {
    case userScore2 >= 90:
        grade2 = "A";
        break;
    case userScore2 >= 80:
        grade2 = "B";
        break;
    case userScore2 >= 70:
        grade2 = "C";
        break;
    case userScore2 >= 60:
        grade2 = "D";
        break;
    default:
        grade2 = "F";
}

console.log(`Score: ${userScore2}, Grade: ${grade2}`);

// Switch returning values
console.log("\n🔹 Switch Returning Values:");
function getShippingCost(country, weight) {
    let baseCost;
    
    switch (country.toLowerCase()) {
        case "usa":
            baseCost = weight <= 1 ? 5 : 10;
            break;
        case "canada":
            baseCost = weight <= 1 ? 8 : 15;
            break;
        case "uk":
            baseCost = weight <= 1 ? 12 : 20;
            break;
        case "australia":
            baseCost = weight <= 1 ? 15 : 25;
            break;
        default:
            baseCost = weight <= 1 ? 20 : 35;
    }
    
    return {
        country,
        weight,
        baseCost,
        tax: baseCost * 0.1,
        total: baseCost * 1.1
    };
}

console.log("USA shipping:", getShippingCost("USA", 0.5));
console.log("UK shipping:", getShippingCost("UK", 2));
console.log("Japan shipping:", getShippingCost("Japan", 1));

// Switch vs if/else comparison
console.log("\n🔹 Switch vs If/Else Comparison:");
const statusCode = 404;
let statusMessage;

// Using if/else
if (statusCode === 200) {
    statusMessage = "OK";
} else if (statusCode === 301) {
    statusMessage = "Moved Permanently";
} else if (statusCode === 302) {
    statusMessage = "Found";
} else if (statusCode === 404) {
    statusMessage = "Not Found";
} else if (statusCode === 500) {
    statusMessage = "Internal Server Error";
} else {
    statusMessage = "Unknown Status";
}

console.log(`If/Else: Status ${statusCode} = ${statusMessage}`);

// Using switch
switch (statusCode) {
    case 200:
        statusMessage = "OK";
        break;
    case 301:
        statusMessage = "Moved Permanently";
        break;
    case 302:
        statusMessage = "Found";
        break;
    case 404:
        statusMessage = "Not Found";
        break;
    case 500:
        statusMessage = "Internal Server Error";
        break;
    default:
        statusMessage = "Unknown Status";
}

console.log(`Switch: Status ${statusCode} = ${statusMessage}`);

// Real-world example: Calculator
console.log("\n🔹 Real-world Example: Calculator:");
function calculate(operation, a, b) {
    let result;
    
    switch (operation) {
        case "add":
            result = a + b;
            console.log(`${a} + ${b} = ${result}`);
            break;
        case "subtract":
            result = a - b;
            console.log(`${a} - ${b} = ${result}`);
            break;
        case "multiply":
            result = a * b;
            console.log(`${a} × ${b} = ${result}`);
            break;
        case "divide":
            if (b === 0) {
                console.log("Error: Division by zero!");
                return null;
            }
            result = a / b;
            console.log(`${a} ÷ ${b} = ${result}`);
            break;
        case "power":
            result = a ** b;
            console.log(`${a} ^ ${b} = ${result}`);
            break;
        case "modulus":
            result = a % b;
            console.log(`${a} % ${b} = ${result}`);
            break;
        default:
            console.log(`Unknown operation: ${operation}`);
            return null;
    }
    
    return result;
}

calculate("add", 10, 5);
calculate("divide", 10, 0);
calculate("power", 2, 3);

// ==========================
// 3. LOOPS
// ==========================

console.log("\n\n3. LOOPS");
console.log("========\n");

// for loop
console.log("🔹 For Loop:");
console.log("Counting up:");
for (let i = 1; i <= 5; i++) {
    console.log(`  Iteration ${i}`);
}

console.log("\nCounting down:");
for (let i = 5; i >= 1; i--) {
    console.log(`  Countdown: ${i}`);
}

console.log("\nMultiple variables:");
for (let i = 0, j = 10; i < j; i++, j--) {
    console.log(`  i=${i}, j=${j}`);
}

// while loop
console.log("\n🔹 While Loop:");
let attempts = 0;
const target = 7;

console.log("Guessing game:");
while (attempts < 10) {
    attempts++;
    const guess = Math.floor(Math.random() * 10) + 1;
    console.log(`  Attempt ${attempts}: Guessed ${guess}`);
    
    if (guess === target) {
        console.log(`  🎉 Found ${target} in ${attempts} attempts!`);
        break;
    }
}

if (attempts === 10) {
    console.log(`  😞 Failed to find ${target} in 10 attempts`);
}

// do...while loop
console.log("\n🔹 Do...While Loop:");
let userChoice;
let menuRuns = 0;

console.log("Menu system:");
do {
    menuRuns++;
    console.log(`\n  === MENU (Run ${menuRuns}) ===`);
    console.log("  1. View Profile");
    console.log("  2. Edit Settings");
    console.log("  3. View Notifications");
    console.log("  0. Exit");
    
    // Simulate user input
    userChoice = Math.random() > 0.8 ? 0 : Math.floor(Math.random() * 3) + 1;
    console.log(`  User selected: ${userChoice}`);
    
    switch (userChoice) {
        case 1:
            console.log("  Showing profile...");
            break;
        case 2:
            console.log("  Opening settings...");
            break;
        case 3:
            console.log("  Showing notifications...");
            break;
        case 0:
            console.log("  Exiting menu...");
            break;
        default:
            console.log("  Invalid choice!");
    }
} while (userChoice !== 0 && menuRuns < 5);

// for...in loop (objects)
console.log("\n🔹 For...In Loop (Objects):");
const employee = {
    name: "Alice Johnson",
    age: 32,
    department: "Engineering",
    salary: 85000,
    skills: ["JavaScript", "React", "Node.js"]
};

console.log("Employee properties:");
for (const key in employee) {
    console.log(`  ${key}: ${JSON.stringify(employee[key])}`);
}

// Only own properties (not inherited)
console.log("\nOnly own properties:");
for (const key in employee) {
    if (employee.hasOwnProperty(key)) {
        console.log(`  ${key}: ${employee[key]}`);
    }
}

// for...of loop (iterables)
console.log("\n🔹 For...Of Loop (Iterables):");

// Arrays
const colors = ["red", "green", "blue", "yellow"];
console.log("Colors array:");
for (const color of colors) {
    console.log(`  ${color}`);
}

// Strings
const message2 = "Hello";
console.log("\nString characters:");
for (const char of message2) {
    console.log(`  ${char}`);
}

// Sets
const uniqueNumbers = new Set([1, 2, 3, 2, 1, 4, 5]);
console.log("\nSet values:");
for (const num of uniqueNumbers) {
    console.log(`  ${num}`);
}

// Maps
const userRoles = new Map([
    ["alice", "admin"],
    ["bob", "editor"],
    ["charlie", "viewer"]
]);

console.log("\nMap entries:");
for (const [username, role] of userRoles) {
    console.log(`  ${username}: ${role}`);
}

// NodeList (simulated)
const simulatedNodeList = {
    [Symbol.iterator]: function*() {
        yield { textContent: "Item 1", className: "active" };
        yield { textContent: "Item 2", className: "" };
        yield { textContent: "Item 3", className: "active" };
    }
};

console.log("\nSimulated NodeList:");
for (const element of simulatedNodeList) {
    console.log(`  Text: ${element.textContent}, Class: ${element.className}`);
}

// Array iteration methods
console.log("\n🔹 Array Iteration Methods:");
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log("Original array:", numbers);

// forEach
console.log("\nforEach (execute for each):");
numbers.forEach((num, index) => {
    console.log(`  numbers[${index}] = ${num}`);
});

// map
console.log("\nmap (transform each):");
const doubled = numbers.map(num => num * 2);
console.log("  Doubled:", doubled);

// filter
console.log("\nfilter (select elements):");
const evens = numbers.filter(num => num % 2 === 0);
console.log("  Even numbers:", evens);

// reduce
console.log("\nreduce (accumulate):");
const sum = numbers.reduce((total, num) => total + num, 0);
console.log("  Sum:", sum);

// find
console.log("\nfind (first matching):");
const firstGreaterThan5 = numbers.find(num => num > 5);
console.log("  First > 5:", firstGreaterThan5);

// some
console.log("\nsome (any match):");
const hasEven = numbers.some(num => num % 2 === 0);
console.log("  Has even numbers?", hasEven);

// every
console.log("\nevery (all match):");
const allPositive = numbers.every(num => num > 0);
console.log("  All positive?", allPositive);

// Real-world example: Data processing
console.log("\n🔹 Real-world Example: Data Processing Pipeline:");
const salesData = [
    { id: 1, product: "Laptop", price: 999, quantity: 2, region: "US" },
    { id: 2, product: "Mouse", price: 25, quantity: 10, region: "EU" },
    { id: 3, product: "Keyboard", price: 75, quantity: 5, region: "US" },
    { id: 4, product: "Monitor", price: 299, quantity: 3, region: "ASIA" },
    { id: 5, product: "Headphones", price: 150, quantity: 8, region: "EU" }
];

console.log("Original sales data:", salesData);

// Process pipeline
const processedData = salesData
    .filter(sale => sale.quantity > 3)                    // Only bulk orders
    .map(sale => ({
        ...sale,
        total: sale.price * sale.quantity,               // Add total
        discount: sale.quantity > 5 ? 0.1 : 0.05         // Apply discount
    }))
    .map(sale => ({
        ...sale,
        finalPrice: sale.total * (1 - sale.discount)     // Calculate final price
    }))
    .sort((a, b) => b.finalPrice - a.finalPrice);        // Sort by highest revenue

console.log("\nProcessed data (bulk orders with discounts):");
processedData.forEach((sale, index) => {
    console.log(`  ${index + 1}. ${sale.product}: $${sale.finalPrice.toFixed(2)} (${sale.discount * 100}% discount)`);
});

// Calculate statistics
const stats = processedData.reduce((acc, sale) => {
    acc.totalRevenue += sale.finalPrice;
    acc.totalItems += sale.quantity;
    acc.regions.add(sale.region);
    return acc;
}, { totalRevenue: 0, totalItems: 0, regions: new Set() });

console.log("\nStatistics:");
console.log(`  Total Revenue: $${stats.totalRevenue.toFixed(2)}`);
console.log(`  Total Items: ${stats.totalItems}`);
console.log(`  Regions: ${Array.from(stats.regions).join(", ")}`);

// ==========================
// 4. LOOP CONTROL STATEMENTS
// ==========================

console.log("\n\n4. LOOP CONTROL STATEMENTS");
console.log("==========================\n");

// break statement
console.log("🔹 Break Statement:");
console.log("Searching for number 7:");
for (let i = 1; i <= 10; i++) {
    console.log(`  Checking ${i}...`);
    if (i === 7) {
        console.log("  Found it! Stopping search.");
        break;
    }
}

// break in nested loops
console.log("\n🔹 Break in Nested Loops:");
outer: for (let i = 1; i <= 3; i++) {
    console.log(`Outer loop iteration ${i}:`);
    for (let j = 1; j <= 3; j++) {
        console.log(`  Inner loop iteration ${j}`);
        if (i === 2 && j === 2) {
            console.log("  Condition met! Breaking both loops.");
            break outer;
        }
    }
}

// continue statement
console.log("\n🔹 Continue Statement:");
console.log("Processing numbers (skipping even numbers):");
for (let i = 1; i <= 10; i++) {
    if (i % 2 === 0) {
        continue; // Skip even numbers
    }
    console.log(`  Processing odd number: ${i}`);
}

// continue with validation
console.log("\n🔹 Continue with Data Validation:");
const userData = [
    { name: "Alice", age: 25, email: "alice@example.com" },
    { name: "Bob", age: 17, email: "bob@example" }, // Invalid email
    { name: "", age: 30, email: "charlie@example.com" }, // Empty name
    { name: "Diana", age: -5, email: "diana@example.com" }, // Invalid age
    { name: "Eve", age: 28, email: "eve@example.com" }
];

console.log("Validating user data:");
const validUsers = [];

for (const user of userData) {
    // Skip if name is empty
    if (!user.name || user.name.trim() === "") {
        console.log(`  Skipping: Empty name`);
        continue;
    }
    
    // Skip if age is invalid
    if (typeof user.age !== 'number' || user.age < 0 || user.age > 120) {
        console.log(`  Skipping: Invalid age (${user.age})`);
        continue;
    }
    
    // Skip if email is invalid
    if (!user.email || !user.email.includes("@") || !user.email.includes(".")) {
        console.log(`  Skipping: Invalid email (${user.email})`);
        continue;
    }
    
    // All checks passed
    validUsers.push(user);
    console.log(`  Valid: ${user.name} (${user.age})`);
}

console.log(`\nValid users: ${validUsers.length} out of ${userData.length}`);

// Real-world example: Search and process
console.log("\n🔹 Real-world Example: Search in Inventory:");
const inventory = [
    { id: 1, name: "Laptop", category: "Electronics", price: 999, inStock: true },
    { id: 2, name: "Desk Chair", category: "Furniture", price: 199, inStock: false },
    { id: 3, name: "Coffee Mug", category: "Home", price: 15, inStock: true },
    { id: 4, name: "Wireless Mouse", category: "Electronics", price: 35, inStock: true },
    { id: 5, name: "Notebook", category: "Stationery", price: 8, inStock: false },
    { id: 6, name: "Monitor", category: "Electronics", price: 299, inStock: true }
];

const searchTerm = "electronics";
const maxPrice = 500;
let foundItems = [];

console.log(`Searching for "${searchTerm}" under $${maxPrice}:`);

for (const item of inventory) {
    // Skip if not in stock
    if (!item.inStock) {
        continue;
    }
    
    // Skip if too expensive
    if (item.price > maxPrice) {
        continue;
    }
    
    // Check if category matches search (case-insensitive)
    if (item.category.toLowerCase().includes(searchTerm.toLowerCase())) {
        foundItems.push(item);
        console.log(`  Found: ${item.name} - $${item.price}`);
        
        // Limit results
        if (foundItems.length >= 3) {
            console.log("  Reached result limit, stopping search.");
            break;
        }
    }
}

console.log(`\nTotal found: ${foundItems.length} items`);

// ==========================
// 5. ERROR HANDLING
// ==========================

console.log("\n\n5. ERROR HANDLING");
console.log("================\n");

// Basic try...catch
console.log("🔹 Basic Try...Catch:");
try {
    console.log("Trying risky operation...");
    // Simulate an error
    if (Math.random() > 0.5) {
        throw new Error("Random failure occurred!");
    }
    console.log("Operation successful!");
} catch (error) {
    console.error(`Caught error: ${error.message}`);
}

// Multiple error types
console.log("\n🔹 Handling Different Error Types:");
function parseUserData(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        
        // Validate required fields
        if (!data.name) {
            throw new SyntaxError("Missing required field: name");
        }
        
        if (!data.email || !data.email.includes("@")) {
            throw new TypeError("Invalid email format");
        }
        
        console.log("User data parsed successfully:", data);
        return data;
        
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error("JSON Syntax Error:", error.message);
        } else if (error instanceof TypeError) {
            console.error("Type Error:", error.message);
        } else {
            console.error("Unknown Error:", error.message);
        }
        return null;
    }
}

// Test different error cases
parseUserData('{"name": "John", "email": "john@example.com"}'); // Valid
parseUserData('{"name": "John", "email": "invalid"}'); // TypeError
parseUserData('{"email": "john@example.com"}'); // SyntaxError
parseUserData('invalid json'); // JSON.parse error

// finally block
console.log("\n🔹 Finally Block:");
function processFile(filename) {
    let fileHandle = null;
    
    try {
        console.log(`Opening file: ${filename}`);
        // Simulate file opening
        fileHandle = { 
            name: filename, 
            content: "File content here", 
            isOpen: true 
        };
        
        if (Math.random() > 0.7) {
            throw new Error("File read error!");
        }
        
        console.log("Processing file content...");
        // Simulate processing
        const processed = fileHandle.content.toUpperCase();
        console.log("Processed content:", processed);
        
        return processed;
        
    } catch (error) {
        console.error("File processing failed:", error.message);
        throw error; // Re-throw for caller
        
    } finally {
        // Always execute
        if (fileHandle && fileHandle.isOpen) {
            console.log(`Closing file: ${filename}`);
            fileHandle.isOpen = false;
        }
        console.log("Cleanup complete.");
    }
}

try {
    processFile("data.txt");
} catch (error) {
    console.error("Main: Failed to process file");
}

// Custom error classes
console.log("\n🔹 Custom Error Classes:");
class ValidationError extends Error {
    constructor(field, message) {
        super(`${field}: ${message}`);
        this.name = "ValidationError";
        this.field = field;
        this.timestamp = new Date().toISOString();
    }
}

class DatabaseError extends Error {
    constructor(operation, details) {
        super(`Database ${operation} failed`);
        this.name = "DatabaseError";
        this.operation = operation;
        this.details = details;
    }
}

function saveUser(user) {
    try {
        // Validation
        if (!user.name || user.name.trim().length < 2) {
            throw new ValidationError("name", "Must be at least 2 characters");
        }
        
        if (user.age < 13) {
            throw new ValidationError("age", "Must be at least 13 years old");
        }
        
        // Simulate database operation
        console.log("Saving to database...");
        if (Math.random() > 0.8) {
            throw new DatabaseError("insert", "Connection timeout");
        }
        
        console.log("User saved successfully!");
        return { success: true, id: Date.now() };
        
    } catch (error) {
        if (error instanceof ValidationError) {
            console.error(`Validation Error [${error.timestamp}]:`, error.message);
        } else if (error instanceof DatabaseError) {
            console.error(`Database Error: ${error.operation} - ${error.details}`);
        } else {
            console.error("Unexpected Error:", error);
        }
        return { success: false, error: error.message };
    }
}

// Test error handling
console.log("Test 1 - Valid user:");
saveUser({ name: "Alice", age: 25 });

console.log("\nTest 2 - Invalid name:");
saveUser({ name: "A", age: 25 });

console.log("\nTest 3 - Invalid age:");
saveUser({ name: "Bob", age: 12 });

// Real-world example: API request with error handling
console.log("\n🔹 Real-world Example: API Request Handler:");
async function fetchWithRetry(url, retries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Attempt ${attempt}/${retries} to fetch ${url}`);
            
            // Simulate API call
            if (Math.random() > 0.6) {
                throw new Error(`HTTP 500 - Server Error`);
            }
            
            if (Math.random() > 0.8) {
                throw new Error(`HTTP 404 - Not Found`);
            }
            
            // Simulate success
            const data = { url, status: "success", data: { message: "Hello World" } };
            console.log("Success!");
            return data;
            
        } catch (error) {
            console.error(`Attempt ${attempt} failed: ${error.message}`);
            
            // Don't retry for client errors (400s)
            if (error.message.includes("404")) {
                console.log("Client error, not retrying.");
                throw error;
            }
            
            // Check if we should retry
            if (attempt === retries) {
                console.log("Max retries reached.");
                throw new Error(`Failed after ${retries} attempts: ${error.message}`);
            }
            
            // Wait before retry (exponential backoff)
            const waitTime = delay * Math.pow(2, attempt - 1);
            console.log(`Waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
}

// Test the retry logic
fetchWithRetry("https://api.example.com/data", 3)
    .then(data => console.log("Final result:", data))
    .catch(error => console.error("Final error:", error.message));

// ==========================
// 6. PATTERN MATCHING & MODERN PATTERNS
// ==========================

console.log("\n\n6. PATTERN MATCHING & MODERN PATTERNS");
console.log("=====================================\n");

// Early returns pattern
console.log("🔹 Early Returns Pattern:");
function validateOrder(order) {
    // Guard clauses (early returns for invalid cases)
    if (!order) {
        return { valid: false, error: "Order is required" };
    }
    
    if (!order.items || order.items.length === 0) {
        return { valid: false, error: "Order must contain items" };
    }
    
    if (order.total <= 0) {
        return { valid: false, error: "Invalid order total" };
    }
    
    // All validations passed
    const processedOrder = {
        ...order,
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: "pending",
        createdAt: new Date().toISOString()
    };
    
    return { valid: true, order: processedOrder };
}

console.log("Valid order:", validateOrder({
    items: [{ id: 1, name: "Product", price: 99 }],
    total: 99
}));

console.log("Empty order:", validateOrder({ items: [], total: 0 }));

// Object lookup instead of switch
console.log("\n🔹 Object Lookup Pattern:");
const STATUS_MESSAGES = {
    pending: { text: "Your order is being processed", color: "blue" },
    processing: { text: "Your order is being prepared", color: "yellow" },
    shipped: { text: "Your order is on the way!", color: "green" },
    delivered: { text: "Your order has been delivered", color: "green" },
    cancelled: { text: "Your order was cancelled", color: "red" }
};

function getOrderStatus(status) {
    return STATUS_MESSAGES[status] || { text: "Unknown status", color: "gray" };
}

console.log("Pending:", getOrderStatus("pending"));
console.log("Shipped:", getOrderStatus("shipped"));
console.log("Invalid:", getOrderStatus("invalid"));

// Function mapping
console.log("\n🔹 Function Mapping Pattern:");
const CALCULATOR_OPERATIONS = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => b !== 0 ? a / b : null,
    power: (a, b) => a ** b,
    modulus: (a, b) => a % b
};

function calculate2(operation, a, b) {
    const operationFn = CALCULATOR_OPERATIONS[operation];
    
    if (!operationFn) {
        console.error(`Unknown operation: ${operation}`);
        return null;
    }
    
    const result = operationFn(a, b);
    console.log(`${a} ${operation} ${b} = ${result}`);
    return result;
}

calculate2("add", 10, 5);
calculate2("divide", 10, 0);
calculate2("unknown", 10, 5);

// Pipeline pattern
console.log("\n🔹 Pipeline Pattern:");
const pipeline = {
    data: null,
    
    setData(data) {
        this.data = data;
        return this;
    },
    
    filter(predicate) {
        if (Array.isArray(this.data)) {
            this.data = this.data.filter(predicate);
        }
        return this;
    },
    
    map(transform) {
        if (Array.isArray(this.data)) {
            this.data = this.data.map(transform);
        }
        return this;
    },
    
    sort(comparator) {
        if (Array.isArray(this.data)) {
            this.data.sort(comparator);
        }
        return this;
    },
    
    get() {
        return this.data;
    }
};

const numbers2 = [5, 2, 8, 1, 9, 3, 6, 4, 7];
const result2 = pipeline
    .setData(numbers2)
    .filter(n => n % 2 === 0)     // Keep evens
    .map(n => n * 2)              // Double them
    .sort((a, b) => a - b)        // Sort ascending
    .get();

console.log("Pipeline result:", result2);

// Strategy pattern
console.log("\n🔹 Strategy Pattern:");
const PAYMENT_STRATEGIES = {
    creditCard: (amount, details) => {
        console.log(`Processing credit card payment of $${amount}`);
        return { success: true, method: "credit_card", amount };
    },
    
    paypal: (amount, details) => {
        console.log(`Processing PayPal payment of $${amount}`);
        return { success: true, method: "paypal", amount };
    },
    
    bitcoin: (amount, details) => {
        console.log(`Processing Bitcoin payment of $${amount}`);
        return { success: true, method: "bitcoin", amount, btcAmount: amount / 50000 };
    },
    
    bankTransfer: (amount, details) => {
        console.log(`Processing bank transfer of $${amount}`);
        return { success: true, method: "bank_transfer", amount, reference: `TRX-${Date.now()}` };
    }
};

function processPayment(method, amount, details = {}) {
    const strategy = PAYMENT_STRATEGIES[method];
    
    if (!strategy) {
        throw new Error(`Unsupported payment method: ${method}`);
    }
    
    try {
        return strategy(amount, details);
    } catch (error) {
        console.error(`Payment failed: ${error.message}`);
        return { success: false, error: error.message };
    }
}

console.log("Credit card:", processPayment("creditCard", 99.99));
console.log("Bitcoin:", processPayment("bitcoin", 50));
console.log("Invalid:", processPayment("invalid", 100));

// ==========================
// 7. PERFORMANCE OPTIMIZATION
// ==========================

console.log("\n\n7. PERFORMANCE OPTIMIZATION");
console.log("===========================\n");

// Loop optimization
console.log("🔹 Loop Optimization:");
const largeArray = Array.from({ length: 1000000 }, (_, i) => i + 1);

console.log("Testing loop performance...");

// ❌ Bad: Recalculating length each iteration
console.time("Bad loop");
let sum1 = 0;
for (let i = 0; i < largeArray.length; i++) {
    sum1 += largeArray[i];
}
console.timeEnd("Bad loop");

// ✅ Good: Cache length
console.time("Good loop");
let sum2 = 0;
const length = largeArray.length;
for (let i = 0; i < length; i++) {
    sum2 += largeArray[i];
}
console.timeEnd("Good loop");

// ✅ Better: While loop (often fastest)
console.time("While loop");
let sum3 = 0;
let index = 0;
while (index < largeArray.length) {
    sum3 += largeArray[index];
    index++;
}
console.timeEnd("While loop");

console.log(`All sums equal? ${sum1 === sum2 && sum2 === sum3}`);

// Condition ordering
console.log("\n🔹 Condition Ordering:");

function expensiveCheck() {
    console.log("  Running expensive check...");
    // Simulate expensive operation
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result += Math.random();
    }
    return result > 500000;
}

function cheapCheck() {
    console.log("  Running cheap check...");
    return Math.random() > 0.5;
}

// ❌ Bad: Expensive check first
console.log("Bad order (expensive first):");
if (expensiveCheck() && cheapCheck()) {
    console.log("  Condition passed");
}

// ✅ Good: Cheap check first (short-circuit)
console.log("\nGood order (cheap first):");
if (cheapCheck() && expensiveCheck()) {
    console.log("  Condition passed");
}

// Avoiding nested loops
console.log("\n🔹 Avoiding Nested Loops:");

const array1 = Array.from({ length: 1000 }, (_, i) => i);
const array2 = Array.from({ length: 1000 }, (_, i) => i * 2);

// ❌ Bad: O(n²) nested loops
console.time("Nested loops");
let matches1 = 0;
for (let i = 0; i < array1.length; i++) {
    for (let j = 0; j < array2.length; j++) {
        if (array1[i] === array2[j]) {
            matches1++;
        }
    }
}
console.timeEnd("Nested loops");

// ✅ Good: O(n) using Set
console.time("Using Set");
const set2 = new Set(array2);
let matches2 = 0;
for (let i = 0; i < array1.length; i++) {
    if (set2.has(array1[i])) {
        matches2++;
    }
}
console.timeEnd("Using Set");

console.log(`Matches found: ${matches1} (both methods should match)`);

// Lazy evaluation
console.log("\n🔹 Lazy Evaluation:");
function expensiveComputation(value) {
    console.log(`  Computing for ${value}...`);
    // Simulate expensive computation
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result += Math.sqrt(value + i);
    }
    return result;
}

const data = [1, 2, 3, 4, 5];

// ❌ Bad: Compute all values even if not needed
console.log("Eager evaluation:");
const computed = data.map(expensiveComputation);
console.log("First value:", computed[0]);

// ✅ Good: Compute only when needed
console.log("\nLazy evaluation:");
function* lazyMap(array, fn) {
    for (const item of array) {
        yield fn(item);
    }
}

const lazyComputed = lazyMap(data, expensiveComputation);
console.log("First value:", lazyComputed.next().value);

// Memoization
console.log("\n🔹 Memoization Pattern:");
function memoize(fn) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            console.log(`  Cache hit for ${key}`);
            return cache.get(key);
        }
        
        console.log(`  Computing for ${key}`);
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}

// Expensive function
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Memoized version
const memoizedFibonacci = memoize(function(n) {
    if (n <= 1) return n;
    return memoizedFibonacci(n - 1) + memoizedFibonacci(n - 2);
});

console.log("Without memoization (slow):");
console.time("No memo");
console.log(`  fib(10) = ${fibonacci(10)}`);
console.timeEnd("No memo");

console.log("\nWith memoization (fast):");
console.time("With memo");
console.log(`  fib(10) = ${memoizedFibonacci(10)}`);
console.timeEnd("With memo");

console.time("Memoized again (cached)");
console.log(`  fib(10) = ${memoizedFibonacci(10)}`);
console.timeEnd("Memoized again (cached)");

// ==========================
// 8. REAL-WORLD EXAMPLES
// ==========================

console.log("\n\n8. REAL-WORLD EXAMPLES");
console.log("=====================\n");

// Example 1: E-commerce checkout system
console.log("🔹 Example 1: E-commerce Checkout System:");
function processCheckout(cart, user, paymentMethod, shippingAddress) {
    console.log("Starting checkout process...");
    
    // Validation
    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
    }
    
    if (!user || !user.email) {
        throw new Error("User information is required");
    }
    
    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Apply discounts
    let discount = 0;
    if (user.isPremium) {
        discount = subtotal * 0.1; // 10% for premium
    } else if (subtotal > 100) {
        discount = 10; // $10 off for orders > $100
    }
    
    // Calculate tax (simplified)
    const taxRate = shippingAddress.state === "CA" ? 0.0825 : 0.06;
    const tax = (subtotal - discount) * taxRate;
    
    // Shipping cost
    let shipping = 0;
    if (subtotal < 50) {
        shipping = 5.99;
    } else if (subtotal < 100) {
        shipping = 3.99;
    }
    // Free shipping for orders over $100
    
    // Final total
    const total = subtotal - discount + tax + shipping;
    
    // Payment processing
    let paymentResult;
    try {
        switch (paymentMethod.type) {
            case "credit_card":
                paymentResult = processCreditCard(paymentMethod, total);
                break;
            case "paypal":
                paymentResult = processPayPal(paymentMethod, total);
                break;
            default:
                throw new Error(`Unsupported payment method: ${paymentMethod.type}`);
        }
    } catch (error) {
        throw new Error(`Payment failed: ${error.message}`);
    }
    
    // Create order
    const order = {
        id: `ORD-${Date.now()}`,
        user: user.email,
        items: cart.items,
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        payment: paymentResult,
        shippingAddress,
        status: "paid",
        createdAt: new Date().toISOString()
    };
    
    // Inventory check
    for (const item of cart.items) {
        if (!checkInventory(item.productId, item.quantity)) {
            throw new Error(`Insufficient inventory for product ${item.productId}`);
        }
    }
    
    console.log("Checkout completed successfully!");
    return order;
}

function processCreditCard(details, amount) {
    console.log(`Processing credit card payment of $${amount}`);
    return {
        transactionId: `CC-${Date.now()}`,
        amount,
        method: "credit_card",
        status: "completed"
    };
}

function processPayPal(details, amount) {
    console.log(`Processing PayPal payment of $${amount}`);
    return {
        transactionId: `PP-${Date.now()}`,
        amount,
        method: "paypal",
        status: "completed"
    };
}

function checkInventory(productId, quantity) {
    // Simulate inventory check
    return Math.random() > 0.1; // 90% chance item is in stock
}

// Test checkout
const sampleCart = {
    items: [
        { productId: 1, name: "Laptop", price: 999, quantity: 1 },
        { productId: 2, name: "Mouse", price: 25, quantity: 2 }
    ]
};

const sampleUser = {
    email: "john@example.com",
    isPremium: true
};

try {
    const order = processCheckout(
        sampleCart,
        sampleUser,
        { type: "credit_card", number: "4111111111111111", expiry: "12/25" },
        { street: "123 Main St", city: "San Francisco", state: "CA", zip: "94107" }
    );
    console.log("Order created:", order);
} catch (error) {
    console.error("Checkout failed:", error.message);
}

// Example 2: Game loop
console.log("\n🔹 Example 2: Game Engine Loop:");
class GameEngine {
    constructor() {
        this.isRunning = false;
        this.fps = 60;
        this.frameTime = 1000 / this.fps;
        this.lastFrameTime = 0;
        this.gameObjects = [];
        this.score = 0;
        this.lives = 3;
    }
    
    start() {
        console.log("Starting game engine...");
        this.isRunning = true;
        this.gameLoop();
    }
    
    stop() {
        console.log("Stopping game engine...");
        this.isRunning = false;
    }
    
    addGameObject(obj) {
        this.gameObjects.push(obj);
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastFrameTime;
        
        // Only update if enough time has passed for desired FPS
        if (deltaTime >= this.frameTime) {
            this.lastFrameTime = currentTime - (deltaTime % this.frameTime);
            
            // Update game state
            this.update(deltaTime);
            
            // Render (simulated)
            this.render();
            
            // Check game over
            if (this.lives <= 0) {
                console.log("Game Over! Final score:", this.score);
                this.stop();
                return;
            }
        }
        
        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update(deltaTime) {
        // Update all game objects
        for (let i = this.gameObjects.length - 1; i >= 0; i--) {
            const obj = this.gameObjects[i];
            
            // Simulate object update
            obj.x += obj.vx * deltaTime / 1000;
            obj.y += obj.vy * deltaTime / 1000;
            
            // Check boundaries
            if (obj.x < 0 || obj.x > 800 || obj.y < 0 || obj.y > 600) {
                console.log(`Object ${obj.id} out of bounds, removing.`);
                this.gameObjects.splice(i, 1);
                this.score += 10;
            }
            
            // Check collisions (simplified)
            for (let j = i - 1; j >= 0; j--) {
                const other = this.gameObjects[j];
                const dx = obj.x - other.x;
                const dy = obj.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 20) { // Collision radius
                    console.log(`Collision between ${obj.id} and ${other.id}!`);
                    this.lives--;
                    this.gameObjects.splice(i, 1);
                    this.gameObjects.splice(j, 1);
                    break;
                }
            }
        }
        
        // Occasionally add new objects
        if (Math.random() < 0.02) {
            this.addGameObject({
                id: `obj-${Date.now()}`,
                x: Math.random() * 800,
                y: Math.random() * 600,
                vx: (Math.random() - 0.5) * 100,
                vy: (Math.random() - 0.5) * 100
            });
        }
    }
    
    render() {
        // Simulated rendering
        // console.log(`Frame: ${this.gameObjects.length} objects, Score: ${this.score}, Lives: ${this.lives}`);
    }
}

// Start a short game simulation
console.log("Starting game simulation...");
const game = new GameEngine();

// Add initial objects
for (let i = 0; i < 5; i++) {
    game.addGameObject({
        id: `obj-${i}`,
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 50,
        vy: (Math.random() - 0.5) * 50
    });
}

game.start();

// Run for 3 seconds then stop
setTimeout(() => {
    game.stop();
    console.log("Game simulation ended.");
}, 3000);

// ==========================
// SUMMARY & KEY TAKEAWAYS
// ==========================

console.log("\n\n📊 SUMMARY & KEY TAKEAWAYS");
console.log("==========================\n");

const keyTakeaways = [
    "✅ Use if/else for simple conditions, switch for multiple constant comparisons",
    "✅ Prefer early returns over deep nesting for cleaner code",
    "✅ Choose the right loop: for for counting, while for unknown iterations, for...of for arrays",
    "✅ Use break to exit loops early and continue to skip iterations",
    "✅ Always handle errors with try/catch/finally",
    "✅ Optimize loops by caching length and ordering conditions",
    "✅ Use modern patterns: early returns, object lookups, function mapping",
    "✅ Write readable code - others (and future you) will thank you!",
    "✅ Test edge cases and error conditions thoroughly",
    "✅ Profile and optimize performance-critical code"
];

console.log("Control Flow Key Takeaways:");
keyTakeaways.forEach((takeaway, index) => {
    console.log(`${index + 1}. ${takeaway}`);
});

console.log("\n🎯 Practice Exercises:");
console.log("1. Implement FizzBuzz with different loop types");
console.log("2. Create a password validator with detailed error messages");
console.log("3. Build a shopping cart calculator with discounts and tax");
console.log("4. Write a data processor that handles errors gracefully");

console.log("\n🚀 Next Steps:");
console.log("1. Review any concepts you found challenging");
console.log("2. Practice with the provided exercises");
console.log("3. Move on to Functions & Scope module");
console.log("4. Build small projects to solidify your understanding");

console.log("\n" + "=".repeat(60));
console.log("END OF CONTROL FLOW EXAMPLES");
console.log("=".repeat(60));
