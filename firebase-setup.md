# Firebase Migration Guide for ShopEasy

## 🎯 **Step 1: Create Firebase Project**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Create a project"**
3. **Project Name**: `shopeasy-app`
4. **Enable Google Analytics**: Yes
5. **Click "Create project"**

## 🔧 **Step 2: Enable Services**

### **Authentication**
1. Go to Authentication → Sign-in method
2. Enable **Phone** authentication
3. Add your test phone numbers
4. Configure OTP settings

### **Firestore Database**
1. Go to Firestore Database
2. Click "Create database"
3. Choose **Start in test mode** (we'll add security rules later)
4. Select location: **asia-south1 (Mumbai)**

### **Storage**
1. Go to Storage
2. Click "Get started"
3. Choose **Start in test mode**
4. Select location: **asia-south1 (Mumbai)**

### **Hosting**
1. Go to Hosting
2. Click "Get started"
3. Install Firebase CLI (we'll do this next)

## 📱 **Step 3: Get Configuration**

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web
4. App nickname: `shopeasy-web`
5. Copy the config object

## 🔑 **Step 4: Environment Variables**

Create `.env` file with Firebase config:

```env
# Firebase Config
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 🛠️ **Step 5: Install Firebase CLI**

```bash
npm install -g firebase-tools
firebase login
firebase init
```

## 📊 **Database Schema (Firestore)**

### **Collections Structure:**

```
/users/{userId}
  - phone: string
  - name: string
  - email: string
  - isVerified: boolean
  - createdAt: timestamp
  - lastLogin: timestamp
  - addresses: array
  - preferences: object

/products/{productId}
  - name: string
  - description: string
  - price: number
  - originalPrice: number
  - category: string
  - subCategory: string
  - images: array
  - stock: number
  - isActive: boolean
  - createdAt: timestamp

/orders/{orderId}
  - userId: string
  - items: array
  - total: number
  - status: string
  - deliveryAddress: object
  - paymentMethod: string
  - createdAt: timestamp
  - estimatedDelivery: timestamp

/cart/{userId}
  - items: array
  - total: number
  - updatedAt: timestamp

/categories/{categoryId}
  - name: string
  - icon: string
  - isActive: boolean

/delivery_partners/{partnerId}
  - name: string
  - phone: string
  - isActive: boolean
  - currentLocation: object
  - rating: number

/notifications/{notificationId}
  - userId: string
  - title: string
  - message: string
  - type: string
  - isRead: boolean
  - createdAt: timestamp
```

## 🔒 **Security Rules**

### **Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Orders - users can read/write their own
    match /orders/{orderId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Cart - users can read/write their own
    match /cart/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### **Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📱 **Features to Implement**

1. **Authentication**
   - Phone OTP (Firebase Auth)
   - Social login (Google, Facebook)
   - Anonymous auth for guests

2. **Real-time Features**
   - Live order tracking
   - Real-time inventory updates
   - Live chat support

3. **Push Notifications**
   - Order status updates
   - Delivery notifications
   - Promotional messages

4. **Offline Support**
   - Offline product browsing
   - Offline cart management
   - Sync when online

5. **Analytics**
   - User behavior tracking
   - Conversion analytics
   - Custom events

## 🚀 **Migration Benefits**

✅ **No Server Management**  
✅ **Real-time Updates**  
✅ **Automatic Scaling**  
✅ **Built-in Security**  
✅ **Offline Support**  
✅ **Cross-platform**  
✅ **Cost Effective**  
✅ **Analytics Included**  

## 📋 **Next Steps**

1. Create Firebase project
2. Install Firebase SDK
3. Migrate authentication
4. Set up Firestore database
5. Update frontend components
6. Add real-time features
7. Deploy to Firebase Hosting
