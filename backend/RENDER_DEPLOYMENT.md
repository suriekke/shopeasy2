# 🚀 ShopEasy Backend - Render Deployment Guide

## 📋 **Prerequisites**
1. Render account (free tier available)
2. GitHub repository connected
3. Node.js 18+ project

## 🔧 **Deployment Steps**

### **Step 1: Connect GitHub to Render**
1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository

### **Step 2: Configure Web Service**
- **Name**: `shopeasy-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Starter` (Free tier)

### **Step 3: Environment Variables**
Add these in Render dashboard:
```
NODE_ENV=production
PORT=10000
VITE_SUPABASE_URL=https://fgdscohjkkpluhtlruau.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZHNjb2hqa2twbHVodGxydWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDI1MzEsImV4cCI6MjA3MjMxODUzMX0.P59uwU00Tu7WIMC85k8uoURIysBZI55g8HN9hwtK3jU
```

### **Step 4: Deploy**
1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Wait for deployment to complete
4. Your API will be available at: `https://your-app-name.onrender.com`

## 🌐 **API Endpoints**
Once deployed, your API will have these endpoints:
- **Health Check**: `GET /health`
- **Products**: `GET/POST /api/products`
- **Categories**: `GET/POST /api/categories`
- **Cart**: `GET/POST/PUT/DELETE /api/cart`
- **Auth**: `POST /api/auth/login`, `POST /api/auth/verify-otp`

## 🔄 **Auto-Deploy**
- Every push to main branch triggers automatic deployment
- No manual intervention needed
- Rollback available in Render dashboard

## 📊 **Monitoring**
- Built-in logs and metrics
- Health check monitoring
- Performance analytics

## 💰 **Pricing**
- **Free Tier**: 750 hours/month
- **Starter**: $7/month (unlimited)
- **Standard**: $25/month (better performance)

## 🚨 **Troubleshooting**
- Check build logs in Render dashboard
- Verify environment variables
- Ensure PORT is set correctly
- Check Supabase connection

## 🔗 **Next Steps**
After deployment, update your frontend apps to use the new Render URL!

