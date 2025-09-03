# 🚀 Render Deployment Checklist for ShopEasy

## ✅ **Step-by-Step Deployment**

### **1. Go to Render Dashboard**
- Visit: https://render.com
- Sign in with your GitHub account
- You should see your GitHub repositories

### **2. Create New Web Service**
- Click **"New +"** button
- Select **"Web Service"**
- Connect to GitHub repository: **suriekke/shopeasy2**

### **3. Configure Service Settings**
```
Name: shopeasy-backend
Environment: Node
Build Command: npm install
Start Command: npm start
Root Directory: backend
Plan: Free (750 hours/month)
```

### **4. Add Environment Variables**
```
NODE_ENV = production
PORT = 10000
VITE_SUPABASE_URL = https://fgdscohjkkpluhtlruau.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZHNjb2hqa2twbHVodGxydWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDI1MzEsImV4cCI6MjA3MjMxODUzMX0.P59uwU00Tu7WIMC85k8uoURIysBZI55g8HN9hwtK3jU
```

### **5. Deploy**
- Click **"Create Web Service"**
- Wait for build to complete (5-10 minutes)
- Monitor build logs for any errors

### **6. Test Deployment**
- Health Check: `https://shopeasy-backend.onrender.com/health`
- Products API: `https://shopeasy-backend.onrender.com/api/products`
- Categories API: `https://shopeasy-backend.onrender.com/api/categories`

## 🔍 **Troubleshooting**

### **Build Fails?**
- Check if all dependencies are in `package.json`
- Verify Node.js version (18+)
- Check build logs for specific errors

### **Service Won't Start?**
- Verify PORT environment variable
- Check if Supabase credentials are correct
- Look at runtime logs

### **API Endpoints Not Working?**
- Ensure server.js has correct routes
- Check CORS configuration
- Verify database connection

## 🌟 **Success Indicators**
- ✅ Build completes without errors
- ✅ Service shows "Live" status
- ✅ Health endpoint returns `{"status":"OK"}`
- ✅ Products endpoint returns data
- ✅ Admin dashboard can connect

## 🔄 **Auto-Deploy Setup**
- Every push to `main` branch triggers deployment
- No manual intervention needed
- Rollback available in dashboard

## 💰 **Pricing**
- **Free**: 750 hours/month (good for development)
- **Starter**: $7/month (unlimited, recommended for production)
- **Standard**: $25/month (better performance)

---

**Ready to deploy? Follow the steps above! 🚀**

