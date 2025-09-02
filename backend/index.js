import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import firebaseAuthRoutes from "./routes/firebase-auth.js";
import productRoutes from "./routes/products.js";
import adminRoutes from "./routes/admin.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes); // Keep existing Twilio auth for backward compatibility
app.use("/firebase-auth", firebaseAuthRoutes); // New Firebase auth
app.use("/products", productRoutes);
app.use("/admin", adminRoutes);
app.use("/analytics", analyticsRoutes);

app.get("/", (req, res) => res.send("ShopEasy Backend is running..."));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    service: "ShopEasy Backend"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ ShopEasy Backend running on port ${PORT}`));
