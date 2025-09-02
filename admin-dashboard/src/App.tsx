import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>
        🎉 Admin Dashboard is Working!
      </h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
        If you can see this, the React app is loading correctly.
      </p>
      <div style={{ 
        margin: '20px auto', 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        maxWidth: '400px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>Test Content</h2>
        <p>This is a test to see if the basic React rendering is working.</p>
        <button 
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => alert('Button click works!')}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}

export default App;
