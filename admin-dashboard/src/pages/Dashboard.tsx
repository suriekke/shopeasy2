import React from 'react';
import { TrendingUp, Users, Package, ShoppingCart, DollarSign, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Dashboard: React.FC = () => {
  // Mock data - replace with real data from your API
  const stats = [
    {
      title: 'Total Revenue',
      value: '₹45,231',
      change: '+20.1%',
      changeType: 'positive',
      icon: DollarSign,
      description: 'From last month'
    },
    {
      title: 'Total Orders',
      value: '2,350',
      change: '+180.1%',
      changeType: 'positive',
      icon: ShoppingCart,
      description: 'From last month'
    },
    {
      title: 'Active Products',
      value: '573',
      change: '+19%',
      changeType: 'positive',
      icon: Package,
      description: 'From last month'
    },
    {
      title: 'Total Customers',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      description: 'From last month'
    }
  ];

  const recentOrders = [
    { id: '1', customer: 'John Doe', product: 'iPhone 15', amount: '₹89,999', status: 'Delivered' },
    { id: '2', customer: 'Jane Smith', product: 'MacBook Pro', amount: '₹1,49,999', status: 'Processing' },
    { id: '3', customer: 'Mike Johnson', product: 'AirPods Pro', amount: '₹24,999', status: 'Shipped' },
    { id: '4', customer: 'Sarah Wilson', product: 'iPad Air', amount: '₹59,999', status: 'Delivered' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard. Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className={`h-3 w-3 mr-1 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-600">{order.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{order.amount}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-blue-600" />
              Add Product
            </CardTitle>
            <CardDescription>Create a new product listing</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-600" />
              View Customers
            </CardTitle>
            <CardDescription>Manage your customer base</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-600" />
              Analytics
            </CardTitle>
            <CardDescription>View detailed reports</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

