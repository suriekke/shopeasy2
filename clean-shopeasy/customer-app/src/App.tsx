import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { MapPin, Search, ShoppingCart, User, Phone, ArrowRight, Star, Heart, Minus, Plus } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  short_description?: string
  price: number
  original_price: number
  image_url: string
  unit: string
  discount_percentage: number
  is_featured: boolean
  category_id: string
  brand?: string
  average_rating?: number
  review_count?: number
}

interface Category {
  id: string
  name: string
  description: string
  icon: string
  image_url: string
  sort_order: number
}

function App() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [showCart, setShowCart] = useState(false)
  const [location, setLocation] = useState('Deliver to: Home')
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from backend API...')
      
      const response = await fetch('http://localhost:5000/api/products?featured=true&limit=50')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        console.log('Products fetched successfully:', result.data)
        console.log('Number of products:', result.data?.length || 0)
        if (result.data && result.data.length > 0) {
          console.log('First product:', result.data[0])
        }
        setProducts(result.data || [])
      } else {
        throw new Error(result.error || 'Failed to fetch products')
      }
    } catch (error) {
      console.error('Exception fetching products:', error)
      alert('Exception fetching products: ' + error.message)
    }
  }

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories from backend API...')
      
      const response = await fetch('http://localhost:5000/api/categories?active=true')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        console.log('Categories fetched successfully:', result.data)
        console.log('Number of categories:', result.data?.length || 0)
        if (result.data && result.data.length > 0) {
          console.log('First category:', result.data[0])
        }
        setCategories(result.data || [])
      } else {
        throw new Error(result.error || 'Failed to fetch categories')
      }
    } catch (error) {
      console.error('Exception fetching categories:', error)
      alert('Exception fetching categories: ' + error.message)
    }
  }

  const sendOTP = async () => {
    if (!phone || phone.length < 10) {
      alert('Please enter a valid phone number')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: `+91${phone}` }),
      })

      if (response.ok) {
        setShowOtpInput(true)
        alert('OTP sent successfully!')
      } else {
        alert('Failed to send OTP')
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      alert('Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: `+91${phone}`, otp }),
      })

      if (response.ok) {
        setIsLoggedIn(true)
        alert('Login successful!')
      } else {
        alert('Invalid OTP')
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      alert('Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'temp-user-id', // Replace with actual user ID when auth is implemented
          product_id: productId,
          quantity: 1
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }

      const result = await response.json()
      
      if (result.success) {
        setCart(prev => ({
          ...prev,
          [productId]: (prev[productId] || 0) + 1
        }))
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add item to cart')
    }
  }

  const removeFromCart = async (productId: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'temp-user-id', // Replace with actual user ID when auth is implemented
          product_id: productId,
          quantity: (cart[productId] || 1) - 1
        })
      })

      if (!response.ok) {
        throw new Error('Failed to remove from cart')
      }

      const result = await response.json()
      
      if (result.success) {
        setCart(prev => {
          const newCart = { ...prev }
          if (newCart[productId] > 1) {
            newCart[productId] -= 1
          } else {
            delete newCart[productId]
          }
          return newCart
        })
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      alert('Failed to remove item from cart')
    }
  }

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId)
      return total + (product ? product.price * quantity : 0)
    }, 0)
  }

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-600 mb-2">ShopEasy</h1>
            <p className="text-gray-600">Login with your phone number</p>
          </div>

          {!showOtpInput ? (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-green-500 focus:border-green-500 text-sm border border-gray-300"
                    maxLength={10}
                  />
                </div>
              </div>
              <button
                onClick={sendOTP}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                  maxLength={6}
                />
              </div>
              <button
                onClick={verifyOTP}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 mb-2"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                onClick={() => setShowOtpInput(false)}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">ShopEasy</h1>
            </div>

            {/* Location */}
            <div className="flex-1 max-w-md mx-8">
              <button
                onClick={() => setShowLocationModal(true)}
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{location}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Cart */}
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 text-gray-600 hover:text-green-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>

            {/* Account */}
            <div className="relative">
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="p-2 text-gray-600 hover:text-green-600"
              >
                <User className="h-6 w-6" />
              </button>
              {showAccountDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Payments</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Gift Cards</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Customer Support</a>
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`flex flex-col items-center space-y-2 min-w-max ${
                  selectedCategory === category.id ? 'text-green-600' : 'text-gray-600'
                }`}
              >
                <div className="text-2xl">{category.icon}</div>
                <span className="text-xs">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="relative mb-4">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                    <Heart className="h-5 w-5" />
                  </button>
                  {product.discount_percentage > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      {product.discount_percentage}% OFF
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.unit}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    {product.original_price > product.price && (
                      <span className="text-sm text-gray-500 line-through">₹{product.original_price}</span>
                    )}
                  </div>
                                  <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{product.average_rating || 4.5}</span>
                  <span className="text-sm text-gray-500 ml-1">({product.review_count || 0})</span>
                </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {cart[product.id] ? (
                      <>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-medium">{cart[product.id]}</span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => addToCart(product.id)}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-sm font-medium"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Your Cart</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            {Object.keys(cart).length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <div>
                {Object.entries(cart).map(([productId, quantity]) => {
                  const product = products.find(p => p.id === productId)
                  if (!product) return null
                  return (
                    <div key={productId} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-500">₹{product.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => removeFromCart(productId)}
                          className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center">{quantity}</span>
                        <button
                          onClick={() => addToCart(productId)}
                          className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )
                })}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">₹{getCartTotal()}</span>
                  </div>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Select Location</h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setLocation('Deliver to: Home')
                  setShowLocationModal(false)
                }}
                className="w-full text-left p-3 border rounded-md hover:bg-gray-50"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setLocation('Deliver to: Office')
                  setShowLocationModal(false)
                }}
                className="w-full text-left p-3 border rounded-md hover:bg-gray-50"
              >
                Office
              </button>
              <button
                onClick={() => {
                  setLocation('Deliver to: Other')
                  setShowLocationModal(false)
                }}
                className="w-full text-left p-3 border rounded-md hover:bg-gray-50"
              >
                Other
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
