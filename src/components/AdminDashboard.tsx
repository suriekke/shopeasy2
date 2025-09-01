import React, { useState, useEffect } from 'react';
import { adminAuth, AdminUser } from '../services/adminAuth';
import { firestoreService } from '../services/firestoreService';
import Sidebar from './admin/Sidebar';
import Header from './admin/Header';
import Dashboard from './admin/Dashboard';
import ProductsPage from './admin/ProductsPage';
import OrdersPage from './admin/OrdersPage';
import UsersPage from './admin/UsersPage';
import DeliveryPartnersPage from './admin/DeliveryPartnersPage';
import AnalyticsPage from './admin/AnalyticsPage';
import LoginPage from './admin/LoginPage';

type Page = 'dashboard' | 'products' | 'orders' | 'users' | 'delivery-partners' | 'analytics';

const AdminDashboard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const unsubscribe = adminAuth.onAuthStateChanged(async (user) => {
      if (user) {
        const isAdmin = await adminAuth.isAdmin(user.uid);
        if (isAdmin) {
          setCurrentUser({
            uid: user.uid,
            email: user.email || '',
            role: 'admin',
            name: 'ShopEasy Admin'
          });
        } else {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const user = await adminAuth.loginAsAdmin();
    setCurrentUser(user);
    setLoading(false);
  };

  const handleLogout = async () => {
    await adminAuth.signOut();
    setCurrentUser(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'users':
        return <UsersPage />;
      case 'delivery-partners':
        return <DeliveryPartnersPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <Header 
          user={currentUser}
          onLogout={handleLogout}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Page Content */}
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;



