import axios from 'axios';

const API_BASE = 'http://localhost:5000';

async function testAnalytics() {
  console.log('🧪 Testing Analytics API...\n');

  try {
    // Test login stats
    console.log('1. Testing Login Stats...');
    const statsResponse = await axios.get(`${API_BASE}/analytics/login-stats`);
    console.log('✅ Login Stats:', statsResponse.data.stats);
    console.log('');

    // Test user logins
    console.log('2. Testing User Logins...');
    const usersResponse = await axios.get(`${API_BASE}/analytics/user-logins`);
    console.log(`✅ User Logins: ${usersResponse.data.users.length} users found`);
    if (usersResponse.data.users.length > 0) {
      console.log('Sample user:', usersResponse.data.users[0]);
    }
    console.log('');

    // Test login trends
    console.log('3. Testing Login Trends...');
    const trendsResponse = await axios.get(`${API_BASE}/analytics/login-trends?period=week`);
    console.log(`✅ Login Trends: ${trendsResponse.data.trends.length} days of data`);
    console.log('');

    // Test failed attempts
    console.log('4. Testing Failed Attempts...');
    const failedResponse = await axios.get(`${API_BASE}/analytics/failed-attempts`);
    console.log('✅ Failed Attempts:', failedResponse.data.failedAttempts);
    console.log('');

    // Test recent activity
    console.log('5. Testing Recent Activity...');
    const activityResponse = await axios.get(`${API_BASE}/analytics/recent-activity`);
    console.log(`✅ Recent Activity: ${activityResponse.data.recentActivity.length} recent logins`);
    console.log('');

    console.log('🎉 All analytics endpoints working correctly!');

  } catch (error) {
    console.error('❌ Error testing analytics:', error.response?.data || error.message);
  }
}

testAnalytics();

