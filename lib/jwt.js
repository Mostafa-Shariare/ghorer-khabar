import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

// Generate JWT token
export function generateToken(user) {
  const payload = {
    userId: user._id,
    username: user.username,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d' // Token expires in 7 days
  });
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware to extract token from cookies
export function getTokenFromCookie(req) {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  return cookies.token || null;
}

// Set JWT token in HttpOnly cookie
export function setTokenCookie(res, token) {
  res.setHeader('Set-Cookie', [
    `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  ]);
}

// Clear JWT token cookie
export function clearTokenCookie(res) {
  res.setHeader('Set-Cookie', [
    'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict'
  ]);
} 