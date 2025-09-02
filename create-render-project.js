const https = require('https');
const fs = require('fs');

console.log('🚀 Creating ShopEasy Backend Project in Render...\n');

// Render API configuration
const RENDER_API_CONFIG = {
  hostname: 'api.render.com',
  port: 443,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_RENDER_API_KEY' // You'll need to get this from Render
  }
};

// Project configuration
const PROJECT_CONFIG = {
  name: 'shopeasy-backend',
  type: 'web_service',
  env: 'node',
  plan: 'starter',
  buildCommand: 'npm install',
  startCommand: 'npm start',
  healthCheckPath: '/health',
  autoDeploy: true,
  repoUrl: 'https://github.com/suriekke/shopeasy2',
  branch: 'main',
  rootDir: 'backend'
};

console.log('📋 Project Configuration:');
console.log(JSON.stringify(PROJECT_CONFIG, null, 2));

console.log('\n🎯 MANUAL DEPLOYMENT STEPS (Required):');
console.log('=====================================');
console.log('1. Go to https://render.com');
console.log('2. Sign in with your GitHub account');
console.log('3. Click "New +" → "Web Service"');
console.log('4. Connect GitHub repository: suriekke/shopeasy2');
console.log('5. Configure the service:');
console.log(`   - Name: ${PROJECT_CONFIG.name}`);
console.log(`   - Environment: ${PROJECT_CONFIG.env}`);
console.log(`   - Build Command: ${PROJECT_CONFIG.buildCommand}`);
console.log(`   - Start Command: ${PROJECT_CONFIG.startCommand}`);
console.log(`   - Root Directory: ${PROJECT_CONFIG.rootDir}`);
console.log('6. Add Environment Variables:');
console.log('   - NODE_ENV = production');
console.log('   - PORT = 10000');
console.log('   - VITE_SUPABASE_URL = https://fgdscohjkkpluhtlruau.supabase.co');
console.log('   - VITE_SUPABASE_ANON_KEY = [your-supabase-key]');
console.log('7. Click "Create Web Service"');
console.log('8. Wait for deployment (5-10 minutes)');

console.log('\n🌐 After Deployment:');
console.log(`   - Your API will be at: https://${PROJECT_CONFIG.name}.onrender.com`);
console.log('   - Health check: /health');
console.log('   - Products: /api/products');
console.log('   - Categories: /api/categories');

console.log('\n🔍 To Monitor Deployment:');
console.log('   - Check build logs in Render dashboard');
console.log('   - Look for any error messages');
console.log('   - Test the health endpoint once deployed');

console.log('\n💡 Pro Tips:');
console.log('   - Use the free tier first (750 hours/month)');
console.log('   - Upgrade to $7/month for unlimited usage');
console.log('   - Auto-deploy is enabled for every push to main');

console.log('\n🚀 Ready to deploy! Follow the steps above to create your Render project.');
