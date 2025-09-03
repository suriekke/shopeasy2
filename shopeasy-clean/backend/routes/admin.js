import express from "express";
import { dbService, supabase } from "../supabaseClient.js";

const router = express.Router();

// =====================================================
// PRODUCT MANAGEMENT
// =====================================================

// Add new product
router.post("/products", async (req, res) => {
  try {
    const {
      name,
      description,
      category_id,
      price,
      original_price,
      discount_percentage,
      stock_quantity,
      unit,
      brand,
      image_urls,
      is_featured
    } = req.body;

    // Validate required fields
    if (!name || !category_id || !price || !unit) {
      return res.status(400).json({
        success: false,
        message: "Name, category, price, and unit are required"
      });
    }

    const productData = {
      name,
      description,
      category_id,
      price: parseFloat(price),
      original_price: original_price ? parseFloat(original_price) : null,
      discount_percentage: discount_percentage ? parseInt(discount_percentage) : 0,
      stock_quantity: stock_quantity ? parseInt(stock_quantity) : 0,
      unit,
      brand,
      image_urls: image_urls || [],
      is_featured: is_featured || false,
      is_active: true
    };

    const { data: product, error } = await supabase
      .from('products')
      .insert([productData])
      .select(`
        *,
        category:categories(name, description)
      `)
      .single();

    if (error) throw error;

    console.log(`✅ Product added: ${product.name}`);
    res.json({ success: true, product });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ success: false, message: "Error adding product" });
  }
});

// Update product
router.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:categories(name, description)
      `)
      .single();

    if (error) throw error;

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    console.log(`✅ Product updated: ${product.name}`);
    res.json({ success: true, product });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ success: false, message: "Error updating product" });
  }
});

// Delete product
router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    console.log(`✅ Product deleted: ${id}`);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
});

// Get all products (admin view)
router.get("/products", async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name, description)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, products });
  } catch (error) {
    console.error("❌ Error getting products:", error);
    res.status(500).json({ success: false, message: "Error getting products" });
  }
});

// =====================================================
// CATEGORY MANAGEMENT
// =====================================================

// Add new category
router.post("/categories", async (req, res) => {
  try {
    const { name, description, image_url, parent_category_id, sort_order } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }

    const categoryData = {
      name,
      description,
      image_url,
      parent_category_id,
      sort_order: sort_order || 0,
      is_active: true
    };

    const { data: category, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ Category added: ${category.name}`);
    res.json({ success: true, category });
  } catch (error) {
    console.error("❌ Error adding category:", error);
    res.status(500).json({ success: false, message: "Error adding category" });
  }
});

// Update category
router.put("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: category, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    console.log(`✅ Category updated: ${category.name}`);
    res.json({ success: true, category });
  } catch (error) {
    console.error("❌ Error updating category:", error);
    res.status(500).json({ success: false, message: "Error updating category" });
  }
});

// Get all categories (admin view)
router.get("/categories", async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;

    res.json({ success: true, categories });
  } catch (error) {
    console.error("❌ Error getting categories:", error);
    res.status(500).json({ success: false, message: "Error getting categories" });
  }
});

// =====================================================
// BULK PRODUCT UPLOAD
// =====================================================

// Bulk add products
router.post("/products/bulk", async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products array is required"
      });
    }

    // Validate each product
    for (const product of products) {
      if (!product.name || !product.category_id || !product.price || !product.unit) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name || 'unknown'} is missing required fields`
        });
      }
    }

    const { data: addedProducts, error } = await supabase
      .from('products')
      .insert(products)
      .select(`
        *,
        category:categories(name, description)
      `);

    if (error) throw error;

    console.log(`✅ ${addedProducts.length} products added successfully`);
    res.json({ success: true, products: addedProducts });
  } catch (error) {
    console.error("❌ Error adding products in bulk:", error);
    res.status(500).json({ success: false, message: "Error adding products in bulk" });
  }
});

export default router;

