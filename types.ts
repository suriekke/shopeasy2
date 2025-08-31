export interface Review {
    id: number;
    author: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  longDescription?: string;
  details?: string[];
  reviews?: Review[];
  price: number;
  originalPrice?: number;
  image: string;
  category: 'Cafe' | 'Home' | 'Toys' | 'Fresh' | 'Electronics' | 'Beauty' | 'Fashion' | 'Snacks';
  subCategory: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  name:string;
  icon: string;
}

export interface SubCategory {
    name: string;
    image: string;
}

export type OrderStatus = 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  estimatedDelivery: string;
}

export type RefundStatus = 'Processing' | 'Completed';

export interface Refund {
  id: string;
  orderId: string;
  amount: number;
  status: RefundStatus;
  date: string;
}

export interface GiftCardTransaction {
  id: string;
  type: 'added' | 'spent';
  amount: number;
  date: string;
  description: string;
}

export interface GiftCard {
  id: string;
  code: string;
  balance: number;
  expiryDate: string;
  transactions: GiftCardTransaction[];
}

export interface Location {
    address: string;
    deliveryTime: string;
}

export interface Address {
    id: string;
    type: 'Home' | 'Work' | 'Other';
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
}

export type PaymentMethodType = 'Credit Card' | 'UPI';

export interface PaymentMethod {
    id: string;
    type: PaymentMethodType;
    provider: string; // 'Visa', 'Mastercard', 'Google Pay'
    last4: string;
    expiry?: string;
}

export interface Reward {
    id: string;
    title: string;
    description: string;
    code: string;
    expiryDate: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
}

export interface UserProfile {
    name: string;
    phoneNumber: string;
    avatar: string;
    password?: string;
}


export type View = 'HOME' | 'CHECKOUT' | 'SUCCESS' | 'PROFILE' | 'WISHLIST' | 'ORDERS' | 'GIFT_CARDS' | 'REFUNDS' | 'SAVED_ADDRESSES' | 'REWARDS' | 'PAYMENT_MANAGEMENT' | 'SUGGEST_PRODUCTS' | 'NOTIFICATIONS' | 'GENERAL_INFO' | 'PRODUCT_DETAIL' | 'INFO_PAGE' | 'ANALYTICS';