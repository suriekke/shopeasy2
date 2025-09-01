import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone, Smartphone, Shield, ArrowRight, Home, Package, ShoppingCart, Users, Settings, LogOut, Plus, Edit, Trash2, Search, Filter } from 'lucide-react'
import './App.css'

// Mock data
const mockProducts = [
  { id: 1, name: 'iPhone 15 Pro', price: 999, stock: 50, category: 'Electronics' },
  { id: 2, name: 'MacBook Air', price: 1299, stock: 25, category: 'Electronics' },
  { id: 3, name: 'Nike Shoes', price: 89, stock: 100, category: 'Fashion' },
]

const mockOrders = [
  { id: 1, customer: 'John Doe', total: 999, status: 'Delivered', date: '2024-01-15' },
  { id: 2, customer: 'Jane Smith', total: 1299, status: 'Processing', date: '2024-01-16' },
  { id: 3, customer: 'Bob Johnson', total: 89, status: 'Pending', date: '2024-01-17' },
]

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Customer', status: 'Inactive' },
]

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState(mockProducts)
  const [orders, setOrders] = useState(mockOrders)
  const [users, setUsers] = useState(mockUsers)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  // Login states
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'social'>('email')
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpStep, setOtpStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsAuthenticated(true)
      setCurrentUser({ name: fullName || email, email })
      setSuccess('Login successful!')
    } catch (error: any) {
      setError('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (otpStep === 'phone') {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setOtpStep('otp')
        setSuccess('OTP sent successfully!')
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsAuthenticated(true)
        setCurrentUser({ name: `User ${phone}`, phone })
        setSuccess('Login successful!')
      }
    } catch (error: any) {
      setError('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsAuthenticated(true)
      setCurrentUser({ name: 'Google User', email: 'google@example.com' })
      setSuccess('Google sign-in successful!')
    } catch (error: any) {
      setError('Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setActiveTab('dashboard')
  }

  const addProduct = (product: any) => {
    setProducts([...products, { ...product, id: products.length + 1 }])
    setShowAddModal(false)
  }

  const editProduct = (product: any) => {
    setProducts(products.map(p => p.id === product.id ? product : p))
    setEditingItem(null)
  }

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFullName('')
    setPhone('')
    setOtp('')
    setOtpStep('phone')
    setError('')
    setSuccess('')
    setShowPassword(false)
  }

  const handleMethodChange = (method: 'email' | 'phone' | 'social') => {
    setAuthMethod(method)
    resetForm()
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">🛍️ ShopEasy Admin</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {currentUser?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-sm min-h-screen">
            <nav className="mt-8">
              <div className="px-4 space-y-2">
                {[
                  { id: 'dashboard', name: 'Dashboard', icon: Home },
                  { id: 'products', name: 'Products', icon: Package },
                  { id: 'orders', name: 'Orders', icon: ShoppingCart },
                  { id: 'users', name: 'Users', icon: Users },
                  { id: 'settings', name: 'Settings', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-pink-50 text-pink-700 border-r-2 border-pink-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Products</p>
                        <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <ShoppingCart className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <span className="text-2xl">💰</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                          <div>
                            <p className="font-medium text-gray-900">{order.customer}</p>
                            <p className="text-sm text-gray-600">Order #{order.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">${order.total}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-gray-900">Products</h2>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <div className="space-y-4">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.category}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-900">${product.price}</span>
                            <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                            <button
                              onClick={() => setEditingItem(product)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="p-2 text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
                
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                          <div>
                            <p className="font-medium text-gray-900">{order.customer}</p>
                            <p className="text-sm text-gray-600">Order #{order.id} • {order.date}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-medium text-gray-900">${order.total}</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Users</h2>
                
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
                
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                          <input
                            type="text"
                            defaultValue="ShopEasy"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            defaultValue="admin@shopeasy.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500">
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t">
                      <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🛍️</h1>
          <h2 className="text-3xl font-extrabold text-gray-900">
            ShopEasy
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-200">
          
          {/* Auth Method Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleMethodChange('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                  authMethod === 'email'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
              <button
                onClick={() => handleMethodChange('phone')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                  authMethod === 'phone'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Phone</span>
              </button>
              <button
                onClick={() => handleMethodChange('social')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                  authMethod === 'social'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Social</span>
              </button>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg border border-green-200">
              {success}
            </div>
          )}

          {/* Email/Password Form */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required={!isLogin}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                    <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <Lock className="absolute right-10 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {isLogin ? 'Sign in' : 'Sign up'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Phone OTP Form */}
          {authMethod === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              {otpStep === 'phone' ? (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                      maxLength={10}
                    />
                    <Phone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send you a verification code
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      OTP sent to {phone}
                    </p>
                    <button
                      type="button"
                      onClick={() => setOtpStep('phone')}
                      className="text-pink-600 text-sm hover:text-pink-700 underline"
                    >
                      Change number
                    </button>
                  </div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <div className="relative">
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-center text-lg tracking-widest"
                      placeholder="Enter OTP"
                      maxLength={6}
                    />
                    <Smartphone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {otpStep === 'phone' ? 'Send OTP' : 'Verify OTP'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Social Login */}
          {authMethod === 'social' && (
            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  More social login options coming soon...
                </p>
              </div>
            </div>
          )}

          {/* Toggle Login/Signup */}
          {authMethod !== 'social' && (
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  resetForm()
                }}
                className="text-pink-600 hover:text-pink-500 text-sm font-medium transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
