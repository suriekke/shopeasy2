import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration for ShopEasy Admin Dashboard
const firebaseConfig = {
  apiKey: "AIzaSyDn1g7GEbL9zxqRevrdRCCiNkFEd7K52TY",
  authDomain: "shopeasy-app-ebbfb.firebaseapp.com",
  projectId: "shopeasy-app-ebbfb",
  storageBucket: "shopeasy-app-ebbfb.firebasestorage.app",
  messagingSenderId: "974020452029",
  appId: "1:974020452029:web:aff9f28c33412e43f961d4",
  measurementId: "G-MDGNM8CWN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;





