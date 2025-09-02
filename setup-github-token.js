const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔑 Setting up GitHub Personal Access Token Authentication\n');

console.log('📋 **STEP 1: Generate Personal Access Token**');
console.log('===============================================');
console.log('1. Go to: https://github.com/settings/tokens');
console.log('2. Click "Generate new token (classic)"');
console.log('3. Note: ShopEasy Render Deploy');
console.log('4. Expiration: 90 days');
console.log('5. Select scopes: repo, workflow');
console.log('6. Click "Generate token"');
console.log('7. COPY THE TOKEN (you won\'t see it again!)');

console.log('\n📝 **STEP 2: Configure Git with Token**');
console.log('=========================================');
console.log('Once you have your token, run these commands:');
console.log('');

// Check if we have a remote configured
try {
  const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
  console.log('✅ Remote origin found:', remoteUrl);
  
  if (remoteUrl.includes('https://')) {
    console.log('\n🔧 **Your repository is using HTTPS (Perfect for token auth)**');
    console.log('To authenticate, use your token as the password:');
    console.log('Username: your-github-username');
    console.log('Password: [your-personal-access-token]');
  } else {
    console.log('\n🔧 **Your repository is using SSH**');
    console.log('You may need to switch to HTTPS for token authentication');
  }
} catch (error) {
  console.log('❌ No remote origin found');
  console.log('You need to add a remote first');
}

console.log('\n🚀 **STEP 3: Push to GitHub**');
console.log('================================');
console.log('After authentication, push your code:');
console.log('git add .');
console.log('git commit -m "Setup Render deployment"');
console.log('git push origin main');

console.log('\n🌐 **STEP 4: Deploy to Render**');
console.log('==================================');
console.log('1. Go to https://render.com');
console.log('2. Sign in with GitHub');
console.log('3. Click "New +" → "Web Service"');
console.log('4. Connect to your GitHub repository');
console.log('5. Render will auto-detect render.yaml');
console.log('6. Click "Create Web Service"');

console.log('\n💡 **Pro Tips:**');
console.log('- Save your token somewhere safe');
console.log('- Token expires in 90 days');
console.log('- You can regenerate tokens anytime');
console.log('- Use HTTPS URLs for easier token auth');

console.log('\n🎯 **Ready to proceed?**');
console.log('1. Generate your Personal Access Token');
console.log('2. Tell me when you have it');
console.log('3. I\'ll help you configure git and push to GitHub');
console.log('4. Then we\'ll deploy to Render automatically!');

console.log('\n🔐 **Security Note:**');
console.log('Personal Access Tokens are like passwords - keep them secure!');
console.log('Never share them or commit them to your code.');
