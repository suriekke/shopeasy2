import React, { useState } from 'react';
import OTPLoginPage from './pages/OTPLoginPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <OTPLoginPage onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🎉 Welcome to ShopEasy Admin Dashboard!
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
          <p className="text-gray-600">
            You are now logged in! This is the admin dashboard.
          </p>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;





