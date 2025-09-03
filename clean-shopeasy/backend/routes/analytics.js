import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// =====================================================
// LOGIN ANALYTICS
// =====================================================

// Get login statistics
router.get("/login-stats", async (req, res) => {
  try {
    // Get all users with their login data
    const { data: users, error } = await supabase
      .from('users')
      .select('id, phone, name, created_at, last_login, is_active, is_verified');
    
    if (error) throw error;

    // Calculate statistics
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.is_active).length;
    const verifiedUsers = users.filter(user => user.is_verified).length;
    
    // Users who logged in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogins = users.filter(user => {
      if (!user.last_login) return false;
      const loginDate = new Date(user.last_login);
      return loginDate >= today;
    }).length;

    // Users who logged in this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekLogins = users.filter(user => {
      if (!user.last_login) return false;
      const loginDate = new Date(user.last_login);
      return loginDate >= weekAgo;
    }).length;

    // Users who logged in this month
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthLogins = users.filter(user => {
      if (!user.last_login) return false;
      const loginDate = new Date(user.last_login);
      return loginDate >= monthAgo;
    }).length;

    // Recent registrations
    const recentRegistrations = users.filter(user => {
      const createdDate = new Date(user.created_at);
      return createdDate >= weekAgo;
    }).length;

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        verifiedUsers,
        todayLogins,
        weekLogins,
        monthLogins,
        recentRegistrations
      }
    });
  } catch (error) {
    console.error("❌ Error getting login stats:", error);
    res.status(500).json({ success: false, message: "Error getting login statistics" });
  }
});

// Get detailed user login history
router.get("/user-logins", async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, phone, name, created_at, last_login, is_active, is_verified')
      .order('last_login', { ascending: false });
    
    if (error) throw error;

    // Add additional info to each user
    const usersWithDetails = users.map(user => {
      const lastLoginDate = user.last_login ? new Date(user.last_login) : null;
      const createdDate = new Date(user.created_at);
      
      return {
        ...user,
        daysSinceLastLogin: lastLoginDate ? Math.floor((new Date() - lastLoginDate) / (1000 * 60 * 60 * 24)) : null,
        daysSinceRegistration: Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24)),
        loginStatus: user.last_login ? 'Active' : 'Never Logged In'
      };
    });

    res.json({
      success: true,
      users: usersWithDetails
    });
  } catch (error) {
    console.error("❌ Error getting user logins:", error);
    res.status(500).json({ success: false, message: "Error getting user login history" });
  }
});

// Get login trends (daily/weekly/monthly)
router.get("/login-trends", async (req, res) => {
  try {
    const { period = 'week' } = req.query; // week, month, year
    
    const { data: users, error } = await supabase
      .from('users')
      .select('created_at, last_login');
    
    if (error) throw error;

    let days = 7;
    if (period === 'month') days = 30;
    if (period === 'year') days = 365;

    const trends = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      // Count registrations on this date
      const registrations = users.filter(user => {
        const createdDate = new Date(user.created_at);
        return createdDate >= date && createdDate < nextDate;
      }).length;

      // Count logins on this date
      const logins = users.filter(user => {
        if (!user.last_login) return false;
        const loginDate = new Date(user.last_login);
        return loginDate >= date && loginDate < nextDate;
      }).length;

      trends.push({
        date: date.toISOString().split('T')[0],
        registrations,
        logins
      });
    }

    res.json({
      success: true,
      period,
      trends
    });
  } catch (error) {
    console.error("❌ Error getting login trends:", error);
    res.status(500).json({ success: false, message: "Error getting login trends" });
  }
});

// Get failed login attempts (from OTP verification logs)
router.get("/failed-attempts", async (req, res) => {
  try {
    // Since we don't have a separate table for failed attempts,
    // we'll create a simple endpoint that can be enhanced later
    // For now, we'll return basic stats about verification attempts
    
    const { data: users, error } = await supabase
      .from('users')
      .select('id, phone, name, created_at, last_login, is_verified');
    
    if (error) throw error;

    // Calculate some basic metrics
    const totalUsers = users.length;
    const verifiedUsers = users.filter(user => user.is_verified).length;
    const unverifiedUsers = totalUsers - verifiedUsers;
    
    // Users who registered but never logged in
    const neverLoggedIn = users.filter(user => !user.last_login).length;

    res.json({
      success: true,
      failedAttempts: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers,
        neverLoggedIn,
        verificationRate: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error("❌ Error getting failed attempts:", error);
    res.status(500).json({ success: false, message: "Error getting failed attempts" });
  }
});

// Get real-time login activity
router.get("/recent-activity", async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, phone, name, created_at, last_login')
      .order('last_login', { ascending: false })
      .limit(10);
    
    if (error) throw error;

    const recentActivity = users
      .filter(user => user.last_login)
      .map(user => ({
        id: user.id,
        phone: user.phone,
        name: user.name,
        lastLogin: user.last_login,
        timeAgo: getTimeAgo(new Date(user.last_login))
      }));

    res.json({
      success: true,
      recentActivity
    });
  } catch (error) {
    console.error("❌ Error getting recent activity:", error);
    res.status(500).json({ success: false, message: "Error getting recent activity" });
  }
});

// Helper function to get time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

export default router;

