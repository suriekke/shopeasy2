const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Initialize Supabase client
const config = require('../config');
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

// POST /api/auth/login - User login with phone number
router.post('/login', async (req, res) => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('phone_number', phone_number)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Check User Error:', checkError);
      return res.status(500).json({ error: checkError.message });
    }

    if (existingUser) {
      // User exists, return user data
      res.json({
        success: true,
        data: existingUser,
        message: 'Login successful'
      });
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('user_profiles')
        .insert([{ phone_number }])
        .select()
        .single();

      if (createError) {
        console.error('Create User Error:', createError);
        return res.status(500).json({ error: createError.message });
      }

      res.status(201).json({
        success: true,
        data: newUser,
        message: 'User created successfully'
      });
    }

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/profile/:id - Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Get Profile Error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/auth/profile/:id - Update user profile
router.put('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Update Profile Error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: data[0],
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/orders/:user_id - Get user orders
router.get('/orders/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(*)
        )
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get Orders Error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      data: data,
      count: data.length
    });

  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
