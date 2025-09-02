const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing Direct Render Deployment (No GitHub Required)...\n');

// Create deployment package
const createDeploymentPackage = () => {
  const backendPath = path.join(__dirname, 'backend');
  const deployPath = path.join(__dirname, 'render-deployment-package');
  
  // Create deployment directory
  if (!fs.existsSync(deployPath)) {
    fs.mkdirSync(deployPath, { recursive: true });
  }
  
  // Copy backend files
  const filesToCopy = [
    'package.json',
    'package-lock.json',
    'server.js',
    'config.js',
    'routes',
    'middleware'
  ];
  
  filesToCopy.forEach(file => {
    const sourcePath = path.join(backendPath, file);
    const destPath = path.join(deployPath, file);
    
    if (fs.existsSync(sourcePath)) {
      if (fs.lstatSync(sourcePath).isDirectory()) {
        // Copy directory recursively
        copyDirectory(sourcePath, destPath);
      } else {
        // Copy file
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  });
  
  // Create render.yaml for manual deployment
  const renderYaml = `services:
  - type: web
    name: shopeasy-backend
    env: node
    plan: starter
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: VITE_SUPABASE_URL
        value: https://fgdscohjkkpluhtlruau.supabase.co
      - key: VITE_SUPABASE_ANON_KEY
        value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZHNjb2hqa2twbHVodGxydWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDI1MzEsImV4cCI6MjA3MjMxODUzMX0.P59uwU00Tu7WIMC85k8uoURIysBZI55g8HN9hwtK3jU
    healthCheckPath: /health
    autoDeploy: false`;
  
  fs.writeFileSync(path.join(deployPath, 'render.yaml'), renderYaml);
  
  // Create deployment instructions
  const instructions = `# 🚀 Direct Render Deployment (No GitHub Required)

## 📦 **What's in this package:**
- Complete backend code
- Dependencies (package.json)
- Render configuration (render.yaml)
- All routes and middleware

## 🎯 **Deployment Steps:**

### **1. Go to Render Dashboard**
- Visit: https://render.com
- Sign in with your email (no GitHub needed)

### **2. Create New Web Service**
- Click "New +" → "Web Service"
- Choose "Deploy from existing codebase"
- Upload this entire folder as a ZIP file

### **3. Configure Service**
- Name: shopeasy-backend
- Environment: Node
- Build Command: npm install
- Start Command: npm start
- Root Directory: (leave empty - it's the root)

### **4. Environment Variables (Copy exactly):**
\`\`\`
NODE_ENV = production
PORT = 10000
VITE_SUPABASE_URL = https://fgdscohjkkpluhtlruau.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZHNjb2hqa2twbHVodGxydWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDI1MzEsImV4cCI6MjA3MjMxODUzMX0.P59uwU00Tu7WIMC85k8uoURIysBZI55g8HN9hwtK3jU
\`\`\`

### **5. Deploy**
- Click "Create Web Service"
- Wait 5-10 minutes for build
- Monitor logs for any errors

## 🌐 **After Deployment:**
- API: https://shopeasy-backend.onrender.com
- Health: https://shopeasy-backend.onrender.com/health
- Products: https://shopeasy-backend.onrender.com/api/products

## 💡 **Benefits of this method:**
- ✅ No GitHub authentication required
- ✅ No mobile phone needed
- ✅ Direct code upload
- ✅ Same result as GitHub deployment
- ✅ Full control over deployment

## 🔍 **Troubleshooting:**
- If build fails, check the logs
- Ensure all environment variables are set
- Verify Node.js version compatibility

---
**Ready to deploy! 🚀**`;

  fs.writeFileSync(path.join(deployPath, 'DEPLOYMENT_INSTRUCTIONS.md'), instructions);
  
  console.log('✅ Deployment package created successfully!');
  console.log(`📁 Location: ${deployPath}`);
  console.log('📋 Files included:');
  
  const files = fs.readdirSync(deployPath);
  files.forEach(file => {
    const stats = fs.statSync(path.join(deployPath, file));
    if (stats.isDirectory()) {
      console.log(`   📁 ${file}/`);
    } else {
      console.log(`   📄 ${file}`);
    }
  });
  
  return deployPath;
};

// Helper function to copy directories
const copyDirectory = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
};

// Create the package
const packagePath = createDeploymentPackage();

console.log('\n🎯 **NEXT STEPS:**');
console.log('=====================================');
console.log('1. Go to the deployment package folder:');
console.log(`   ${packagePath}`);
console.log('2. Select all files and create a ZIP archive');
console.log('3. Go to https://render.com');
console.log('4. Sign in with your email (no GitHub needed)');
console.log('5. Upload the ZIP file and follow instructions');
console.log('\n📖 Read DEPLOYMENT_INSTRUCTIONS.md for detailed steps');
console.log('\n🚀 Your backend will be live in 10 minutes!');
