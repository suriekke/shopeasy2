const { supabase } = require('../config/supabase');

// Middleware to verify JWT token and user role
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    // Add user info to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};

// Middleware to check if user has admin role
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Check user role in database
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !userData) {
      return res.status(403).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (userData.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authorization check failed' 
    });
  }
};

// Middleware to check if user owns the resource
const requireOwnership = (resourceTable, resourceIdField = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }

      const resourceId = req.params[resourceIdField];
      
      // Check if user owns the resource
      const { data: resource, error } = await supabase
        .from(resourceTable)
        .select('user_id')
        .eq(resourceIdField, resourceId)
        .single();

      if (error || !resource) {
        return res.status(404).json({ 
          success: false, 
          message: 'Resource not found' 
        });
      }

      if (resource.user_id !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied to this resource' 
        });
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Authorization check failed' 
      });
    }
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireOwnership
};

