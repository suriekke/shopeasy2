const https = require('https');
const fs = require('fs');
const path = require('path');

// Render deployment configuration
const RENDER_CONFIG = {
  name: 'shopeasy-backend',
  serviceType: 'web',
  env: 'node',
  plan: 'starter',
  buildCommand: 'npm install',
  startCommand: 'npm start',
  healthCheckPath: '/health',
  autoDeploy: true
};

// Environment variables for Render
const ENV_VARS = {
  NODE_ENV: 'production',
  PORT: '10000',
  VITE_SUPABASE_URL: 'https://fgdscohjkkpluhtlruau.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZHNjb2hqa2twbHVodGxydWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDI1MzEsImV4cCI6MjA3MjMxODUzMX0.P59uwU00Tu7WIMC85k8uoURIysBZI55g8HN9hwtK3jU'
};

console.log('🚀 Starting ShopEasy Backend Deployment to Render...\n');

// Create render.yaml file
const renderYaml = `services:
  - type: web
    name: ${RENDER_CONFIG.name}
    env: ${RENDER_CONFIG.env}
    plan: ${RENDER_CONFIG.plan}
    buildCommand: ${RENDER_CONFIG.buildCommand}
    startCommand: ${RENDER_CONFIG.startCommand}
    healthCheckPath: ${RENDER_CONFIG.healthCheckPath}
    autoDeploy: ${RENDER_CONFIG.autoDeploy}
    envVars:
${Object.entries(ENV_VARS).map(([key, value]) => `      - key: ${key}\n        value: ${value}`).join('\n')}
`;

// Write render.yaml to backend directory
const backendPath = path.join(__dirname, 'backend');
const renderYamlPath = path.join(backendPath, 'render.yaml');

try {
  fs.writeFileSync(renderYamlPath, renderYaml);
  console.log('✅ Created render.yaml configuration');
} catch (error) {
  console.error('❌ Error creating render.yaml:', error.message);
  process.exit(1);
}

// Create deployment instructions
const deploymentInstructions = `
🎯 DEPLOYMENT INSTRUCTIONS FOR RENDER:

1. Go to https://render.com and sign in with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: suriekke/shopeasy2
4. Render will automatically detect the render.yaml file
5. Click "Create Web Service"
6. Wait for deployment to complete

🌐 Your API will be available at:
   https://${RENDER_CONFIG.name}.onrender.com

📋 Service Details:
   - Name: ${RENDER_CONFIG.name}
   - Environment: ${RENDER_CONFIG.env}
   - Plan: ${RENDER_CONFIG.plan}
   - Health Check: /health
   - Auto-deploy: Enabled

🔧 Environment Variables:
${Object.entries(ENV_VARS).map(([key, value]) => `   - ${key}: ${value}`).join('\n')}

⏱️ Deployment Time: 5-10 minutes
🔄 Auto-deploy: Every push to main branch

🎉 After deployment, test with:
   curl https://${RENDER_CONFIG.name}.onrender.com/health
`;

console.log(deploymentInstructions);

// Create a simple deployment status checker
const checkDeploymentStatus = () => {
  console.log('\n🔍 To check deployment status:');
  console.log('1. Visit your Render dashboard');
  console.log('2. Look for the "shopeasy-backend" service');
  console.log('3. Check build logs for any errors');
  console.log('4. Test the health endpoint once deployed');
};

checkDeploymentStatus();

console.log('\n🚀 Deployment configuration complete!');
console.log('📁 render.yaml created in backend/ directory');
console.log('🌐 Follow the instructions above to deploy on Render');
console.log('💡 The deployment will start automatically once you create the service');

