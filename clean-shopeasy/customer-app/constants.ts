
import { Product, Category, SubCategory, Order, Refund, GiftCard, Address, Reward, PaymentMethod, Notification } from './types';

export const CATEGORIES: Category[] = [
    { name: 'All', icon: '🛍️' },
    { name: 'Cafe', icon: '☕' },
    { name: 'Home', icon: '🏠' },
    { name: 'Toys', icon: '🧸' },
    { name: 'Fresh', icon: '🥦' },
    { name: 'Electronics', icon: '🔌' },
    { name: 'Mobiles', icon: '📱' },
    { name: 'Beauty', icon: '💄' },
    { name: 'Fashion', icon: '👗' },
];

export const SUB_CATEGORIES: SubCategory[] = [
    { name: 'Fruits & Vegetables', image: 'https://picsum.photos/id/1080/200/200' },
    { name: 'Atta, Rice, Oil & Dals', image: 'https://picsum.photos/id/312/200/200' },
    { name: 'Masala & Dry Fruits', image: 'https://picsum.photos/id/431/200/200' },
    { name: 'Zepto Cafe', image: 'https://picsum.photos/id/225/200/200' },
    { name: 'Sweet Cravings', image: 'https://picsum.photos/id/1074/200/200' },
    { name: 'Toys & Sports', image: 'https://picsum.photos/id/1073/200/200' },
    { name: 'Apparel & Lifestyle', image: 'https://picsum.photos/id/1025/200/200' },
    { name: 'Jewellery & Accessories', image: 'https://picsum.photos/id/1027/200/200' },
    { name: 'Frozen Food', image: 'https://picsum.photos/id/1084/200/200' },
    { name: 'Ice Creams & More', image: 'https://picsum.photos/id/219/200/200' },
    { name: 'Packaged Food', image: 'https://picsum.photos/id/292/200/200' },
];

export const PRODUCTS: Product[] = [
  // Cafe
  { 
    id: 1, 
    name: 'Iced Vanilla Latte', 
    description: '12 oz • Whole Milk', 
    price: 5.50, 
    image: 'https://picsum.photos/id/225/400/400', 
    category: 'Cafe', 
    subCategory: 'Zepto Cafe',
    longDescription: 'A refreshing blend of bold espresso, creamy whole milk, and sweet vanilla syrup, served over ice. The perfect pick-me-up for a warm day or a sluggish afternoon. Customizable with your choice of milk and extra espresso shots.',
    details: [
        'Size: 12 fluid ounces',
        'Milk: Whole Milk (default)',
        'Calories: Approx. 190',
        'Contains: Espresso, Milk, Vanilla Syrup, Ice'
    ],
    reviews: [
        { id: 1, author: 'Jane D.', rating: 5, comment: 'Absolutely perfect! Not too sweet.', date: '2024-07-20' },
        { id: 2, author: 'Mike P.', rating: 4, comment: 'Really good, but I wish it was a bit stronger.', date: '2024-07-18' }
    ]
  },
  { id: 2, name: 'Espresso Macchiato', description: '3 oz • Bold', price: 3.25, image: 'https://picsum.photos/id/30/400/400', category: 'Cafe', subCategory: 'Zepto Cafe' },
  { id: 3, name: 'Croissant', description: 'Freshly baked', price: 2.75, image: 'https://picsum.photos/id/366/400/400', category: 'Cafe', subCategory: 'Zepto Cafe' },
  // Home
  { id: 4, name: 'Kitchen Sponge Set', description: 'Pack of 5', price: 4.00, image: 'https://picsum.photos/id/40/400/400', category: 'Home', subCategory: 'Cleaning' },
  { id: 5, name: 'Ceramic Dinner Plate', description: '10-inch diameter', price: 12.00, image: 'https://picsum.photos/id/988/400/400', category: 'Home', subCategory: 'Kitchenware' },
  // Toys
  { 
    id: 6, 
    name: 'Building Blocks', 
    description: '100 pieces', 
    price: 25.00, 
    image: 'https://picsum.photos/id/1073/400/400', 
    category: 'Toys', 
    subCategory: 'Toys & Sports',
    longDescription: 'A classic set of 100 colorful wooden building blocks. Perfect for sparking creativity and developing fine motor skills in children aged 3 and up. Comes in a sturdy storage bucket with a lid.',
    details: [
        'Pieces: 100',
        'Material: Wood (non-toxic paint)',
        'Recommended Age: 3+',
        'Includes: Storage Bucket'
    ],
    reviews: [
        { id: 1, author: 'Sarah K.', rating: 5, comment: 'My kids love these blocks! They play with them for hours.', date: '2024-06-15' },
        { id: 2, author: 'Tom H.', rating: 5, comment: 'Great quality and vibrant colors. Highly recommend.', date: '2024-05-22' },
        { id: 3, author: 'Emily R.', rating: 4, comment: 'Good set, just wish there were more unique shapes.', date: '2024-05-10' }
    ]
  },
  // Snacks
  { id: 7, name: 'Cheetos Masala Balls', description: '1 pack (28 g)', price: 10, image: 'https://picsum.photos/id/1074/400/400', category: 'Snacks', subCategory: 'Sweet Cravings' },
  { id: 8, name: 'Cheetos Cheese Puffs', description: '1 pack (28 g)', price: 10, image: 'https://picsum.photos/id/25/400/400', category: 'Snacks', subCategory: 'Sweet Cravings' },
  { id: 9, name: 'Kurkure Yummy PuffCorn', description: '1 pack (52 g)', price: 20, image: 'https://picsum.photos/id/342/400/400', category: 'Snacks', subCategory: 'Sweet Cravings' },
  // Fresh
  { id: 10, name: 'Fresh Apples', description: '1 kg', price: 2.50, image: 'https://picsum.photos/id/1080/400/400', category: 'Fresh', subCategory: 'Fruits & Vegetables' },
  { id: 11, name: 'Organic Spinach', description: '250 g', price: 1.75, image: 'https://picsum.photos/id/1066/400/400', category: 'Fresh', subCategory: 'Fruits & Vegetables' },
  // Electronics
  { id: 12, name: 'Wireless Mouse', description: 'Ergonomic design', price: 18.50, image: 'https://picsum.photos/id/0/400/400', category: 'Electronics', subCategory: 'Accessories' },
  // Beauty
  { id: 13, name: 'Red Lipstick', description: 'Matte Finish', price: 15.00, image: 'https://picsum.photos/id/1027/400/400', category: 'Beauty', subCategory: 'Makeup' },
  // Fashion
  { id: 14, name: 'Cotton T-Shirt', description: 'Blue, Size M', price: 22.00, image: 'https://picsum.photos/id/1025/400/400', category: 'Fashion', subCategory: 'Apparel & Lifestyle' },
];

