require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Frontend configuration for CORS
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000'
  },
  
  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL || 'https://fgdscohjkkpluhtlruau.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZHNjb2hqa2twbHVodGxydWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDI1MzEsImV4cCI6MjA3MjMxODUzMX0.P59uwU00Tu7WIMC85k8uoURIysBZI55g8HN9hwtK3jU',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  
  // Twilio configuration
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'my-super-secret-jwt-key-123'
  },
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL
  }
};

module.exports = config;


