import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://fxrvemzqhoyfbsksrxzo.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key-here';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database service functions
export const dbService = {
  // User management
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByPhone(phone) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateUserLogin(phone) {
    const { data, error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('phone', phone)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Product management
  async getProducts(filters = {}) {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(name, description)
      `)
      .eq('is_active', true);

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters.featured) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getProductById(id) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name, description)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Cart management
  async getCartItems(userId) {
    const { data, error } = await supabase
      .from('cart')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async addToCart(userId, productId, quantity = 1) {
    const { data, error } = await supabase
      .from('cart')
      .upsert({
        user_id: userId,
        product_id: productId,
        quantity: quantity
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCartItem(userId, productId, quantity) {
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeFromCart(userId, productId) {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    
    if (error) throw error;
    return true;
  },

  async clearCart(userId) {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
    return true;
  },

  // Order management
  async createOrder(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getOrders(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getOrderById(orderId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(*),
        delivery_address:user_addresses(*),
        delivery_partner:delivery_partners(*)
      `)
      .eq('id', orderId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Address management
  async getUserAddresses(userId) {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async addUserAddress(addressData) {
    const { data, error } = await supabase
      .from('user_addresses')
      .insert([addressData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Wishlist management
  async getWishlist(userId) {
    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async addToWishlist(userId, productId) {
    const { data, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: userId,
        product_id: productId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeFromWishlist(userId, productId) {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    
    if (error) throw error;
    return true;
  },

  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Notifications
  async getNotifications(userId) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async markNotificationAsRead(notificationId) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export default supabase;
