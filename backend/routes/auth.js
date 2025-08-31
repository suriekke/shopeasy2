import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dbService, supabase } from "../supabaseClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from the correct path
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const router = express.Router();

// Simple OTP storage (in production, use Redis or database)
let otpStore = {};

// Send OTP - Simple local generation
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: "Phone required" });

  try {
    // Generate a simple 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[phone] = otp;
    
    console.log(`📱 OTP for ${phone}: ${otp}`);
    console.log(`📱 Current OTPs in store:`, Object.keys(otpStore));
    
    res.json({ 
      success: true, 
      message: "OTP sent successfully",
      otp: otp // Only for development - remove in production
    });
  } catch (error) {
    console.error("❌ OTP generation failed:", error.message);
    res.status(500).json({ success: false, message: "Failed to generate OTP" });
  }
});

// Verify OTP - Simple local verification
router.post("/verify-otp", async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ success: false, message: "Phone and code required" });

  try {
    console.log(`🔐 Verifying OTP for ${phone}: ${code}`);
    console.log(`🔐 Stored OTP for ${phone}: ${otpStore[phone]}`);
    
    const correctOtp = otpStore[phone];
    if (correctOtp && correctOtp === code) {
      // OTP is correct - remove it from store
      delete otpStore[phone];
      console.log(`✅ OTP verified successfully for ${phone}`);

      // Check if user exists in database
      let user = await dbService.getUserByPhone(phone);
      
      if (!user) {
        // Create new user in database
        const newUserData = {
          phone,
          name: `User_${phone.slice(-4)}`,
          is_verified: true
        };
        user = await dbService.createUser(newUserData);
        console.log(`👤 New user created in database: ${phone}`);
      } else {
        // Update user login time
        await dbService.updateUserLogin(phone);
        console.log(`👤 Existing user logged in: ${phone}`);
      }

      return res.json({ success: true, user });
    } else {
      console.log(`❌ Invalid OTP for ${phone}: ${code}`);
      return res.json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

// Get user statistics
router.get("/stats", async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, is_active, created_at');
    
    if (error) throw error;
    
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.is_active).length;
    
    res.json({ 
      success: true, 
      stats: { totalUsers, activeUsers }
    });
  } catch (error) {
    console.error("❌ Error getting stats:", error);
    res.status(500).json({ success: false, message: "Error getting statistics" });
  }
});

// Get all users (for admin purposes)
router.get("/users", async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({ success: true, users });
  } catch (error) {
    console.error("❌ Error getting users:", error);
    res.status(500).json({ success: false, message: "Error getting users" });
  }
});

export default router;
