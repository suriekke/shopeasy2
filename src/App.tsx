import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import './App.css'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Login />
      </div>
    </AuthProvider>
  )
}

export default App
