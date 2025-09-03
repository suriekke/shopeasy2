import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'

// Components
import Header from './components/Header'
import Footer from './components/Footer'
import LoginModal from './components/LoginModal'

// Pages
import HomePage from './pages/HomePage'
import AdminDashboard from './pages/AdminDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import ProductsPage from './pages/ProductsPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'

// Types
interface User {
  id: string
  email?: string
  phone?: string
  role: 'admin' | 'customer'
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check user session on app load
  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // Check if user exists in our database
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            phone: userData.phone,
            role: userData.role
          })
        }
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (phone: string, otp: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: otp,
        type: 'sms'
      })

      if (error) throw error

      // Check user role in database
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('phone', `+91${phone}`)
        .single()

      if (userData) {
        setUser({
          id: userData.id,
          phone: userData.phone,
          role: userData.role
        })
        setShowLoginModal(false)
      } else {
        // Create new user as customer
        const { data: newUser } = await supabase
          .from('users')
          .insert([{
            id: data.user?.id,
            phone: `+91${phone}`,
            role: 'customer'
          }])
          .select()
          .single()

        if (newUser) {
          setUser({
            id: newUser.id,
            phone: newUser.phone,
            role: newUser.role
          })
          setShowLoginModal(false)
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading ShopEasy...</div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header 
          user={user} 
          onLogin={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />
        
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/admin/*" 
              element={
                user?.role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            
            <Route 
              path="/customer/*" 
              element={
                user ? (
                  <CustomerDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                user ? (
                  <ProfilePage user={user} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            
            <Route 
              path="/orders" 
              element={
                user ? (
                  <OrdersPage user={user} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
        </main>

        <Footer />
        
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    </Router>
  )
}

export default App

