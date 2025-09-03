# 🛍️ ShopEasy - Complete E-commerce Solution

## 🚀 Quick Start

### Frontend-Backend Connection Setup

**IMPORTANT**: Your frontend (Vercel) and backend (Render) need proper configuration to work together.

📖 **Complete Setup Guide**: [DEPLOYMENT_SETUP.md](./DEPLOYMENT_SETUP.md)

### Quick Fix Steps:

1. **Set Backend Environment Variables** (Render Dashboard):
   ```env
   FRONTEND_URL=https://your-frontend-app.vercel.app
   SUPABASE_URL=https://fgdscohjkkpluhtlruau.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Set Frontend Environment Variables** (Vercel Dashboard):
   ```env
   VITE_API_BASE_URL=https://shopeasy-backend-tnkk.onrender.com
   VITE_SUPABASE_URL=https://fgdscohjkkpluhtlruau.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Test Connection**:
   ```bash
   node test-connection.js
   ```

## 🏗️ Project Structure

```
shopeasy-clean/
├── backend/                 # Node.js API (Render)
├── customer-app/            # React Frontend (Vercel)
├── admin-dashboard/         # Admin Panel
├── DEPLOYMENT_SETUP.md      # Complete setup guide
└── test-connection.js       # Connection test script
```

## 🔧 Current Status

- ✅ **Backend**: Running on Render with proper CORS
- ✅ **Frontend**: Configured for Vercel deployment
- ✅ **Database**: Supabase PostgreSQL
- ✅ **Authentication**: Phone OTP via Twilio
- ⚠️ **Connection**: Needs environment variables setup

## 🚨 Common Issues

- **Login not working**: Check environment variables in both platforms
- **CORS errors**: Verify frontend URL in backend CORS config
- **API calls failing**: Ensure `VITE_API_BASE_URL` is set correctly

## 📚 Documentation

- [Deployment Setup](./DEPLOYMENT_SETUP.md) - Complete connection guide
- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Technical overview
- [Supabase Setup](./SUPABASE_SETUP.md) - Database configuration

## 🆘 Need Help?

1. Check [DEPLOYMENT_SETUP.md](./DEPLOYMENT_SETUP.md)
2. Run `node test-connection.js` to diagnose issues
3. Verify environment variables in both Vercel and Render dashboards

---

**Remember**: Frontend and backend must be properly connected for login to work! 🔗
