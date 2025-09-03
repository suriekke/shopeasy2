import React, { useState } from 'react';
import { Phone, Smartphone, Shield, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { authAPI } from '../lib/api';

interface OTPLoginPageProps {
  onSuccess: (userData: any) => void;
}

const OTPLoginPage: React.FC<OTPLoginPageProps> = ({ onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.sendOTP(phoneNumber);
      
      if (response.status === 200) {
        setSuccess('OTP sent successfully! Check your phone.');
        setOtpSent(true);
      } else {
        setError('Failed to send OTP');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.verifyOTP(phoneNumber, otp);
      
      if (response.status === 200) {
        setSuccess('OTP verified successfully!');
        // Call the success callback to authenticate the user
        onSuccess({ phone_number: phoneNumber, verified: true });
      } else {
        setError('Failed to verify OTP');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure access with OTP verification
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              {!otpSent ? 'Enter Phone Number' : 'Verify OTP'}
            </CardTitle>
            <CardDescription>
              {!otpSent 
                ? 'We\'ll send a 6-digit OTP to your phone'
                : 'Enter the OTP sent to your phone'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!otpSent ? (
              // Phone Number Form
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="Phone number (e.g., +918179688221)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !phoneNumber}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            ) : (
              // OTP Verification Form
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="pl-10 text-center text-lg tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">
                    {success}
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={loading || !otp || otp.length !== 6}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                      setError('');
                      setSuccess('');
                    }}
                    className="w-full"
                  >
                    Change Phone Number
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600">Secure Access</p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">Real-time Updates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPLoginPage;

