import React, { useState } from 'react';
import OTPLoginPage from './pages/OTPLoginPage';

interface UserData {
  phone_number: string;
  verified: boolean;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLoginSuccess = (userData: UserData) => {
    setUserData(userData);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <OTPLoginPage onSuccess={handleLoginSuccess} />;
  }

  // Simple dashboard after login
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>
        🎉 Login Successful!
      </h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
        Welcome, {userData?.phone_number}!
      </p>
      <div style={{ 
        margin: '20px auto', 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        maxWidth: '400px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>Simple Dashboard</h2>
        <p>This is a basic dashboard after login.</p>
        <button 
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => {
            setIsLoggedIn(false);
            setUserData(null);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;
