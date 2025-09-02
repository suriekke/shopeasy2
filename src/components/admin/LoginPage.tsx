import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await onLogin();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">ShopEasy Admin</h2>
            <p className="mt-2 text-gray-600">Access your admin dashboard</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Use the default admin credentials to login
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <p className="font-medium text-gray-900">Email: admin@shopeasy.com</p>
                <p className="font-medium text-gray-900">Password: admin123</p>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in to Admin Dashboard'
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              ShopEasy Quick Commerce Admin Panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;






