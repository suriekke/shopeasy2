require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  supabase: {
    url: process.env.VITE_SUPABASE_URL || 'https://fgdscohjkkpluhtlruau.supabase.co',
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZHNjb2hqa2twbHVodGxydWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDI1MzEsImV4cCI6MjA3MjMxODUzMX0.P59uwU00Tu7WIMC85k8uoURIysBZI55g8HN9hwtK3jU'
  },
  nodeEnv: process.env.NODE_ENV || 'development'
};

module.exports = config;

