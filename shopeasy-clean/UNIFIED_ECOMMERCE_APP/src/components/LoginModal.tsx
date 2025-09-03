import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Phone, Smartphone, X } from 'lucide-react'

interface LoginModalProps {
  onClose: () => void
  onLogin: (phone: string, otp: string) => void
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSendOtp = async () => {
    if (phoneNumber.length === 10) {
      setIsLoading(true)
      setError('')
      setSuccess('')
      
      try {
        // Use Supabase OTP - works everywhere!
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: `+91${phoneNumber}`,
          options: {
            shouldCreateUser: true
          }
        })
        
        if (error) {
          console.error('Supabase OTP Error:', error)
          setError('Failed to send OTP. Please try again.')
        } else {
          setShowOtpInput(true)
          setSuccess('OTP sent successfully! Check your phone.')
        }
      } catch (error) {
        console.error('Error sending OTP:', error)
        setError('Network error. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else {
      setError('Please enter a valid 10-digit mobile number')
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length === 6) {
      setIsLoading(true)
      setError('')
      
      try {
        await onLogin(phoneNumber, otp)
      } catch (error) {
        setError('Verification failed. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else {
      setError('Please enter a 6-digit OTP')
    }
  }

  const handleClose = () => {
    setPhoneNumber('')
    setOtp('')
    setShowOtpInput(false)
    setError('')
    setSuccess('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Login to ShopEasy</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {!showOtpInput ? (
          // Phone Number Form
          <div>
            <p className="text-gray-600 mb-4">Enter your phone number to receive OTP</p>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={10}
              />
            </div>
            
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            
            <button
              onClick={handleSendOtp}
              disabled={isLoading || phoneNumber.length !== 10}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Send OTP'
              )}
            </button>
          </div>
        ) : (
          // OTP Verification Form
          <div>
            <p className="text-gray-600 mb-4">Enter the OTP sent to +91 {phoneNumber}</p>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Smartphone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={6}
              />
            </div>
            
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
            
            <div className="space-y-3">
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Verify OTP'
                )}
              </button>
              
              <button
                onClick={() => {
                  setShowOtpInput(false)
                  setOtp('')
                  setError('')
                  setSuccess('')
                }}
                className="w-full text-blue-600 py-2 hover:text-blue-700"
              >
                Change Phone Number
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            We'll send a 6-digit OTP to your phone number
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginModal

