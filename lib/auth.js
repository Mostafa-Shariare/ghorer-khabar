import { getTokenFromCookie, verifyToken } from './jwt.js';
import dbConnect from './dbConnect.js';
import User from './User.js';

// Middleware to authenticate user
export async function authenticateUser(req) {
  try {
    await dbConnect();
    
    const token = getTokenFromCookie(req);
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Middleware to require authentication
export async function requireAuth(req, res, next) {
  const user = await authenticateUser(req);
  
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  req.user = user;
  return next ? next() : user;
}

// Middleware to require specific role
export function requireRole(role) {
  return async (req, res, next) => {
    const user = await authenticateUser(req);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (user.role !== role && user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. ${role} role required.` 
      });
    }

    req.user = user;
    next();
  };
}

// Middleware to require admin role
export const requireAdmin = requireRole('admin');

// Middleware to require user role (or admin)
export const requireUser = requireRole('user'); 