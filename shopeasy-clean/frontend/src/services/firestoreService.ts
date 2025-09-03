import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  Timestamp, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: Timestamp;
}

export const firestoreService = {
  // Products
  async getProducts(): Promise<Product[]> {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  },

  async getProduct(id: string): Promise<Product | null> {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  },

  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      return null;
    }
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'products', id), {
        ...product,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'products', id));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  },

  async getOrder(id: string): Promise<Order | null> {
    const docRef = doc(db, 'orders', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'orders', id), {
        status,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  },

  // Users
  async getUsers(): Promise<User[]> {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User));
  },

  async getUser(id: string): Promise<User | null> {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  },

  async updateUser(id: string, user: Partial<User>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'users', id), user);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  },

  // Delivery Partners
  async getDeliveryPartners(): Promise<DeliveryPartner[]> {
    const querySnapshot = await getDocs(collection(db, 'deliveryPartners'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as DeliveryPartner));
  },

  async updateDeliveryPartnerStatus(id: string, isApproved: boolean): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'deliveryPartners', id), {
        isApproved,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating delivery partner status:', error);
      return false;
    }
  },

  // Analytics
  async getAnalytics() {
    const [products, orders, users, deliveryPartners] = await Promise.all([
      this.getProducts(),
      this.getOrders(),
      this.getUsers(),
      this.getDeliveryPartners()
    ]);

    const totalRevenue = orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.total, 0);

    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const activeUsers = users.length;
    const totalProducts = products.length;
    const approvedPartners = deliveryPartners.filter(partner => partner.isApproved).length;

    return {
      totalRevenue,
      pendingOrders,
      activeUsers,
      totalProducts,
      approvedPartners,
      recentOrders: orders.slice(0, 5)
    };
  },

  // Real-time listeners
  onProductsSnapshot(callback: (products: Product[]) => void) {
    return onSnapshot(collection(db, 'products'), (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      callback(products);
    });
  },

  onOrdersSnapshot(callback: (orders: Order[]) => void) {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
      callback(orders);
    });
  },

  onUsersSnapshot(callback: (users: User[]) => void) {
    return onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
      callback(users);
    });
  }
};
