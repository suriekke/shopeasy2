// Simple Firebase Import Script
// Copy and paste this entire script into Firebase Console browser console

console.log("Starting import...");

// Products data
const products = [
  {
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
  }
];

// Orders data
const orders = [
  {
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

// Users data
const users = [
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "+919876543210",
    role: "customer",
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+919876543211",
    role: "customer",
    createdAt: new Date(),
    lastLogin: new Date()
  }
];

// Import function
async function importData() {
  try {
    console.log("Adding products...");
    
    // Add products
    for (let i = 0; i < products.length; i++) {
      const docId = `prod_00${i + 1}`;
      await firebase.firestore().collection('products').doc(docId).set(products[i]);
      console.log(`Added product ${docId}`);
    }
    
    console.log("Adding orders...");
    
    // Add orders
    for (let i = 0; i < orders.length; i++) {
      const docId = `order_00${i + 1}`;
      await firebase.firestore().collection('orders').doc(docId).set(orders[i]);
      console.log(`Added order ${docId}`);
    }
    
    console.log("Adding users...");
    
    // Add users
    for (let i = 0; i < users.length; i++) {
      const docId = `user_00${i + 1}`;
      await firebase.firestore().collection('users').doc(docId).set(users[i]);
      console.log(`Added user ${docId}`);
    }
    
    console.log("Import completed successfully!");
    console.log(`Added: ${products.length} products, ${orders.length} orders, ${users.length} users`);
    
  } catch (error) {
    console.error("Import failed:", error);
  }
}

// Start import
importData();

 





