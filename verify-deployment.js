#!/usr/bin/env node

/**
 * Deployment Verification Script
 * This script helps verify that your Vercel deployment is working correctly
 * and that the /admin-setup route is accessible.
 */

const https = require('https');
const http = require('http');

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'User-Agent': 'DeploymentVerifier/1.0',
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: responseData
        });
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

async function verifyDeployment(deploymentUrl) {
  console.log('🔍 Verifying deployment:', deploymentUrl);
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Root route
    console.log('✅ Testing root route (/)...');
    const rootResponse = await makeRequest(deploymentUrl);
    console.log(`   Status: ${rootResponse.status}`);
    console.log(`   Content-Type: ${rootResponse.headers['content-type']}`);
    
    // Test 2: Admin setup route
    console.log('\\n✅ Testing admin setup route (/admin-setup)...');
    const adminSetupResponse = await makeRequest(deploymentUrl + '/admin-setup');
    console.log(`   Status: ${adminSetupResponse.status}`);
    console.log(`   Content-Type: ${adminSetupResponse.headers['content-type']}`);
    
    if (adminSetupResponse.status === 200) {
      console.log('   ✅ Admin setup route is accessible');
    } else {
      console.log('   ❌ Admin setup route returned an error');
      console.log('   Response body:', adminSetupResponse.body.substring(0, 200) + '...');
    }
    
    // Test 3: API route
    console.log('\\n✅ Testing API route (/api/admin/setup)...');
    const apiResponse = await makeRequest(deploymentUrl + '/api/admin/setup', 'OPTIONS');
    console.log(`   Status: ${apiResponse.status}`);
    console.log(`   CORS Headers: ${apiResponse.headers['access-control-allow-origin'] || 'Not set'}`);
    
    // Test 4: Test POST to admin setup API (this should fail validation but should be accessible)
    console.log('\\n✅ Testing API endpoint POST (/api/admin/setup)...');
    const postResponse = await makeRequest(deploymentUrl + '/api/admin/setup', 'POST', {});
    console.log(`   Status: ${postResponse.status}`);
    
    if (postResponse.status === 400 || postResponse.status === 405) {
      console.log('   ✅ API endpoint is responding (expected validation error)');
    } else if (postResponse.status >= 500) {
      console.log('   ❌ API endpoint has server errors');
      console.log('   Response:', postResponse.body);
    }
    
    console.log('\\n' + '=' .repeat(50));
    console.log('🎉 Deployment verification completed!');
    
  } catch (error) {
    console.error('❌ Error during verification:', error.message);
  }
}

// Check if deployment URL was provided
const deploymentUrl = process.argv[2];

if (!deploymentUrl) {
  console.log('Usage: node verify-deployment.js <deployment-url>');
  console.log('Example: node verify-deployment.js https://your-app.vercel.app');
  process.exit(1);
}

// Run verification
verifyDeployment(deploymentUrl);
