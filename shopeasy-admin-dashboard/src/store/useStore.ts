import { create } from 'zustand';
import { Product, Order, User, DeliveryPartner } from '../lib/supabase';

interface AdminStore {
  // Auth
  isAuthenticated: boolean;
  user: any | null;
  
  // Data
  products: Product[];
  orders: Order[];
  users: User[];
  deliveryPartners: DeliveryPartner[];
  
  // Loading states
  loading: {
    products: boolean;
    orders: boolean;
    users: boolean;
    deliveryPartners: boolean;
  };
  
  // Actions
  setAuthenticated: (auth: boolean, user?: any) => void;
  setProducts: (products: Product[]) => void;
  setOrders: (orders: Order[]) => void;
  setUsers: (users: User[]) => void;
  setDeliveryPartners: (partners: DeliveryPartner[]) => void;
  setLoading: (key: keyof AdminStore['loading'], loading: boolean) => void;
}

export const useStore = create<AdminStore>((set) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  products: [],
  orders: [],
  users: [],
  deliveryPartners: [],
  loading: {
    products: false,
    orders: false,
    users: false,
    deliveryPartners: false,
  },
  
  // Actions
  setAuthenticated: (auth, user) => set({ isAuthenticated: auth, user }),
  setProducts: (products) => set({ products }),
  setOrders: (orders) => set({ orders }),
  setUsers: (users) => set({ users }),
  setDeliveryPartners: (deliveryPartners) => set({ deliveryPartners }),
  setLoading: (key, loading) => set((state) => ({
    loading: { ...state.loading, [key]: loading }
  })),
}));

