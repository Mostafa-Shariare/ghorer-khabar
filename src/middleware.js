import { NextResponse } from 'next/server';
import { verifyToken } from '../lib/jwt.js';

// Define protected routes
const protectedRoutes = {
  admin: ['/admin'],
  user: ['/user', '/admin'], // admin routes are also accessible to users
  public: ['/api/auth/login', '/api/auth/register', '/api/auth/logout', '/api/auth/me']
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes (they handle their own auth)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip middleware for static files
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  // Get JWT token from cookie
  const token = getTokenFromCookie(request);
  let user = null;

  if (token) {
    try {
      user = verifyToken(token);
    } catch (error) {
      console.error('JWT verification failed:', error);
    }
  }

  // Check if route requires authentication
  const isAdminRoute = pathname.startsWith('/admin');
  const isUserRoute = pathname.startsWith('/user');

  // Handle admin routes
  if (isAdminRoute) {
    if (!user) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user.role !== 'admin') {
      // Redirect to unauthorized page if not admin
      const unauthorizedUrl = new URL('/unauthorized', request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // Handle user routes
  if (isUserRoute) {
    if (!user) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add user info to headers for use in components
  const response = NextResponse.next();
  
  if (user) {
    response.headers.set('x-user-id', user.userId);
    response.headers.set('x-user-username', user.username);
    response.headers.set('x-user-role', user.role);
  }

  return response;
}

// Helper function to extract token from cookie
function getTokenFromCookie(request) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  return cookies.token || null;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 