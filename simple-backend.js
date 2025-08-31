import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

const app = express();
const PORT = process.env.PORT || 5000;

// Firebase configuration
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
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Middleware
app.use(cors({
  origin: ['http://localhost:5178', 'https://shopeasy-app-ebbfb.web.app'],
  credentials: true
}));
app.use(express.json());

// Simple OTP storage (in production, use Firestore)
let otpStore = {};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'ShopEasy Backend is running!',
    timestamp: new Date().toISOString(),
    service: 'Express + Firebase'
  });
});

// Send OTP
app.post('/auth/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number required' });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[phone] = otp;
    
    console.log(`📱 OTP for ${phone}: ${otp}`);
    
    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      otp: otp // For development only - remove in production
    });
  } catch (error) {
    console.error('❌ OTP generation failed:', error);
    res.status(500).json({ success: false, message: 'Failed to generate OTP' });
  }
});

// Verify OTP
app.post('/auth/verify-otp', async (req, res) => {
  try {
    const { phone, code } = req.body;
    
    if (!phone || !code) {
      return res.status(400).json({ success: false, message: 'Phone and OTP required' });
    }

    console.log(`🔐 Verifying OTP for ${phone}: ${code}`);
    console.log(`🔐 Stored OTP: ${otpStore[phone]}`);

    const correctOtp = otpStore[phone];
    
    if (correctOtp && correctOtp === code) {
      // OTP is correct - remove it from store
      delete otpStore[phone];
      
      // Check if user exists in Firestore
      const userRef = doc(db, 'users', phone);
      const userDoc = await getDoc(userRef);
      
      let user;
      if (!userDoc.exists()) {
        // Create new user
        user = {
          id: phone,
          phone,
          name: `User_${phone.slice(-4)}`,
          created_at: new Date(),
          is_verified: true
        };
        await setDoc(userRef, user);
        console.log(`👤 New user created: ${phone}`);
      } else {
        // Get existing user
        user = { id: phone, ...userDoc.data() };
        // Update last login
        await setDoc(userRef, {
          ...userDoc.data(),
          last_login: new Date()
        }, { merge: true });
        console.log(`👤 Existing user logged in: ${phone}`);
      }
      
      console.log(`✅ OTP verified successfully for ${phone}`);
      res.json({ success: true, user });
    } else {
      console.log(`❌ Invalid OTP for ${phone}`);
      res.json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('❌ Verification failed:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

// Get Users (for admin)
app.get('/auth/users', async (req, res) => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = [];
    
    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({ success: true, users });
  } catch (error) {
    console.error('❌ Error getting users:', error);
    res.status(500).json({ success: false, message: 'Error getting users' });
  }
});

// Get Products
app.get('/products', async (req, res) => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products = [];
    
    productsSnapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({ success: true, products });
  } catch (error) {
    console.error('❌ Error getting products:', error);
    res.status(500).json({ success: false, message: 'Error getting products' });
  }
});

// Add Product (for admin)
app.post('/products', async (req, res) => {
  try {
    const productData = req.body;
    
    if (!productData.name || !productData.price) {
      return res.status(400).json({ success: false, message: 'Product name and price required' });
    }

    const productRef = doc(collection(db, 'products'));
    await setDoc(productRef, {
      ...productData,
      created_at: new Date()
    });
    
    res.json({ success: true, productId: productRef.id });
  } catch (error) {
    console.error('❌ Error adding product:', error);
    res.status(500).json({ success: false, message: 'Error adding product' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'ShopEasy Backend API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      sendOTP: 'POST /auth/send-otp',
      verifyOTP: 'POST /auth/verify-otp',
      getUsers: 'GET /auth/users',
      getProducts: 'GET /products',
      addProduct: 'POST /products'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ShopEasy Backend running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
});
