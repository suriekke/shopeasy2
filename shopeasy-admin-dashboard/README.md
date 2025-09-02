# ShopEasy Admin Dashboard

A modern, professional admin dashboard for the ShopEasy quick commerce application built with React, TypeScript, and Supabase.

## 🚀 Features

### ✅ Complete Features
- **Modern React + TypeScript** - Professional codebase with type safety
- **Tailwind CSS** - Beautiful, responsive design
- **Supabase Integration** - Real-time database with PostgreSQL
- **Zustand State Management** - Lightweight and efficient state management
- **React Router** - Client-side routing with protected routes
- **Lucide React Icons** - Modern icon library
- **Responsive Design** - Works on all devices

### 📊 Dashboard Features
- **Real-time Statistics** - Revenue, products, orders, users
- **Product Management** - Full CRUD operations (Create, Read, Update, Delete)
- **Search & Filter** - Find products quickly
- **Low Stock Alerts** - Automatic notifications for low inventory
- **Recent Orders** - Live order tracking
- **Professional UI** - Modern, clean interface

### 🔐 Authentication
- **Protected Routes** - Secure admin access
- **Login System** - Email/password authentication
- **Session Management** - Persistent login state

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Build Tool**: Create React App

## 📁 Project Structure

```
src/
├── components/
│   └── Layout/
│       ├── DashboardLayout.tsx
│       ├── Header.tsx
│       └── Sidebar.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Products.tsx
│   └── Login.tsx
├── store/
│   └── useStore.ts
├── lib/
│   └── supabase.ts
├── App.tsx
└── index.tsx
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Access the Dashboard
- **URL**: http://localhost:3000
- **Login**: admin@shopeasy.com / admin123

## 📊 Database Schema

### Products Table (groceries)
```sql
CREATE TABLE groceries (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL,
  unit VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Key Features

### Dashboard
- Real-time statistics cards
- Recent orders overview
- Low stock alerts
- Revenue tracking

### Product Management
- Add new products
- Edit existing products
- Delete products
- Search and filter
- Stock management

### Navigation
- Responsive sidebar
- Active page highlighting
- Quick access to all sections

## 🔧 Configuration

### Supabase Setup
1. Create a Supabase project
2. Create the `groceries` table
3. Update `src/lib/supabase.ts` with your credentials

### Environment Variables
Create a `.env` file:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Mobile-optimized layout

## 🔒 Security

- Protected routes for admin access
- Supabase Row Level Security (RLS)
- Input validation and sanitization
- Secure authentication flow

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📈 Future Enhancements

- [ ] Order management with real-time updates
- [ ] User management system
- [ ] Delivery partner management
- [ ] Advanced analytics with charts
- [ ] Inventory alerts and notifications
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Export functionality (CSV/PDF)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for ShopEasy**





