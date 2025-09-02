import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// Create new order
router.post("/", async (req, res) => {
  const { user_id, items } = req.body; // items = [{product_id, quantity, price}]
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([{ user_id, total }])
    .select()
    .single();

  if (orderError) return res.status(400).json({ error: orderError.message });

  // Insert order_items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) return res.status(400).json({ error: itemsError.message });

  res.json({ message: "Order placed successfully", order });
});

// Get all orders of a user
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user_id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