export const ORDERS: Order[] = [
    {
        id: 'ORDER-987654',
        date: '2024-07-20',
        items: [
            { id: 10, name: 'Fresh Apples', quantity: 2, price: 2.50, image: 'https://picsum.photos/id/1080/400/400' },
            { id: 11, name: 'Organic Spinach', quantity: 1, price: 1.75, image: 'https://picsum.photos/id/1066/400/400' },
        ],
        status: 'Delivered',
        total: 6.75,
        estimatedDelivery: 'Delivered on Jul 20, 2024',
    },
    {
        id: 'ORDER-123456',
        date: '2024-07-21',
        items: [
            { id: 1, name: 'Iced Vanilla Latte', quantity: 1, price: 5.50, image: 'https://picsum.photos/id/225/400/400' },
            { id: 3, name: 'Croissant', quantity: 2, price: 2.75, image: 'https://picsum.photos/id/366/400/400' },
        ],
        status: 'Out for Delivery',
        total: 11.00,
        estimatedDelivery: 'Today, by 8:00 PM',
    },
    {
        id: 'ORDER-789012',
        date: '2024-07-21',
        items: [
            { id: 7, name: 'Cheetos Masala Balls', quantity: 5, price: 10, image: 'https://picsum.photos/id/1074/400/400' },
            { id: 14, name: 'Cotton T-Shirt', quantity: 1, price: 22.00, image: 'https://picsum.photos/id/1025/400/400' },
        ],
        status: 'Processing',
        total: 72.00,
        estimatedDelivery: 'Tomorrow, 10:00 AM - 12:00 PM',
    }
];

export const REFUNDS: Refund[] = [
    {
        id: 'REF-001',
        orderId: 'ORDER-987654',
        amount: 6.75,
        status: 'Completed',
        date: '2024-07-22',
    },
    {
        id: 'REF-002',
        orderId: 'ORDER-789012-CANCELLED',
        amount: 72.00,
        status: 'Processing',
        date: '2024-07-23',
    }
];

export const GIFT_CARDS: GiftCard[] = [
    {
        id: 'GC-001',
        code: 'XXXX-XXXX-XXXX-1234',
        balance: 50.00,
        expiryDate: '2025-12-31',
        transactions: [
            { id: 'TXN-GC1-1', type: 'added', amount: 100.00, date: '2024-07-01', description: 'Added from promotional offer' },
            { id: 'TXN-GC1-2', type: 'spent', amount: 50.00, date: '2024-07-15', description: 'Used on order #ORDER-555555' },
        ]
    }
];

export const SAVED_ADDRESSES: Address[] = [
    {
        id: 'ADDR-001',
        type: 'Home',
        line1: '42, Wallaby Way',
        city: 'Sydney',
        state: 'NSW',
        zip: '2000'
    },
    {
        id: 'ADDR-002',
        type: 'Work',
        line1: '1, Infinite Loop',
        city: 'Cupertino',
        state: 'CA',
        zip: '95014'
    }
];

export const REWARDS: Reward[] = [
    {
        id: 'REW-001',
        title: '20% off your next order',
        description: 'Valid on orders above $50. Max discount $20.',
        code: 'EASY20',
        expiryDate: '2024-12-31'
    },
    {
        id: 'REW-002',
        title: 'Free Delivery',
        description: 'Get free delivery on your next 3 orders.',
        code: 'FREEDEL',
        expiryDate: '2024-10-31'
    }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 'PM-001',
        type: 'Credit Card',
        provider: 'Visa',
        last4: '4242',
        expiry: '12/26'
    },
    {
        id: 'PM-002',
        type: 'UPI',
        provider: 'Google Pay',
        last4: 'ananya@okbank'
    }
];

export const NOTIFICATIONS: Notification[] = [
    {
        id: 'NOTIF-001',
        title: 'Order Delivered!',
        message: 'Your order #ORDER-987654 has been successfully delivered.',
        date: '2024-07-20',
        read: true,
    },
    {
        id: 'NOTIF-002',
        title: 'Special Offer Just for You',
        message: 'Use code EASY20 to get 20% off your next order. Don\'t miss out!',
        date: '2024-07-22',
        read: true,
    },
    {
        id: 'NOTIF-003',
        title: 'Your Order is Out for Delivery',
        message: 'Get ready! Your order #ORDER-123456 will arrive soon.',
        date: '2024-07-23',
        read: false,
    },
];