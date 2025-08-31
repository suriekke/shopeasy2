// STEP-BY-STEP FIREBASE IMPORT
// Run these commands ONE BY ONE in the Firebase Console

// STEP 1: Add Products (run each command separately)

// Product 1
firebase.firestore().collection('products').doc('prod_001').set({
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
});

// Product 2
firebase.firestore().collection('products').doc('prod_002').set({
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
});

// Product 3
firebase.firestore().collection('products').doc('prod_003').set({
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
});

// STEP 2: Add Orders

// Order 1
firebase.firestore().collection('orders').doc('order_001').set({
  userId: "user_001",
  items: [
    { productId: "prod_001", name: "Fresh Organic Tomatoes", quantity: 2, price: 45 },
    { productId: "prod_004", name: "Organic Honey", quantity: 1, price: 199 }
  ],
  total: 289,
  status: "pending",
  createdAt: new Date(),
  updatedAt: new Date()
});

// Order 2
firebase.firestore().collection('orders').doc('order_002').set({
  userId: "user_002",
  items: [
    { productId: "prod_002", name: "Premium Coffee Beans", quantity: 1, price: 299 },
    { productId: "prod_007", name: "Premium Chocolates", quantity: 2, price: 149 }
  ],
  total: 597,
  status: "confirmed",
  createdAt: new Date(),
  updatedAt: new Date()
});

// STEP 3: Add Users

// User 1
firebase.firestore().collection('users').doc('user_001').set({
  name: "John Doe",
  email: "john@example.com",
  phone: "+919876543210",
  role: "customer",
  createdAt: new Date(),
  lastLogin: new Date()
});

// User 2
firebase.firestore().collection('users').doc('user_002').set({
  name: "Jane Smith",
  email: "jane@example.com",
  phone: "+919876543211",
  role: "customer",
  createdAt: new Date(),
  lastLogin: new Date()
});

// STEP 4: Check if data was added
console.log("Checking collections...");
firebase.firestore().collection('products').get().then(snapshot => {
  console.log(`Products: ${snapshot.size} documents`);
});
firebase.firestore().collection('orders').get().then(snapshot => {
  console.log(`Orders: ${snapshot.size} documents`);
});
firebase.firestore().collection('users').get().then(snapshot => {
  console.log(`Users: ${snapshot.size} documents`);
});

