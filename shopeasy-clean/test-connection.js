#!/usr/bin/env node

/**
 * Test Script for Frontend-Backend Connection
 * Run this to verify your ShopEasy backend is working properly
 */

const https = require('https');

const BACKEND_URL = 'https://shopeasy-backend-tnkk.onrender.com';

// Test function
function testEndpoint(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Run tests
async function runTests() {
  console.log('🚀 Testing ShopEasy Backend Connection...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResult = await testEndpoint(`${BACKEND_URL}/health`);
    console.log(`   Status: ${healthResult.status}`);
    console.log(`   Response: ${JSON.stringify(healthResult.data, null, 2)}\n`);

    // Test 2: Auth Endpoints
    console.log('2️⃣ Testing Auth Endpoints...');
    const authResult = await testEndpoint(`${BACKEND_URL}/api/auth`);
    console.log(`   Status: ${authResult.status}`);
    console.log(`   Available endpoints: ${JSON.stringify(authResult.data, null, 2)}\n`);

    // Test 3: Login Test (with sample data)
    console.log('3️⃣ Testing Login Endpoint...');
    const loginResult = await testEndpoint(
      `${BACKEND_URL}/api/auth/login`,
      'POST',
      { phone_number: '+918179688221' }
    );
    console.log(`   Status: ${loginResult.status}`);
    console.log(`   Response: ${JSON.stringify(loginResult.data, null, 2)}\n`);

    // Test 4: Products Endpoint
    console.log('4️⃣ Testing Products Endpoint...');
    const productsResult = await testEndpoint(`${BACKEND_URL}/api/products`);
    console.log(`   Status: ${productsResult.status}`);
    console.log(`   Response: ${JSON.stringify(productsResult.data, null, 2)}\n`);

    console.log('✅ All tests completed!');
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`   Backend URL: ${BACKEND_URL}`);
    console.log(`   Health Check: ${healthResult.status === 200 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Auth Endpoints: ${authResult.status === 200 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Login Test: ${loginResult.status === 200 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Products: ${productsResult.status === 200 ? '✅ PASS' : '❌ FAIL'}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if your backend is running on Render');
    console.log('   2. Verify the backend URL is correct');
    console.log('   3. Check Render logs for any errors');
    console.log('   4. Ensure environment variables are set correctly');
  }
}

// Run the tests
runTests();
