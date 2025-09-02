# 🚀 Vercel Deployment Guide for ShopEasy Authentication

This guide will help you deploy your ShopEasy authentication system to Vercel with proper configuration.

## Prerequisites

- GitHub account with your project repository
- Vercel account (free tier available)
- Firebase project configured
- Supabase project configured (optional)

## Step 1: Prepare Your Repository

Make sure your project has the following files:

```
├── package.json
├── vite.config.ts
├── vercel.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── src/
│   ├── vite-env.d.ts
│   ├── config/
│   │   └── environment.ts
│   ├── lib/
│   │   ├── firebase.ts
│   │   └── supabase.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   └── pages/
│       └── Login.tsx
└── README.md
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy to Vercel**
```bash
vercel
```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? `Select your account`
   - Link to existing project? `N`
   - What's your project's name? `shopeasy-auth`
   - In which directory is your code located? `./` (current directory)
   - Want to override the settings? `N`

5. **For Production Deployment**
```bash
vercel --prod
```

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite project
5. Click "Deploy"

## Step 3: Configure Environment Variables

### In Vercel Dashboard:

1. Go to your project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

#### Firebase Configuration
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
```

#### Supabase Configuration (Optional)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### App Configuration
```
VITE_APP_NAME=ShopEasy
VITE_APP_VERSION=1.0.0
```

4. **Set Environment for each variable:**
   - **Production**: ✅
   - **Preview**: ✅
   - **Development**: ✅

5. Click **Save**

## Step 4: Configure Firebase for Production

### 1. Update Firebase Authentication Settings

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain: `your-project.vercel.app`

### 2. Configure Google OAuth (if using)

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add your Vercel domain to authorized domains
4. Configure OAuth consent screen in Google Cloud Console

### 3. Configure Phone Authentication (if using)

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Phone** provider
3. Add your Vercel domain to authorized domains

## Step 5: Configure Supabase (if using)

### 1. Update Supabase Settings

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Settings** → **URL Configuration**
4. Add your Vercel domain to **Site URL**
5. Add your Vercel domain to **Redirect URLs**

### 2. Configure Google OAuth in Supabase

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials
4. Set redirect URL to: `https://your-project.vercel.app/auth/callback`

## Step 6: Test Your Deployment

### 1. Test Authentication Methods

Visit your Vercel URL and test:

- ✅ **Email/Password Registration**
- ✅ **Email/Password Login**
- ✅ **Phone OTP Authentication** (Firebase)
- ✅ **Google Sign-in** (Both providers)
- ✅ **Provider Switching** (Firebase ↔ Supabase)

### 2. Check Console for Errors

Open browser developer tools and check:
- No authentication errors
- No CORS issues
- Proper redirect handling

## Step 7: Custom Domain (Optional)

### 1. Add Custom Domain

1. In Vercel Dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### 2. Update Firebase/Supabase Settings

Remember to add your custom domain to:
- Firebase authorized domains
- Supabase site URL and redirect URLs

## Troubleshooting

### Common Issues

#### 1. Environment Variables Not Working
```bash
# Check if variables are set correctly
vercel env ls
```

#### 2. Build Errors
```bash
# Check build logs in Vercel Dashboard
# Common issues:
# - Missing dependencies
# - TypeScript errors
# - Import path issues
```

#### 3. Authentication Not Working
- Check Firebase/Supabase domain configuration
- Verify environment variables are set correctly
- Check browser console for errors

#### 4. OAuth Redirect Issues
- Ensure redirect URLs are configured correctly
- Check if HTTPS is required (Vercel provides this automatically)

### Debug Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Redeploy with fresh build
vercel --force

# Check environment variables
vercel env ls
```

## Performance Optimization

### 1. Enable Edge Functions (Optional)

For better performance, you can move authentication logic to Vercel Edge Functions:

```typescript
// api/auth.ts
export default function handler(req, res) {
  // Handle authentication logic here
}
```

### 2. Optimize Bundle Size

```bash
# Analyze bundle size
npm run build
# Check dist folder for large files
```

### 3. Enable Caching

Add caching headers in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Monitoring

### 1. Vercel Analytics

Enable Vercel Analytics in your project dashboard for:
- Page views
- Performance metrics
- Error tracking

### 2. Firebase Analytics

Add Firebase Analytics to track user behavior:

```typescript
import { getAnalytics } from 'firebase/analytics'
const analytics = getAnalytics(app)
```

## Security Best Practices

### 1. Environment Variables
- Never commit API keys to Git
- Use Vercel's environment variable encryption
- Rotate keys regularly

### 2. Firebase Security Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Supabase RLS Policies
```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);
```

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review Firebase/Supabase configuration
3. Check browser console for errors
4. Verify environment variables are set correctly
5. Test locally first with `npm run dev`

---

**Your ShopEasy authentication system is now deployed and ready for production! 🎉**



