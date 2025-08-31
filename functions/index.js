const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

// Simple OTP storage (in production, use Firestore)
let otpStore = {};

// Send OTP Function
exports.sendOTP = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number required' });
    }

    try {
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
});

// Verify OTP Function
exports.verifyOTP = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { phone, code } = req.body;
    
    if (!phone || !code) {
      return res.status(400).json({ success: false, message: 'Phone and OTP required' });
    }

    try {
      console.log(`🔐 Verifying OTP for ${phone}: ${code}`);
      console.log(`🔐 Stored OTP: ${otpStore[phone]}`);

      const correctOtp = otpStore[phone];
      
      if (correctOtp && correctOtp === code) {
        // OTP is correct - remove it from store
        delete otpStore[phone];
        
        // Check if user exists in Firestore
        const userRef = db.collection('users').doc(phone);
        const userDoc = await userRef.get();
        
        let user;
        if (!userDoc.exists) {
          // Create new user
          user = {
            id: phone,
            phone,
            name: `User_${phone.slice(-4)}`,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            is_verified: true
          };
          await userRef.set(user);
          console.log(`👤 New user created: ${phone}`);
        } else {
          // Get existing user
          user = { id: phone, ...userDoc.data() };
          // Update last login
          await userRef.update({
            last_login: admin.firestore.FieldValue.serverTimestamp()
          });
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
});

// Get Users Function (for admin)
exports.getUsers = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
      const usersSnapshot = await db.collection('users').get();
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
});

// Health Check Function
exports.health = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.json({ 
      status: 'healthy', 
      message: 'ShopEasy Firebase Backend is running!',
      timestamp: new Date().toISOString(),
      service: 'Firebase Cloud Functions'
    });
  });
});

// Product Management Functions
exports.getProducts = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
      const productsSnapshot = await db.collection('products').get();
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
});

// Add Product Function (for admin)
exports.addProduct = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const productData = req.body;
    
    if (!productData.name || !productData.price) {
      return res.status(400).json({ success: false, message: 'Product name and price required' });
    }

    try {
      const productRef = await db.collection('products').add({
        ...productData,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.json({ success: true, productId: productRef.id });
    } catch (error) {
      console.error('❌ Error adding product:', error);
      res.status(500).json({ success: false, message: 'Error adding product' });
    }
  });
});
