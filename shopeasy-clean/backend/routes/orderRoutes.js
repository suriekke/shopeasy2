import express from "express";
import { supabase } from "../supabaseClient.js";
import { authenticateToken, requireAdmin, requireOwnership } from "../middleware/auth.js";

const router = express.Router();

// Create new order (Authenticated users only)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { items } = req.body; // items = [{product_id, quantity, price}]
    const user_id = req.user.id; // Get user ID from authenticated token
    
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Order items are required" 
      });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{ 
        user_id, 
        total,
        status: 'pending',
        order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return res.status(400).json({ 
        success: false, 
        message: orderError.message 
      });
    }

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

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      return res.status(400).json({ 
        success: false, 
        message: itemsError.message 
      });
    }

    res.status(201).json({ 
      success: true,
      message: "Order placed successfully", 
      data: order 
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create order" 
    });
  }
});

// Get all orders of a user (User can only see their own orders)
router.get("/user/:user_id", authenticateToken, requireOwnership('orders', 'user_id'), async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items(
          *,
          products(name, image_url, price)
        )
      `)
      .eq("user_id", user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch orders error:', error);
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch orders" 
    });
  }
});

// Get all orders (Admin only)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items(
          *,
          products(name, image_url, price)
        ),
        users(phone, role)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch all orders error:', error);
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Fetch all orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch orders" 
    });
  }
});

// Update order status (Admin only)
router.patch("/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status. Must be one of: " + validStatuses.join(', ') 
      });
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error('Update order status error:', error);
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: data
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update order status" 
    });
  }
});

// Get single order by ID (User can only see their own orders, Admin can see all)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user_id)
      .single();

    const isAdmin = userData?.role === 'admin';

    let query = supabase
      .from("orders")
      .select(`
        *,
        order_items(
          *,
          products(name, image_url, price)
        )
      `)
      .eq("id", id);

    // If not admin, only show user's own orders
    if (!isAdmin) {
      query = query.eq("user_id", user_id);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error('Fetch order error:', error);
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch order" 
    });
  }
});

export default router;
