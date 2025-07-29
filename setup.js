#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔧 JWT Authentication System Setup\n');

// Generate JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Create .env.local file
const envContent = `# MongoDB Connection String
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/ghorer-khabar

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ghorer-khabar

# JWT Secret (auto-generated)
JWT_SECRET=${jwtSecret}

# Node Environment
NODE_ENV=development
`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists. Skipping creation.');
  } else {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file with generated JWT secret');
  }
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  process.exit(1);
}

console.log('\n📋 Next Steps:');
console.log('1. Update MONGODB_URI in .env.local with your MongoDB connection string');
console.log('2. Run: npm run dev');
console.log('3. Open http://localhost:3000 in your browser');
console.log('\n🔐 Your JWT secret has been generated and saved to .env.local');
console.log('⚠️  Remember to change the JWT secret in production!'); 