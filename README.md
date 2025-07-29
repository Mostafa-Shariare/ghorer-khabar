# JWT Authentication System

A complete authentication system built with Next.js, MongoDB, and JWT tokens. Features include user registration, login, logout, role-based access control, and secure HttpOnly cookie storage.

## Features

- ✅ **User Registration & Login**: Secure user authentication with username/password
- ✅ **JWT Token Management**: Tokens stored in HttpOnly cookies for security
- ✅ **Role-Based Access Control**: Support for 'user' and 'admin' roles
- ✅ **Protected Routes**: Middleware for route protection and role verification
- ✅ **MongoDB Integration**: Cached database connections with Mongoose
- ✅ **Password Hashing**: Secure password storage with bcrypt
- ✅ **Modern UI**: Clean, responsive interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with HttpOnly cookies
- **Security**: bcrypt for password hashing

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/your-database-name

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your-database-name
```

### 3. Generate JWT Secret

You can generate a secure JWT secret using:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/logout` - Logout and clear token
- `GET /api/auth/me` - Get current user profile

### Protected Routes

- `GET /api/protected/user` - User-only route
- `GET /api/protected/admin` - Admin-only route

## Usage Examples

### Register a New User

```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    password: 'securepassword123'
  })
});
```

### Login

```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    password: 'securepassword123'
  })
});
```

### Access Protected Route

```javascript
const response = await fetch('/api/protected/user');
const data = await response.json();
```

## File Structure

```
├── lib/
│   ├── dbConnect.js      # MongoDB connection with caching
│   ├── User.js           # User model with password hashing
│   ├── jwt.js            # JWT utilities
│   └── auth.js           # Authentication middleware
├── src/
│   ├── middleware.js     # Next.js middleware for route protection
│   └── app/
│       ├── api/
│       │   ├── auth/         # Authentication endpoints
│       │   │   ├── login/    # Login route
│       │   │   ├── logout/   # Logout route
│       │   │   ├── register/ # Registration route
│       │   │   └── me/       # User profile route
│       │   └── protected/    # Protected route examples
│       │       ├── user/     # User-only route
│       │       └── admin/    # Admin-only route
│       ├── components/       # React components
│       │   ├── LoginForm.js  # Login form component
│       │   ├── RegisterForm.js # Registration form component
│       │   └── UserProfile.js # User profile component
│       ├── login/         # Login page
│       ├── register/      # Registration page
│       ├── user/          # User dashboard (protected)
│       ├── admin/         # Admin dashboard (protected)
│       ├── unauthorized/  # Unauthorized access page
│       ├── globals.css    # Global styles
│       ├── layout.js      # Root layout
│       └── page.js        # Main page with auth demo
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Security Features

### JWT Token Security
- Tokens are stored in HttpOnly cookies to prevent XSS attacks
- Tokens include user role information for authorization
- Automatic token expiration (7 days)
- Secure cookie settings with SameSite=Strict

### Password Security
- Passwords are hashed using bcrypt with salt rounds of 12
- Minimum password length of 6 characters
- Secure password comparison using timing-safe methods

### Database Security
- Cached connections to prevent connection exhaustion
- Input validation and sanitization
- Error handling without exposing sensitive information

## Route Protection with Middleware

The system includes a Next.js middleware that automatically protects routes based on authentication and user roles.

### Protected Routes

- **`/user/*`**: Requires user authentication (any logged-in user)
- **`/admin/*`**: Requires admin role authentication
- **`/login`**: Public access with redirect handling
- **`/register`**: Public access
- **`/unauthorized`**: Public access (error page)

### Middleware Behavior

1. **Unauthenticated users** trying to access protected routes are redirected to `/login`
2. **Non-admin users** trying to access `/admin/*` routes are redirected to `/unauthorized`
3. **Authenticated users** can access their appropriate routes
4. **Login redirects** preserve the original URL for post-login navigation

### Middleware Configuration

The middleware is configured in `src/middleware.js` and automatically runs on all routes except:
- API routes (handled by their own authentication)
- Static files (`/_next/*`, `/favicon.ico`)
- Public pages (`/login`, `/register`, `/unauthorized`)

## Role-Based Access Control

The system supports two roles:

- **user**: Regular user access
- **admin**: Administrative access (can access all user routes)

### Using Authentication Middleware

```javascript
import { requireAuth, requireAdmin, requireUser } from '@/lib/auth';

// Require any authenticated user
export async function GET(request) {
  return requireAuth(request, null, async (req) => {
    // Your protected route logic here
  });
}

// Require admin role
export async function GET(request) {
  return requireAdmin(request, null, async (req) => {
    // Admin-only logic here
  });
}
```

## Testing the System

1. **Start the development server**: `npm run dev`
2. **Open the application**: Navigate to http://localhost:3000
3. **Register a new user**: Use the registration form
4. **Test login**: Log in with your credentials
5. **Test protected routes**: Use the demo buttons to test user/admin routes
6. **Test logout**: Use the logout button in the user profile

## Creating Admin Users

To create an admin user, you can either:

1. **Register normally and update in database**:
   ```javascript
   // Connect to MongoDB and update user role
   const user = await User.findOne({ username: 'your_username' });
   user.role = 'admin';
   await user.save();
   ```

2. **Use the registration API with admin role** (if you modify the endpoint to allow it):
   ```javascript
   const response = await fetch('/api/auth/register', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       username: 'admin_user',
       password: 'securepassword',
       role: 'admin'
     })
   });
   ```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your `MONGODB_URI` environment variable
   - Verify network connectivity

2. **JWT Token Issues**
   - Ensure `JWT_SECRET` is set in `.env.local`
   - Check that the secret is strong enough
   - Verify cookie settings in production

3. **Authentication Not Working**
   - Check browser console for errors
   - Verify API routes are accessible
   - Ensure cookies are enabled in browser

### Development Tips

- Use browser developer tools to inspect cookies
- Check Network tab for API request/response details
- Monitor server logs for error messages
- Test with different user roles to verify access control

## Production Deployment

### Environment Variables
Ensure all environment variables are set in your production environment:

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
```

### Security Considerations
- Use HTTPS in production
- Set secure cookie flags
- Use strong JWT secrets
- Implement rate limiting
- Add CSRF protection if needed
- Consider using Redis for session management at scale

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
