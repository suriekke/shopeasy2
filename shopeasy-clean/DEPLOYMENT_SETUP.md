# 🚀 ShopEasy Frontend-Backend Connection Setup

## The Problem
Your frontend (Vercel) and backend (Render) are not properly connected, causing login issues and communication problems.

## Complete Solution Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │   Backend       │     │   Database      │
│   (Vercel)      │ ◄──►│   (Render)      │ ◄──►│   (Supabase)    │
│   React/Vite    │     │   Node.js       │     │   PostgreSQL    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
      ▲                         ▲                         ▲
      │                         │                         │
   User Browser           Environment Variables      Direct Connection
```

## Step-by-Step Fix

### 1. Backend (Render) Environment Variables

Go to your Render dashboard → Your Backend App → Environment Variables and add:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URLs (for CORS)
FRONTEND_URL=https://your-frontend-app.vercel.app

# Supabase Configuration
SUPABASE_URL=https://fgdscohjkkpluhtlruau.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZHNjb2hqa2twbHVodGxydWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDI1MzEsImV4cCI6MjA3MjMxODUzMX0.P59uwU00Tu7WIMC85k8uoURIysBZI55g8HN9hwtK3jU
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Twilio Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_VERIFY_SERVICE_SID=your-twilio-verify-service-sid

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here
```

### 2. Frontend (Vercel) Environment Variables

Go to your Vercel dashboard → Your Frontend App → Settings → Environment Variables and add:

```env
# Backend API Configuration
VITE_API_BASE_URL=https://shopeasy-backend-tnkk.onrender.com

# Supabase Configuration
VITE_SUPABASE_URL=https://fgdscohjkkpluhtlruau.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZHNjb2hqa2twbHVodGxydWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDI1MzEsImV4cCI6MjA3MjMxODUzMX0.P59uwU00Tu7WIMC85k8uoURIysBZI55g8HN9hwtK3jU

# Twilio Configuration
VITE_TWILIO_ACCOUNT_SID=your-twilio-account-sid
VITE_TWILIO_AUTH_TOKEN=your-twilio-auth-token
VITE_TWILIO_VERIFY_SERVICE_SID=your-twilio-verify-service-sid
```

### 3. Update Your Vercel Domain

Replace `https://your-frontend-app.vercel.app` in the backend environment variables with your actual Vercel domain.

### 4. Test the Connection

#### Test Backend Health:
```bash
curl https://shopeasy-backend-tnkk.onrender.com/health
```

#### Test Frontend-Backend Connection:
```bash
curl -X POST https://shopeasy-backend-tnkk.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"+918179688221"}'
```

### 5. Deploy Changes

1. **Backend (Render)**: Push your changes to GitHub - Render will auto-deploy
2. **Frontend (Vercel)**: Push your changes to GitHub - Vercel will auto-deploy

### 6. Verify CORS is Working

Check your browser's Network tab when making requests. You should see:
- ✅ No CORS errors
- ✅ Successful API calls
- ✅ Proper response headers

## Critical Checks

- ✅ **CORS Configuration**: Backend allows frontend domain
- ✅ **Environment Variables**: Set in both Vercel and Render dashboards
- ✅ **API Consistency**: Frontend calls correct backend URLs
- ✅ **Authentication Flow**: Proper token validation
- ✅ **Database Permissions**: Supabase RLS policies configured

## Troubleshooting

### If login still doesn't work:

1. **Check Network Tab**: Look for CORS errors or failed requests
2. **Verify URLs**: Ensure frontend is calling the correct backend URL
3. **Check Environment Variables**: Verify they're set correctly in both platforms
4. **Test Backend Directly**: Use Postman or curl to test backend endpoints
5. **Check Render Logs**: Look for errors in your Render app logs

### Common Issues:

- **CORS Error**: Backend not allowing frontend domain
- **404 Error**: Wrong API endpoint or backend not running
- **500 Error**: Backend internal error - check Render logs
- **Environment Variable Not Set**: Variable not configured in deployment platform

## Success Indicators

✅ Login works on both Vercel and Render  
✅ No CORS errors in browser console  
✅ API calls succeed with proper responses  
✅ User sessions persist across page refreshes  
✅ Backend logs show successful requests  

This setup ensures your frontend and backend work together seamlessly across different hosting platforms! 🚀
