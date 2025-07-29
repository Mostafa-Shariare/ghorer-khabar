#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnosing Project Issues...\n');

// Check 1: Environment file
console.log('1. Checking environment file...');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('MONGODB_URI')) {
    console.log('✅ MONGODB_URI is configured');
  } else {
    console.log('❌ MONGODB_URI is missing');
  }
  if (envContent.includes('JWT_SECRET')) {
    console.log('✅ JWT_SECRET is configured');
  } else {
    console.log('❌ JWT_SECRET is missing');
  }
} else {
  console.log('❌ .env.local file is missing');
  console.log('   Run: npm run setup');
}

// Check 2: Package.json and dependencies
console.log('\n2. Checking dependencies...');
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  console.log('✅ package.json exists');
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    console.log('✅ node_modules exists');
  } else {
    console.log('❌ node_modules is missing');
    console.log('   Run: npm install');
  }
} else {
  console.log('❌ package.json is missing');
}

// Check 3: MongoDB connection
console.log('\n3. Checking MongoDB connection...');
try {
  require('dotenv').config({ path: '.env.local' });
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    console.log('✅ MongoDB URI found in environment');
    if (mongoUri.includes('localhost')) {
      console.log('⚠️  Using local MongoDB - ensure MongoDB is running');
    } else if (mongoUri.includes('mongodb.net')) {
      console.log('✅ Using MongoDB Atlas');
    }
  } else {
    console.log('❌ MongoDB URI not found');
  }
} catch (error) {
  console.log('⚠️  Could not load environment variables');
}

// Check 4: Port availability
console.log('\n4. Checking port availability...');
const net = require('net');
const server = net.createServer();

server.listen(3000, () => {
  console.log('✅ Port 3000 is available');
  server.close();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('❌ Port 3000 is already in use');
    console.log('   Try: npx kill-port 3000');
    console.log('   Or use a different port: npm run dev -- -p 3001');
  } else {
    console.log('⚠️  Port check failed:', err.message);
  }
});

// Check 5: Next.js configuration
console.log('\n5. Checking Next.js configuration...');
const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
if (fs.existsSync(nextConfigPath)) {
  console.log('✅ next.config.mjs exists');
} else {
  console.log('⚠️  next.config.mjs not found (this is usually okay)');
}

console.log('\n📋 Recommended Actions:');
console.log('1. Ensure MongoDB is running (if using local)');
console.log('2. Check your MongoDB connection string');
console.log('3. Run: npm run dev');
console.log('4. Open: http://localhost:3000');

console.log('\n🆘 If issues persist:');
console.log('1. Check the browser console for errors');
console.log('2. Check the terminal for server errors');
console.log('3. Verify MongoDB is accessible');