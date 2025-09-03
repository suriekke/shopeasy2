# ShopEasy - Complete Authentication System

A modern e-commerce application with comprehensive authentication system supporting multiple providers (Firebase and Supabase) and authentication methods.
<!-- Updated for Render deployment fix -->

## Features

### 🔐 Authentication Methods
- **Email/Password Authentication** - Traditional login and registration
- **Phone OTP Authentication** - SMS-based verification (Firebase only)
- **Social Authentication** - Google Sign-in
- **Multi-Provider Support** - Switch between Firebase and Supabase

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Loading states and error handling
- Form validation and user feedback

### 🛠️ Technical Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth + Supabase Auth
- **Database**: Firestore + Supabase
- **Icons**: Lucide React

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
VITE_APP_NAME=ShopEasy
VITE_APP_VERSION=1.0.0
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication with Email/Password and Google providers
4. Enable Phone Authentication for OTP functionality
5. Create a Firestore database
6. Copy your Firebase config to the `.env` file

### 4. Supabase Setup (Optional)

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Enable Authentication with Email and Google providers
4. Copy your Supabase URL and anon key to the `.env` file

### 5. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 6. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel

# For production deployment
vercel --prod
```

Your application will be deployed to a Vercel URL like `https://your-project.vercel.app`

## Authentication Features

### Email/Password Authentication
- User registration with email verification
- Secure password handling
- Password visibility toggle
- Form validation and error handling

### Phone OTP Authentication
- SMS-based verification
- reCAPTCHA integration
- Automatic user creation
- Phone number validation

### Social Authentication
- Google Sign-in integration
- Automatic profile creation
- Seamless user experience

### Multi-Provider Support
- Switch between Firebase and Supabase
- Consistent API across providers
- Provider-specific optimizations

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (AuthContext)
├── lib/               # External library configurations
│   ├── firebase.ts    # Firebase configuration
│   └── supabase.ts    # Supabase configuration
├── pages/             # Page components
│   └── Login.tsx      # Main authentication page
├── config/            # Configuration files
│   └── environment.ts # Environment variables
└── index.css          # Global styles with Tailwind
```

## API Reference

### AuthContext Methods

```typescript
// Email/Password Authentication
signInWithEmail(email: string, password: string): Promise<void>
signUpWithEmail(email: string, password: string, fullName: string): Promise<void>

// Phone OTP Authentication
sendOTP(phone: string): Promise<void>
verifyOTP(phone: string, otp: string): Promise<void>

// Social Authentication
signInWithGoogle(): Promise<void>

// Sign Out
signOut(): Promise<void>

// Provider Management
authProvider: 'firebase' | 'supabase'
setAuthProvider(provider: 'firebase' | 'supabase'): void
```

## Customization

### Styling
The application uses Tailwind CSS with custom color schemes. You can modify the colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#ec4899', // Main brand color
        // ... other shades
      }
    }
  }
}
```

### Authentication Providers
To add new authentication providers:

1. Update the `AuthContext.tsx` with new provider logic
2. Add provider configuration in `environment.ts`
3. Update the UI to include new provider options

## Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy to Vercel**
```bash
vercel
```

3. **Set Environment Variables in Vercel Dashboard**
   - Go to your project in Vercel Dashboard
   - Navigate to Settings → Environment Variables
   - Add all your environment variables from `.env`

4. **Production Deployment**
```bash
vercel --prod
```

### Build for Production
```bash
npm run build
```

### Alternative Deployments

#### Deploy to Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

#### Deploy to Railway
```bash
# Connect your GitHub repo to Railway
# Railway will automatically detect Vite and deploy
```

## Security Considerations

- All API keys are stored in environment variables
- Firebase Security Rules should be configured for Firestore
- Supabase Row Level Security (RLS) should be enabled
- HTTPS is required for production deployments
- reCAPTCHA is integrated for phone authentication

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Check your Firebase configuration in `.env`
2. **OTP not working**: Ensure Phone Authentication is enabled in Firebase
3. **Google Sign-in failing**: Verify Google provider is configured in Firebase/Supabase
4. **Styling issues**: Make sure Tailwind CSS is properly configured

### Debug Mode
Enable debug logging by setting:
```env
VITE_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

---

**Note**: This is a complete authentication system with real functionality. Make sure to configure your Firebase and Supabase projects properly before using in production.
