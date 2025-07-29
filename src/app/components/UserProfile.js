'use client';

import { useState, useEffect } from 'react';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.success) {
        setUser(null);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <p className="mt-1 text-lg font-semibold">{user.username}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
            user.role === 'admin' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {user.role}
          </span>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Member Since</label>
          <p className="mt-1 text-gray-600">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Paid</label>
          <p className="mt-1 text-gray-600">
            ${user.totalPaid?.toFixed(2) || '0.00'}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Meal Package</label>
          <p className="mt-1 text-gray-600">
            {user.mealPackage ? 'Assigned' : 'Not assigned'}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Votes Cast</label>
          <p className="mt-1 text-gray-600">
            {user.votes?.length || 0} votes
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
        >
          {logoutLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
} 