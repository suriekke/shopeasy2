import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

interface Stats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: number
  lowStockProducts: number
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: 0,
    lowStockProducts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Fetch orders count and revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, created_at')

      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0
      const recentOrders = orders?.filter(order => {
        const orderDate = new Date(order.created_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return orderDate > weekAgo
      }).length || 0

      // Fetch users count
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      // Fetch low stock products
      const { data: lowStockProducts } = await supabase
        .from('products')
        .select('*')
        .lt('stock', 10)

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: orders?.length || 0,
        totalUsers: usersCount || 0,
        totalRevenue,
        recentOrders,
        lowStockProducts: lowStockProducts?.length || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase' as const,
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase' as const,
    },
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'increase' as const,
    },
    {
      name: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+23%',
      changeType: 'increase' as const,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`inline-flex items-center justify-center p-3 rounded-md ${stat.color} text-white`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.changeType === 'increase' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`ml-2 text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="ml-2 text-sm text-gray-500">from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {stats.recentOrders} new orders this week
                    </p>
                    <p className="text-sm text-gray-500">Orders placed in the last 7 days</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <Package className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {stats.lowStockProducts} products low in stock
                    </p>
                    <p className="text-sm text-gray-500">Products with stock less than 10</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Add New Product</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">View Recent Orders</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Manage Users</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
