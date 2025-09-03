# 🚀 Supabase + Vercel Setup Guide

## 📋 **Complete Setup Instructions**

### **Step 1: Create Supabase Project**

1. **Go to [Supabase](https://supabase.com)**
2. **Sign up/Login** with your GitHub account
3. **Create New Project**
   - Project name: `shopeasy-db`
   - Database password: `your-secure-password`
   - Region: Choose closest to your users
4. **Wait for setup** (2-3 minutes)

### **Step 2: Get Supabase Credentials**

1. **Go to Settings → API**
2. **Copy these values:**
   ```
   Project URL: https://your-project-id.supabase.co
   Anon Key: your-anon-key
   Service Role Key: your-service-role-key
   ```

### **Step 3: Set Up Database Schema**

1. **Go to SQL Editor** in Supabase Dashboard
2. **Copy and paste** the entire content from `supabase-schema.sql`
3. **Run the script** to create all tables and policies

### **Step 4: Configure Authentication**

1. **Go to Authentication → Settings**
2. **Enable Email Auth**
3. **Configure Site URL:** `https://shopeasy2.vercel.app`
4. **Add Redirect URLs:**
   ```
   https://shopeasy2.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```

### **Step 5: Set Up Storage**

1. **Go to Storage** in Supabase Dashboard
2. **Create bucket:** `uploads`
3. **Set public access** to true
4. **Configure policies** (already in schema)

### **Step 6: Environment Variables**

#### **Local Development (.env.local)**
```env
# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret

# Email (Gmail example)
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASS=your-app-password
EMAIL_FROM=noreply@shopeasy.com
```

#### **Vercel Environment Variables**
1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add all variables above**

### **Step 7: Payment Setup (Stripe)**

1. **Create [Stripe Account](https://stripe.com)**
2. **Get API Keys** from Dashboard
3. **Add to environment variables**
4. **Configure webhook** (optional)

### **Step 8: Email Setup**

#### **Option A: Gmail**
1. **Enable 2FA** on Gmail
2. **Generate App Password**
3. **Use app password** in SMTP settings

#### **Option B: SendGrid**
```env
EMAIL_SMTP_HOST=smtp.sendgrid.net
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=apikey
EMAIL_SMTP_PASS=your-sendgrid-api-key
```

#### **Option C: Resend**
```env
EMAIL_SMTP_HOST=smtp.resend.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=resend
EMAIL_SMTP_PASS=your-resend-api-key
```

### **Step 9: Deploy to Vercel**

1. **Push code to GitHub**
2. **Connect to Vercel**
3. **Add environment variables**
4. **Deploy**

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth` - Sign up, sign in, sign out

### **Products**
- `GET /api/products` - Get all products
- `GET /api/products?id=1` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products` - Update product
- `DELETE /api/products?id=1` - Delete product

### **Orders**
- `GET /api/orders` - Get all orders
- `GET /api/orders?id=1` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders` - Update order
- `DELETE /api/orders?id=1` - Delete order

### **Payments**
- `POST /api/payments` - Create payment intent
- `PUT /api/payments` - Update payment status
- `GET /api/payments` - Get payments

### **Email**
- `POST /api/email` - Send email notifications

## 📊 **Database Tables**

### **Core Tables**
- `users` - User profiles and authentication
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Order line items
- `payments` - Payment records
- `cart_items` - Shopping cart
- `wishlist_items` - User wishlists
- `reviews` - Product reviews
- `categories` - Product categories
- `settings` - App configuration
- `notifications` - User notifications

### **Features**
- ✅ **Row Level Security (RLS)**
- ✅ **Real-time subscriptions**
- ✅ **File uploads**
- ✅ **Email notifications**
- ✅ **Payment processing**
- ✅ **Order management**
- ✅ **User management**

## 🚀 **Testing**

### **Test Authentication**
```bash
# Sign up
curl -X POST /api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"signup","email":"test@example.com","password":"password123","fullName":"Test User"}'

# Sign in
curl -X POST /api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"signin","email":"test@example.com","password":"password123"}'
```

### **Test Products**
```bash
# Get products
curl /api/products

# Create product
curl -X POST /api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":99.99,"stock":10,"category":"Electronics"}'
```

## 🔒 **Security Features**

- **Row Level Security (RLS)** - Data access control
- **JWT Authentication** - Secure user sessions
- **API Rate Limiting** - Prevent abuse
- **CORS Protection** - Cross-origin security
- **Input Validation** - Data sanitization
- **SQL Injection Protection** - Parameterized queries

## 📈 **Performance**

- **Database Indexing** - Fast queries
- **Connection Pooling** - Efficient connections
- **Caching** - Redis integration (optional)
- **CDN** - Global content delivery
- **Image Optimization** - Automatic resizing

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **Authentication Errors**
   - Check environment variables
   - Verify Supabase URL and keys
   - Check redirect URLs

2. **Database Errors**
   - Run schema script again
   - Check RLS policies
   - Verify table permissions

3. **Payment Errors**
   - Check Stripe keys
   - Verify webhook configuration
   - Test with Stripe test mode

4. **Email Errors**
   - Check SMTP settings
   - Verify app passwords
   - Test with different provider

### **Support**
- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Stripe Docs:** https://stripe.com/docs

## 🎯 **Next Steps**

1. **Set up monitoring** (Sentry, LogRocket)
2. **Add analytics** (Google Analytics, Mixpanel)
3. **Implement caching** (Redis, Vercel Edge Cache)
4. **Add testing** (Jest, Cypress)
5. **Set up CI/CD** (GitHub Actions)
6. **Configure backups** (Supabase backups)
7. **Add SEO** (Meta tags, sitemap)
8. **Optimize performance** (Lighthouse, Core Web Vitals)

---

**Your e-commerce platform is now ready with full backend functionality!** 🚀




