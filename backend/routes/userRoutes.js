import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET all users (admin/testing)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// POST - Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User signed up successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// POST - Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

export default router;

