import express from "express";
import { auth } from "../firebase-config.js";
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase-config.js";

const router = express.Router();

// User interface
const User = {
  uid: String,
  phone: String,
  name: String,
  email: String,
  isVerified: Boolean,
  isAdmin: Boolean,
  createdAt: Date,
  lastLogin: Date,
  addresses: Array,
  preferences: Object
};

// Initialize reCAPTCHA
let recaptchaVerifier = null;

const initializeRecaptcha = (containerId) => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    });
  }
  return recaptchaVerifier;
};

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { phone, containerId } = req.body;
  
  if (!phone) {
    return res.status(400).json({ 
      success: false, 
      message: "Phone number is required" 
    });
  }

  try {
    const verifier = initializeRecaptcha(containerId || 'recaptcha-container');
    const confirmationResult = await signInWithPhoneNumber(auth, `+91${phone}`, verifier);
    
    // Store confirmation result for verification
    req.session.confirmationResult = confirmationResult;
    
    console.log(`✅ OTP sent successfully to ${phone}`);
    res.json({ 
      success: true, 
      message: "OTP sent successfully" 
    });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to send OTP" 
    });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;
  
  if (!otp) {
    return res.status(400).json({ 
      success: false, 
      message: "OTP is required" 
    });
  }

  try {
    const confirmationResult = req.session.confirmationResult;
    if (!confirmationResult) {
      return res.status(400).json({ 
        success: false, 
        message: "No OTP confirmation found. Please request OTP again." 
      });
    }

    const result = await confirmationResult.confirm(otp);
    const user = result.user;

    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp()
      });
      
      const userData = {
        uid: user.uid,
        ...userDoc.data()
      };
      
      console.log(`✅ Existing user logged in: ${user.uid}`);
      res.json({ 
        success: true, 
        user: userData,
        message: "Login successful" 
      });
    } else {
      // Create new user
      const newUser = {
        phone: user.phoneNumber || '',
        name: `User_${user.phoneNumber?.slice(-4) || 'New'}`,
        isVerified: true,
        isAdmin: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        addresses: [],
        preferences: {
          notifications: true,
          emailUpdates: true,
          language: 'en',
          currency: 'INR'
        }
      };

      await setDoc(doc(db, 'users', user.uid), newUser);

      const userData = {
        uid: user.uid,
        ...newUser
      };

      console.log(`✅ New user created: ${user.uid}`);
      res.json({ 
        success: true, 
        user: userData,
        message: "Registration successful" 
      });
    }
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Invalid OTP" 
    });
  }
});

// Sign out
router.post("/signout", async (req, res) => {
  try {
    await signOut(auth);
    console.log("✅ User signed out successfully");
    res.json({ 
      success: true, 
      message: "Signed out successfully" 
    });
  } catch (error) {
    console.error("❌ Error signing out:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to sign out" 
    });
  }
});

// Get current user
router.get("/current-user", async (req, res) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return res.json({ 
        success: false, 
        user: null,
        message: "No user logged in" 
      });
    }

    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (userDoc.exists()) {
      const userData = {
        uid: currentUser.uid,
        ...userDoc.data()
      };
      
      res.json({ 
        success: true, 
        user: userData 
      });
    } else {
      res.json({ 
        success: false, 
        user: null,
        message: "User data not found" 
      });
    }
  } catch (error) {
    console.error("❌ Error getting current user:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error getting current user" 
    });
  }
});

// Get user by phone number
router.get("/user/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('phone', '==', phone));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = {
        uid: userDoc.id,
        ...userDoc.data()
      };
      
      res.json({ 
        success: true, 
        user: userData 
      });
    } else {
      res.json({ 
        success: false, 
        user: null,
        message: "User not found" 
      });
    }
  } catch (error) {
    console.error("❌ Error getting user by phone:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error getting user" 
    });
  }
});

// Update user data
router.put("/user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const updateData = req.body;
    
    await updateDoc(doc(db, 'users', uid), {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ User updated: ${uid}`);
    res.json({ 
      success: true, 
      message: "User updated successfully" 
    });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating user" 
    });
  }
});

// Get all users (admin only)
router.get("/users", async (req, res) => {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    const users = querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));
    
    res.json({ 
      success: true, 
      users,
      count: users.length 
    });
  } catch (error) {
    console.error("❌ Error getting users:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error getting users" 
    });
  }
});

// Get user statistics
router.get("/stats", async (req, res) => {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    const users = querySnapshot.docs.map(doc => doc.data());
    
    const stats = {
      totalUsers: users.length,
      verifiedUsers: users.filter(user => user.isVerified).length,
      adminUsers: users.filter(user => user.isAdmin).length,
      activeUsers: users.filter(user => user.isActive !== false).length
    };
    
    res.json({ 
      success: true, 
      stats 
    });
  } catch (error) {
    console.error("❌ Error getting stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error getting statistics" 
    });
  }
});

export default router;
