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
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 