import React, { useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

const Dashboard: React.FC = () => {
  const { products, orders, users, setProducts, setOrders, setUsers, setLoading } = useStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch products
      setLoading('products', true);
      const { data: productsData } = await supabase
        .from('groceries')
        .select('*');
      setProducts(productsData || []);

      // Fetch orders (mock data for now)
      setLoading('orders', true);
      const mockOrders = [
        { id: 1, user_id: '1', products: [], total_amount: 1500, status: 'pending', created_at: new Date().toISOString() },
        { id: 2, user_id: '2', products: [], total_amount: 2300, status: 'delivered', created_at: new Date().toISOString() },
      ];
      setOrders(mockOrders);

      // Fetch users (mock data for now)
      setLoading('users', true);
      const mockUsers = [
        { id: '1', email: 'user1@example.com', phone: '+1234567890', name: 'John Doe', created_at: new Date().toISOString() },
        { id: '2', email: 'user2@example.com', phone: '+0987654321', name: 'Jane Smith', created_at: new Date().toISOString() },
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading('products', false);
      setLoading('orders', false);
      setLoading('users', false);
    }
  };

  const stats = [
    {
      name: 'Total Revenue',
      value: `₹${orders.reduce((sum, order) => sum + order.total_amount, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      name: 'Total Products',
      value: products.length.toString(),
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Orders',
      value: orders.length.toString(),
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Users',
      value: users.length.toString(),
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  const lowStockProducts = products.filter(product => product.stock_quantity < 50);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your ShopEasy admin dashboard</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity and alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          </div>
          <div className="p-6">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">₹{order.total_amount}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Low Stock Alerts</h3>
          </div>
          <div className="p-6">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.stock_quantity} {product.unit} remaining</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No low stock alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



