// Firebase Configuration for ShopEasy App
export const firebaseConfig = {
  apiKey: "AIzaSyDn1g7GEbL9zxqRevrdRCCiNkFEd7K52TY",
  authDomain: "shopeasy-app-ebbfb.firebaseapp.com",
  projectId: "shopeasy-app-ebbfb",
  storageBucket: "shopeasy-app-ebbfb.firebasestorage.app",
  messagingSenderId: "974020452029",
  appId: "1:974020452029:web:aff9f28c33412e43f961d4",
  measurementId: "G-MDGNM8CWN8"
};

// Environment variables for the app
export const envConfig = {
  // Firebase Configuration
  REACT_APP_FIREBASE_API_KEY: "AIzaSyDn1g7GEbL9zxqRevrdRCCiNkFEd7K52TY",
  REACT_APP_FIREBASE_AUTH_DOMAIN: "shopeasy-app-ebbfb.firebaseapp.com",
  REACT_APP_FIREBASE_PROJECT_ID: "shopeasy-app-ebbfb",
  REACT_APP_FIREBASE_STORAGE_BUCKET: "shopeasy-app-ebbfb.firebasestorage.app",
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: "974020452029",
  REACT_APP_FIREBASE_APP_ID: "1:974020452029:web:aff9f28c33412e43f961d4",
  REACT_APP_FIREBASE_MEASUREMENT_ID: "G-MDGNM8CWN8",
  
  // Backend Configuration
  PORT: "5000",
  
  // Twilio Configuration (for fallback OTP)
  TWILIO_ACCOUNT_SID: "your_twilio_account_sid",
  TWILIO_AUTH_TOKEN: "your_twilio_auth_token",
  TWILIO_SERVICE_SID: "your_twilio_service_sid",
  
  // Supabase Configuration (for migration period)
  SUPABASE_URL: "https://fxrvemzqhoyfbsksrxzo.supabase.co",
  SUPABASE_ANON_KEY: "your_supabase_anon_key"
};

