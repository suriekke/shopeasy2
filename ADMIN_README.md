# 🚀 ShopEasy Admin Dashboard

A comprehensive admin dashboard for the ShopEasy quick commerce application built with React, TypeScript, Tailwind CSS, and Firebase.

## ✨ Features

### 🔐 Authentication
- **Firebase Authentication** with admin role verification
- **Secure login** with email/password
- **Role-based access control** (Admin only)

### 📊 Dashboard Overview
- **Real-time statistics** cards
- **Recent orders** table
- **Quick action** buttons
- **Revenue tracking**
- **User activity** monitoring

### 🛍️ Product Management
- **Add new products** with full details
- **Edit existing products** (name, price, stock, image, category)
- **Delete products** with confirmation
- **Stock management** with status indicators
- **Category organization**

### 📦 Order Management
- **View all orders** with detailed information
- **Update order status** (Pending → Confirmed → Out for Delivery → Delivered)
- **Order details modal** with customer info and items
- **Real-time status tracking**

### 👥 User Management
- **Customer list** with contact information
- **User activity** tracking
- **Account status** management
- **Registration date** and last login tracking

### 🚚 Delivery Partner Management
- **Partner approval** system
- **Vehicle information** tracking
- **Rating system** with star display
- **Delivery statistics**
- **Status management** (Approved/Blocked)

### 📈 Analytics & Reports
- **Revenue analytics** with growth indicators
- **Order statistics** and trends
- **User engagement** metrics
- **Product performance** tracking
- **Recent activity** feed

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Hosting)
- **State Management**: React Hooks
- **Real-time Updates**: Firebase Firestore listeners

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopeasy-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a Firebase project
   - Enable Authentication, Firestore, and Hosting
   - Update Firebase config in `src/firebase/admin-config.ts`

4. **Set up Admin User**
   - Create an admin user in Firebase Authentication
   - Use email: `admin@shopeasy.com` and password: `admin123`
   - Or update credentials in `src/services/adminAuth.ts`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access Admin Dashboard**
   - Go to your app
   - Click the "Admin" button in the header
   - Login with admin credentials

## 🔧 Configuration

### Firebase Setup

1. **Create Firebase Project**
   ```bash
   firebase init
   ```

2. **Enable Services**
   - Authentication (Email/Password)
   - Firestore Database
   - Hosting

3. **Update Configuration**
   ```typescript
   // src/firebase/admin-config.ts
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     // ... other config
   };
   ```

### Admin Credentials

Update admin credentials in `src/services/adminAuth.ts`:
```typescript
const ADMIN_EMAIL = 'your-admin@email.com';
const ADMIN_PASSWORD = 'your-secure-password';
```

## 📱 Usage Guide

### Accessing Admin Dashboard

1. **From Main App**
   - Click "Admin" button in header
   - Login with admin credentials
   - Access full admin interface

2. **Direct Access**
   - Navigate to `/admin` route
   - Login with admin credentials

### Managing Products

1. **Add New Product**
   - Go to Products page
   - Click "Add Product" button
   - Fill in product details
   - Upload image URL
   - Save product

2. **Edit Product**
   - Find product in table
   - Click "Edit" button
   - Modify details
   - Save changes

3. **Delete Product**
   - Find product in table
   - Click "Delete" button
   - Confirm deletion

### Managing Orders

1. **View Orders**
   - Go to Orders page
   - See all orders with status
   - Click "View" for details

2. **Update Status**
   - Select new status from dropdown
   - Status updates automatically
   - Real-time tracking

### Managing Users

1. **View Customers**
   - Go to Users page
   - See all registered users
   - View activity and status

### Managing Delivery Partners

1. **Approve Partners**
   - Go to Delivery Partners page
   - Click "Approve" for new partners
   - Monitor ratings and performance

## 🔒 Security Features

- **Role-based access** - Only admin users can access
- **Firebase Security Rules** - Database protection
- **Authentication required** - Secure login system
- **Input validation** - Form validation and sanitization

## 📊 Data Structure

### Products Collection
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Orders Collection
```typescript
interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Out for Delivery' | 'Delivered';
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Users Collection
```typescript
interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Timestamp;
  lastLogin?: Timestamp;
}
```

## 🚀 Deployment

### Firebase Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

3. **Access live admin dashboard**
   - Visit your Firebase hosting URL
   - Navigate to admin section

## 🔧 Customization

### Adding New Features

1. **Create new page component**
2. **Add route in AdminDashboard.tsx**
3. **Update sidebar navigation**
4. **Add Firestore service functions**

### Styling Customization

- Modify Tailwind classes in components
- Update color scheme in `tailwind.config.js`
- Customize gradients and themes

## 📞 Support

For support and questions:
- Check Firebase documentation
- Review React and TypeScript docs
- Contact development team

## 📄 License

This project is licensed under the MIT License.

---

**ShopEasy Admin Dashboard** - Built with ❤️ for modern e-commerce management



