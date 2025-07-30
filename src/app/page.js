'use client';

import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import UserProfile from './components/UserProfile';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ghorer Khabar Management System
          </h1>
          <p className="text-lg text-gray-600">
            Meal management system with role-based access control
          </p>
        </div>

        {user ? (
          <div className="space-y-8">
            <UserProfile />
            
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Navigation & Protected Routes</h2>
              
              {/* Navigation Links */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Page Navigation</h3>
                  <div className="space-y-3">
                    <a
                      href="/user"
                      className="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      User Dashboard
                    </a>
                    {user.role === 'admin' && (
                      <a
                        href="/admin"
                        className="block w-full text-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Admin Dashboard
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">API Route Testing</h3>
                  <div className="space-y-3">
                    <ProtectedRouteDemo 
                      title="User API" 
                      endpoint="/api/protected/user"
                      description="Test user API access"
                    />
                    {user.role === 'admin' && (
                      <ProtectedRouteDemo 
                        title="Admin API" 
                        endpoint="/api/protected/admin"
                        description="Test admin API access"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="space-y-6">
              <LoginForm />
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Account Required
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        New users must be created by an administrator. Please contact your admin to get an account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <a
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Go to Login Page
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProtectedRouteDemo({ title, endpoint, description }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testRoute = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <button
        onClick={testRoute}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 mb-4"
      >
        {loading ? 'Testing...' : 'Test Route'}
      </button>
      
      {result && (
        <div className={`p-3 rounded text-sm ${
          result.success 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          <div className="font-semibold mb-1">
            {result.success ? 'Success' : 'Error'}
          </div>
          <div>{result.message}</div>
          {result.user && (
            <div className="mt-2 text-xs">
              User: {result.user.username} ({result.user.role})
            </div>
          )}
        </div>
      )}
    </div>
  );
}
