import express from "express";
import { dbService } from "../supabaseClient.js";

const router = express.Router();

// Get all products with optional filters
router.get("/", async (req, res) => {
  try {
    const { category_id, featured, search } = req.query;
    const filters = {};
    
    if (category_id) filters.category_id = category_id;
    if (featured === 'true') filters.featured = true;
    
    let products = await dbService.getProducts(filters);
    
    // Apply search filter if provided
    if (search) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json({ success: true, products });
  } catch (error) {
    console.error("❌ Error getting products:", error);
    res.status(500).json({ success: false, message: "Error getting products" });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await dbService.getProductById(id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error("❌ Error getting product:", error);
    res.status(500).json({ success: false, message: "Error getting product" });
  }
});

// Get categories
router.get("/categories/all", async (req, res) => {
  try {
    const categories = await dbService.getCategories();
    res.json({ success: true, categories });
  } catch (error) {
    console.error("❌ Error getting categories:", error);
    res.status(500).json({ success: false, message: "Error getting categories" });
  }
});

export default router;

