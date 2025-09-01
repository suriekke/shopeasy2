// Environment configuration
export const config = {
  // Firebase Configuration
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
  },
  
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "your-supabase-anon-key"
  },
  
  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || "ShopEasy",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
    environment: import.meta.env.MODE || "development",
    isProduction: import.meta.env.PROD || false
  },

  // Vercel Configuration
  vercel: {
    url: import.meta.env.VITE_VERCEL_URL || null,
    environment: import.meta.env.VERCEL_ENV || "development"
  }
}

// Helper function to get the current domain
export const getCurrentDomain = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return config.vercel.url ? `https://${config.vercel.url}` : 'http://localhost:3000'
}

// Helper function to check if running on Vercel
export const isVercel = (): boolean => {
  return !!config.vercel.url || config.vercel.environment !== 'development'
}
