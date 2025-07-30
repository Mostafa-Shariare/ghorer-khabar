'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, [searchParams]);

  const handleLoginSuccess = (role) => {
    if (redirectPath) {
      router.push(redirectPath);
    } else if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          {redirectPath && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Please log in to access <span className="font-medium">{redirectPath}</span>
            </p>
          )}
        </div>
        
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Need an Account?
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  New users must be created by an administrator. Please contact your admin to get an account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 