# ShopEasy Development Guide

## 🎯 **Project Structure Overview**

```
shopeasy-clean/
├── frontend/           # Vercel Frontend (Customer App)
├── admin-app/          # Admin Dashboard (shopeasy2)
├── customer-app/       # Customer App (shopeasy3)
└── backend/            # Render Backend
```

## 🚀 **Development Workflow**

### **1. Frontend Development (Vercel)**

```bash
cd shopeasy-clean/frontend
npm install              # Install dependencies
npm run dev              # Start development server (localhost:3000)
npm run build            # Build for production
npm run preview          # Preview production build
```

**Features:**
- React + TypeScript + Vite
- Tailwind CSS for styling
- Supabase integration
- Firebase integration
- Responsive design

### **2. Admin Dashboard Development**

```bash
cd shopeasy-clean/admin-app
npm install              # Install dependencies
npm start                # Start development server
npm run build            # Build for production
```

**Features:**
- Admin panel for products, users, orders
- OTP authentication
- Analytics dashboard
- User management
- Order management

### **3. Customer App Development**

```bash
cd shopeasy-clean/customer-app
npm install              # Install dependencies
npm run dev              # Start development server
npm run build            # Build for production
```

**Features:**
- Customer shopping experience
- Product browsing and search
- Cart and checkout
- User profiles and orders
- Payment integration

### **4. Backend Development (Render)**

```bash
cd shopeasy-clean/backend
npm install              # Install dependencies
npm run dev              # Start development server with nodemon
npm start                # Start production server
```

**Features:**
- RESTful API endpoints
- Supabase database integration
- Authentication routes
- Product management
- Order processing
- Analytics API

## 🔧 **Environment Setup**

### **Frontend (.env)**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_FIREBASE_API_KEY=your_firebase_key
```

### **Backend (.env)**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
NODE_ENV=development
PORT=3001
```

## 📱 **Development URLs**

- **Frontend**: http://localhost:3000
- **Admin App**: http://localhost:3001
- **Customer App**: http://localhost:3002
- **Backend API**: http://localhost:3003

## 🚀 **Deployment**

### **Frontend (Vercel)**
```bash
cd shopeasy-clean/frontend
vercel --prod
```

### **Backend (Render)**
- Connect GitHub repository
- Auto-deploy on push to main branch
- Environment variables configured in Render dashboard

## 🧪 **Testing**

### **Frontend Testing**
```bash
cd shopeasy-clean/frontend
npm test                 # Run tests
npm run test:coverage    # Coverage report
```

### **Backend Testing**
```bash
cd shopeasy-clean/backend
npm test                 # Run tests
npm run test:watch       # Watch mode
```

## 📁 **File Organization**

### **Frontend Structure**
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── contexts/       # React contexts
│   ├── lib/            # Utility functions
│   └── config/         # Configuration files
├── public/             # Static assets
└── package.json        # Dependencies
```

### **Backend Structure**
```
backend/
├── routes/             # API route handlers
├── models/             # Data models
├── middleware/         # Custom middleware
├── utils/              # Utility functions
├── config/             # Configuration
└── server.js           # Main server file
```

## 🔄 **Git Workflow**

### **Branch Strategy**
- `main` - Production code
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches

### **Commit Convention**
```
feat: add new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 🚨 **Common Issues & Solutions**

### **Port Conflicts**
- Frontend: 3000
- Admin: 3001
- Customer: 3002
- Backend: 3003

### **Dependencies Issues**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Build Issues**
```bash
npm run build --verbose
```

## 📚 **Useful Commands**

### **Development**
```bash
# Start all services
cd shopeasy-clean/frontend && npm run dev &
cd shopeasy-clean/admin-app && npm start &
cd shopeasy-clean/backend && npm run dev &

# Stop all services
pkill -f "npm run dev"
pkill -f "npm start"
```

### **Database**
```bash
# Supabase CLI
supabase status
supabase db reset
supabase db push
```

## 🎉 **Getting Started**

1. **Clone the repository**
2. **Navigate to shopeasy-clean**
3. **Install dependencies for each component**
4. **Set up environment variables**
5. **Start development servers**
6. **Begin coding!**

---

*Happy Coding! 🚀*


