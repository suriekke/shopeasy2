// Script to set up Firestore database with sample products
// Run this in browser console at https://console.firebase.google.com/project/shopeasy-app-ebbfb/firestore

const sampleProducts = [
  {
    id: "prod_001",
    name: "Fresh Organic Tomatoes",
    description: "Fresh organic tomatoes from local farms",
    price: 45,
    originalPrice: 60,
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400",
    category: "Fresh",
    subCategory: "Vegetables",
    stock: 50,
    rating: 4.5,
    reviews: 23,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod_002", 
    name: "Premium Coffee Beans",
    description: "Arabica coffee beans, medium roast",
    price: 299,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    category: "Cafe",
    subCategory: "Coffee",
    stock: 25,
    rating: 4.8,
    reviews: 45,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod_003",
    name: "Wireless Bluetooth Headphones",
    description: "Noise cancelling wireless headphones",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    category: "Electronics",
    subCategory: "Audio",
    stock: 15,
    rating: 4.6,
    reviews: 67,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod_004",
    name: "Organic Honey",
    description: "Pure organic honey from wildflowers",
    price: 199,
    originalPrice: 249,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
    category: "Fresh",
    subCategory: "Dairy",
    stock: 30,
    rating: 4.7,
    reviews: 34,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod_005",
    name: "Smart LED Bulb",
    description: "WiFi enabled smart LED bulb with app control",
    price: 599,
    originalPrice: 799,
    image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=400",
    category: "Home",
    subCategory: "Lighting",
    stock: 20,
    rating: 4.4,
    reviews: 28,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod_006",
    name: "Natural Face Cream",
    description: "Hydrating face cream with natural ingredients",
    price: 399,
    originalPrice: 499,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    category: "Beauty",
    subCategory: "Skincare",
    stock: 40,
    rating: 4.3,
    reviews: 56,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod_007",
    name: "Premium Chocolates",
    description: "Assorted premium dark chocolates",
    price: 149,
    originalPrice: 199,
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400",
    category: "Snacks",
    subCategory: "Chocolates",
    stock: 35,
    rating: 4.9,
    reviews: 89,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod_008",
    name: "Cotton T-Shirt",
    description: "Comfortable cotton t-shirt for daily wear",
    price: 299,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "Fashion",
    subCategory: "Clothing",
    stock: 60,
    rating: 4.2,
    reviews: 42,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleOrders = [
  {
    id: "order_001",
    userId: "user_001",
    items: [
      { productId: "prod_001", name: "Fresh Organic Tomatoes", quantity: 2, price: 45 },
      { productId: "prod_004", name: "Organic Honey", quantity: 1, price: 199 }
    ],
    total: 289,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "order_002",
    userId: "user_002", 
    items: [
      { productId: "prod_002", name: "Premium Coffee Beans", quantity: 1, price: 299 },
      { productId: "prod_007", name: "Premium Chocolates", quantity: 2, price: 149 }
    ],
    total: 597,
    status: "confirmed",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleUsers = [
  {
    id: "user_001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+919876543210",
    role: "customer",
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    id: "user_002",
    name: "Jane Smith", 
    email: "jane@example.com",
    phone: "+919876543211",
    role: "customer",
    createdAt: new Date(),
    lastLogin: new Date()
  }
];

console.log("Sample data ready. Copy and paste this into Firebase Console Firestore Database:");

console.log("\n=== PRODUCTS ===");
sampleProducts.forEach(product => {
  console.log(`Collection: products, Document ID: ${product.id}`);
  console.log(JSON.stringify(product, null, 2));
});

console.log("\n=== ORDERS ===");
sampleOrders.forEach(order => {
  console.log(`Collection: orders, Document ID: ${order.id}`);
  console.log(JSON.stringify(order, null, 2));
});

console.log("\n=== USERS ===");
sampleUsers.forEach(user => {
  console.log(`Collection: users, Document ID: ${user.id}`);
  console.log(JSON.stringify(user, null, 2));
});






