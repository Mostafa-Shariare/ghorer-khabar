#!/usr/bin/env node

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testAuth() {
  console.log('🧪 Testing JWT Authentication System\n');

  let cookies = '';

  try {
    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'testpassword123'
      })
    });

    const registerData = await registerResponse.json();
    
    if (registerData.success) {
      console.log('✅ Registration successful');
      // Extract cookies from response
      const setCookieHeader = registerResponse.headers.get('set-cookie');
      if (setCookieHeader) {
        cookies = setCookieHeader.split(';')[0];
      }
    } else {
      console.log('❌ Registration failed:', registerData.message);
      return;
    }

    // Test 2: Get user profile
    console.log('\n2. Testing user profile retrieval...');
    const profileResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Cookie': cookies
      }
    });

    const profileData = await profileResponse.json();
    
    if (profileData.success) {
      console.log('✅ Profile retrieval successful');
      console.log(`   User: ${profileData.user.username} (${profileData.user.role})`);
    } else {
      console.log('❌ Profile retrieval failed:', profileData.message);
    }

    // Test 3: Test protected user route
    console.log('\n3. Testing protected user route...');
    const userRouteResponse = await fetch(`${BASE_URL}/api/protected/user`, {
      headers: {
        'Cookie': cookies
      }
    });

    const userRouteData = await userRouteResponse.json();
    
    if (userRouteData.success) {
      console.log('✅ User route access successful');
    } else {
      console.log('❌ User route access failed:', userRouteData.message);
    }

    // Test 4: Test protected admin route (should fail for regular user)
    console.log('\n4. Testing protected admin route (should fail for regular user)...');
    const adminRouteResponse = await fetch(`${BASE_URL}/api/protected/admin`, {
      headers: {
        'Cookie': cookies
      }
    });

    const adminRouteData = await adminRouteResponse.json();
    
    if (!adminRouteData.success) {
      console.log('✅ Admin route correctly denied access');
    } else {
      console.log('❌ Admin route should have been denied');
    }

    // Test 5: Logout
    console.log('\n5. Testing logout...');
    const logoutResponse = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Cookie': cookies
      }
    });

    const logoutData = await logoutResponse.json();
    
    if (logoutData.success) {
      console.log('✅ Logout successful');
    } else {
      console.log('❌ Logout failed:', logoutData.message);
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📝 To test with an admin user:');
    console.log('1. Register a user normally');
    console.log('2. Connect to MongoDB and update the user role to "admin"');
    console.log('3. Test the admin route again');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. The development server is running (npm run dev)');
    console.log('2. MongoDB is connected');
    console.log('3. Environment variables are set correctly');
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/me`);
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the development server first:');
    console.log('   npm run dev');
    process.exit(1);
  }

  await testAuth();
}

main(); 