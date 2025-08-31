import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Add product
router.post("/", async (req, res) => {
  const { name, price, stock } = req.body;
  const { data, error } = await supabase
    .from("products")
    .insert([{ name, price, stock }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

export default router;

