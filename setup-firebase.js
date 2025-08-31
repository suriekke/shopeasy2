#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔥 Firebase Setup for ShopEasy');
console.log('==============================\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  console.log('📝 Creating .env file...');
  const envContent = `# Firebase Configuration
# Replace these values with your Firebase project config

REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Optional: VAPID key for push notifications
# REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key_here
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created');
}

// Check if Firebase CLI is installed
console.log('\n🔧 Checking Firebase CLI...');
try {
  await import('firebase-tools');
  console.log('✅ Firebase CLI is installed');
} catch (error) {
  console.log('❌ Firebase CLI not found');
  console.log('📦 Installing Firebase CLI...');
  console.log('Run: npm install -g firebase-tools');
}

console.log('\n📋 Next Steps:');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Create a new project named "shopeasy-app"');
console.log('3. Enable Authentication (Phone)');
console.log('4. Create Firestore Database');
console.log('5. Enable Storage');
console.log('6. Add a web app to get configuration');
console.log('7. Copy the config to your .env file');
console.log('8. Run: firebase login');
console.log('9. Run: firebase init');
console.log('10. Run: npm run build');
console.log('11. Run: firebase deploy');

console.log('\n📚 Documentation:');
console.log('- Firebase Setup: firebase-setup.md');
console.log('- Migration Guide: firebase-migration-guide.md');
console.log('- Firebase Console: https://console.firebase.google.com/');

console.log('\n🎯 Your Firebase-powered ShopEasy app is ready to be set up!');
