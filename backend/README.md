# ShopEasy Backend API

A complete Express.js backend for the ShopEasy e-commerce application.

## 🚀 Features

- **Products API** - CRUD operations for products
- **Categories API** - Category management
- **Cart API** - Shopping cart functionality
- **Auth API** - User authentication and profiles
- **Supabase Integration** - Database and authentication
- **CORS Enabled** - Cross-origin requests
- **Error Handling** - Comprehensive error management

## 📋 API Endpoints

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Auth
- `POST /api/auth/login` - User login
- `GET /api/auth/profile/:id` - Get user profile
- `PUT /api/auth/profile/:id` - Update user profile
- `GET /api/auth/orders/:user_id` - Get user orders

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create .env file:**
   ```
   PORT=5000
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   NODE_ENV=development
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Start production server:**
   ```bash
   npm start
   ```

## 🔧 Environment Variables

- `PORT` - Server port (default: 5000)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NODE_ENV` - Environment (development/production)

## 📊 Health Check

- `GET /health` - Check if server is running

## 🚀 Deployment

The backend is ready for deployment on:
- Vercel
- Heroku
- Railway
- DigitalOcean
- AWS

## 📝 Usage

The frontend can connect to this backend using:

```javascript
// Example API calls
const response = await fetch('http://localhost:5000/api/products');
const products = await response.json();

const cartResponse = await fetch('http://localhost:5000/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id: '123', product_id: '456', quantity: 1 })
});
```

