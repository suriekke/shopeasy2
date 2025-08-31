# ShopEasy Quick Commerce Backend

A complete backend system for a quick commerce application with user authentication, product management, cart operations, and order processing.

## 🗄️ Database Schema

### Core Tables:
- **users** - User accounts and profiles
- **user_addresses** - Delivery addresses
- **categories** - Product categories
- **products** - Product catalog
- **cart** - Shopping cart items
- **wishlist** - User wishlists
- **orders** - Order management
- **order_items** - Order line items
- **delivery_partners** - Delivery personnel
- **payment_methods** - Payment options
- **notifications** - User notifications
- **rewards** - Loyalty points
- **gift_cards** - Gift card management

## 🚀 Setup Instructions

### 1. Database Setup (Supabase)

1. **Create Supabase Project:**
   - Go to https://supabase.com
   - Create a new project
   - Note down your project URL and anon key

2. **Run Database Schema:**
   - Copy the contents of `supabase-schema.sql`
   - Run it in your Supabase SQL editor
   - This will create all tables and sample data

3. **Configure Environment:**
   ```bash
   # Add to .env file
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 2. Twilio Setup (SMS OTP)

1. **Create Twilio Account:**
   - Go to https://twilio.com
   - Sign up and get your credentials

2. **Configure Twilio:**
   ```bash
   # Add to .env file
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_SERVICE_SID=your_verify_service_sid
   ```

3. **Verify Phone Numbers:**
   - Add phone numbers to verified list in Twilio console
   - Trial accounts can only send SMS to verified numbers

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Server

```bash
npm start
# or
node index.js
```

## 📡 API Endpoints

### Authentication
- `POST /auth/send-otp` - Send OTP to phone number
- `POST /auth/verify-otp` - Verify OTP and login
- `GET /auth/stats` - Get user statistics
- `GET /auth/users` - Get all users (admin)

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /products/categories/all` - Get all categories

### Cart (via dbService)
- `getCartItems(userId)` - Get user's cart
- `addToCart(userId, productId, quantity)` - Add item to cart
- `updateCartItem(userId, productId, quantity)` - Update cart item
- `removeFromCart(userId, productId)` - Remove from cart
- `clearCart(userId)` - Clear entire cart

### Orders (via dbService)
- `createOrder(orderData)` - Create new order
- `getOrders(userId)` - Get user's orders
- `getOrderById(orderId)` - Get specific order

## 🔧 Database Service Functions

The `dbService` object provides convenient functions for database operations:

```javascript
import { dbService } from './supabaseClient.js';

// User management
await dbService.createUser(userData);
await dbService.getUserByPhone(phone);
await dbService.updateUserLogin(phone);

// Product management
await dbService.getProducts(filters);
await dbService.getProductById(id);

// Cart management
await dbService.getCartItems(userId);
await dbService.addToCart(userId, productId, quantity);

// Order management
await dbService.createOrder(orderData);
await dbService.getOrders(userId);
```

## 🎯 Features

### ✅ Implemented:
- User authentication with SMS OTP
- Product catalog with categories
- Shopping cart functionality
- Order management system
- User address management
- Wishlist functionality
- Notification system
- Database integration with Supabase

### 🚧 Future Enhancements:
- Payment gateway integration
- Real-time order tracking
- Delivery partner app
- Admin dashboard
- Analytics and reporting
- Push notifications
- Multi-language support

## 🔒 Security Features

- Phone number verification via SMS
- Secure OTP validation
- Database-level constraints
- Input validation
- Error handling

## 📊 Sample Data

The schema includes sample data for:
- 5 product categories
- 5 sample products
- 3 delivery partners
- 4 payment methods

## 🛠️ Development

### Adding New Routes:
1. Create new route file in `routes/` directory
2. Import and add to `index.js`
3. Follow existing patterns for error handling

### Database Changes:
1. Update `supabase-schema.sql`
2. Run in Supabase SQL editor
3. Update `dbService` functions if needed

## 📝 Environment Variables

```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_SERVICE_SID=your_twilio_service_sid

# Server
PORT=5000
```

## 🚀 Deployment

1. Set up environment variables
2. Install dependencies: `npm install`
3. Start server: `npm start`
4. Ensure database is properly configured
5. Test all endpoints

## 📞 Support

For issues or questions:
1. Check the logs for error messages
2. Verify environment variables
3. Test database connectivity
4. Check Twilio configuration

