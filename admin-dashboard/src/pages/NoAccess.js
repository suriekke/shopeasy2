import React from 'react';
import { supabase } from '../supabaseClient';
import { Shield, ArrowLeft } from 'lucide-react';

const NoAccess = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100">
            <Shield className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access the admin dashboard.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Please contact your administrator if you believe this is an error.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoAccess;


