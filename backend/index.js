import express from "express";
import cors from "cors";

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5178', 'https://shopeasy-app-ebbfb.web.app'],
  credentials: true
}));

app.use(express.json());

// Simple OTP storage
let otpStore = {};

// Simple user storage
let users = [];

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    message: "ShopEasy Backend is running!",
    timestamp: new Date().toISOString()
  });
});

// Send OTP
app.post("/auth/send-otp", (req, res) => {
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone number required" });
  }

  // Generate 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[phone] = otp;
  
  console.log(`📱 OTP for ${phone}: ${otp}`);
  console.log(`📱 All OTPs:`, otpStore);
  
  res.json({ 
    success: true, 
    message: "OTP sent successfully",
    otp: otp // For development only
  });
});

// Verify OTP
app.post("/auth/verify-otp", (req, res) => {
  const { phone, code } = req.body;
  
  if (!phone || !code) {
    return res.status(400).json({ success: false, message: "Phone and OTP required" });
  }

  console.log(`🔐 Verifying OTP for ${phone}: ${code}`);
  console.log(`🔐 Stored OTP: ${otpStore[phone]}`);

  const correctOtp = otpStore[phone];
  
  if (correctOtp && correctOtp === code) {
    // OTP is correct
    delete otpStore[phone]; // Remove used OTP
    
    // Find or create user
    let user = users.find(u => u.phone === phone);
    if (!user) {
      user = {
        id: Date.now().toString(),
        phone,
        name: `User_${phone.slice(-4)}`,
        created_at: new Date().toISOString()
      };
      users.push(user);
      console.log(`👤 New user created: ${phone}`);
    } else {
      console.log(`👤 Existing user logged in: ${phone}`);
    }
    
    console.log(`✅ OTP verified successfully for ${phone}`);
    res.json({ success: true, user });
  } else {
    console.log(`❌ Invalid OTP for ${phone}`);
    res.json({ success: false, message: "Invalid OTP" });
  }
});

// Get users (for admin)
app.get("/auth/users", (req, res) => {
  res.json({ success: true, users });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "ShopEasy Backend is running!",
    endpoints: {
      health: "/health",
      sendOtp: "POST /auth/send-otp",
      verifyOtp: "POST /auth/verify-otp",
      users: "GET /auth/users"
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 ShopEasy Backend running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`📱 Send OTP: POST http://localhost:${PORT}/auth/send-otp`);
  console.log(`🔐 Verify OTP: POST http://localhost:${PORT}/auth/verify-otp`);
});
