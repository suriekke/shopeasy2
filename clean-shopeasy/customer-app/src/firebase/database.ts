import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  onSnapshot,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { db } from './config';

// Product interface
export interface Product {
  id?: string;
  name: string;
  description: string;
  longDescription?: string;
  details?: string[];
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subCategory: string;
  stock: number;
  isActive: boolean;
  rating?: number;
  reviews?: Review[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

// Order interface
export interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  deliveryAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  deliveryPartnerId?: string;
  trackingNumber?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

// Cart interface
export interface Cart {
  id?: string;
  userId: string;
  items: CartItem[];
  total: number;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Category interface
export interface Category {
  id?: string;
  name: string;
  icon: string;
  isActive: boolean;
  order: number;
}

// Address interface
export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}

// =====================================================
// PRODUCTS
// =====================================================

// Get all products
export const getProducts = async (filters?: {
  category?: string;
  subCategory?: string;
  isActive?: boolean;
  limit?: number;
}): Promise<Product[]> => {
  try {
    let q = collection(db, 'products');
    
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters?.subCategory) {
      q = query(q, where('subCategory', '==', filters.subCategory));
    }
    if (filters?.isActive !== undefined) {
      q = query(q, where('isActive', '==', filters.isActive));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error: any) {
    console.error('Error getting products:', error);
    throw new Error(error.message || 'Failed to get products');
  }
};

// Get product by ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Product;
    }
    return null;
  } catch (error: any) {
    console.error('Error getting product:', error);
    throw new Error(error.message || 'Failed to get product');
  }
};

// Add product
export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error: any) {
    console.error('Error adding product:', error);
    throw new Error(error.message || 'Failed to add product');
  }
};

// Update product
export const updateProduct = async (productId: string, updates: Partial<Product>): Promise<void> => {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    throw new Error(error.message || 'Failed to update product');
  }
};

// Delete product
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
  } catch (error: any) {
    console.error('Error deleting product:', error);
    throw new Error(error.message || 'Failed to delete product');
  }
};

// =====================================================
// CART
// =====================================================

// Get user cart
export const getUserCart = async (userId: string): Promise<Cart | null> => {
  try {
    const docRef = doc(db, 'cart', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Cart;
    }
    return null;
  } catch (error: any) {
    console.error('Error getting cart:', error);
    throw new Error(error.message || 'Failed to get cart');
  }
};

// Add item to cart
export const addToCart = async (userId: string, item: CartItem): Promise<void> => {
  try {
    const cartRef = doc(db, 'cart', userId);
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      const cartData = cartSnap.data() as Cart;
      const existingItemIndex = cartData.items.findIndex(i => i.productId === item.productId);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        cartData.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        cartData.items.push(item);
      }
      
      // Recalculate total
      cartData.total = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      cartData.updatedAt = new Date();
      
      await updateDoc(cartRef, cartData);
    } else {
      // Create new cart
      const newCart: Cart = {
        userId,
        items: [item],
        total: item.price * item.quantity,
        updatedAt: new Date()
      };
      await addDoc(collection(db, 'cart'), newCart);
    }
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    throw new Error(error.message || 'Failed to add to cart');
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (userId: string, productId: string, quantity: number): Promise<void> => {
  try {
    const cartRef = doc(db, 'cart', userId);
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      const cartData = cartSnap.data() as Cart;
      const itemIndex = cartData.items.findIndex(i => i.productId === productId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item
          cartData.items.splice(itemIndex, 1);
        } else {
          // Update quantity
          cartData.items[itemIndex].quantity = quantity;
        }
        
        // Recalculate total
        cartData.total = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartData.updatedAt = new Date();
        
        await updateDoc(cartRef, cartData);
      }
    }
  } catch (error: any) {
    console.error('Error updating cart:', error);
    throw new Error(error.message || 'Failed to update cart');
  }
};

// Remove item from cart
export const removeFromCart = async (userId: string, productId: string): Promise<void> => {
  await updateCartItemQuantity(userId, productId, 0);
};

// Clear cart
export const clearCart = async (userId: string): Promise<void> => {
  try {
    const cartRef = doc(db, 'cart', userId);
    await updateDoc(cartRef, {
      items: [],
      total: 0,
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    console.error('Error clearing cart:', error);
    throw new Error(error.message || 'Failed to clear cart');
  }
};

// =====================================================
// ORDERS
// =====================================================

// Create order
export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error: any) {
    console.error('Error creating order:', error);
    throw new Error(error.message || 'Failed to create order');
  }
};

// Get user orders
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error: any) {
    console.error('Error getting orders:', error);
    throw new Error(error.message || 'Failed to get orders');
  }
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Order;
    }
    return null;
  } catch (error: any) {
    console.error('Error getting order:', error);
    throw new Error(error.message || 'Failed to get order');
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    throw new Error(error.message || 'Failed to update order');
  }
};

// =====================================================
// CATEGORIES
// =====================================================

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const q = query(
      collection(db, 'categories'),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  } catch (error: any) {
    console.error('Error getting categories:', error);
    throw new Error(error.message || 'Failed to get categories');
  }
};

// =====================================================
// REAL-TIME LISTENERS
// =====================================================

// Listen to cart changes
export const listenToCart = (userId: string, callback: (cart: Cart | null) => void) => {
  const cartRef = doc(db, 'cart', userId);
  return onSnapshot(cartRef, (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data()
      } as Cart);
    } else {
      callback(null);
    }
  });
};

// Listen to order changes
export const listenToOrder = (orderId: string, callback: (order: Order | null) => void) => {
  const orderRef = doc(db, 'orders', orderId);
  return onSnapshot(orderRef, (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data()
      } as Order);
    } else {
      callback(null);
    }
  });
};

// Listen to product changes
export const listenToProducts = (callback: (products: Product[]) => void, filters?: {
  category?: string;
  isActive?: boolean;
}) => {
  let q = collection(db, 'products');
  
  if (filters?.category) {
    q = query(q, where('category', '==', filters.category));
  }
  if (filters?.isActive !== undefined) {
    q = query(q, where('isActive', '==', filters.isActive));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    callback(products);
  });
};
