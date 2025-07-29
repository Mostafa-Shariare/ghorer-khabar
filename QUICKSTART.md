# Quick Start Guide

Get the JWT authentication system up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account

## Step 1: Setup Environment

Run the setup script to generate your JWT secret and create the environment file:

```bash
npm run setup
```

This will create a `.env.local` file with a secure JWT secret.

## Step 2: Configure MongoDB

Edit `.env.local` and update the MongoDB connection string:

**For local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/ghorer-khabar
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ghorer-khabar
```

## Step 3: Start the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Test the System

1. **Register a new user** using the registration form
2. **Login** with your credentials
3. **Test protected routes** using the demo buttons
4. **Logout** using the logout button

## Step 5: Run Automated Tests (Optional)

```bash
npm run test:auth
```

This will run automated tests to verify all authentication features are working.

## Creating an Admin User

To test admin-only routes, you need to create an admin user:

1. Register a normal user through the web interface
2. Connect to your MongoDB database
3. Update the user's role to "admin":

```javascript
// In MongoDB shell or MongoDB Compass
db.users.updateOne(
  { username: "your_username" },
  { $set: { role: "admin" } }
)
```

## What's Included

✅ **Complete Authentication System**
- User registration and login
- JWT token management with HttpOnly cookies
- Role-based access control (user/admin)
- Secure password hashing with bcrypt

✅ **API Endpoints**
- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/auth/logout` - User logout
- `/api/auth/me` - Get current user profile
- `/api/protected/user` - User-only route
- `/api/protected/admin` - Admin-only route

✅ **Frontend Components**
- Login form with validation
- Registration form with password confirmation
- User profile display
- Protected route testing interface

✅ **Security Features**
- HttpOnly cookies prevent XSS attacks
- Password hashing with bcrypt
- JWT token expiration (7 days)
- Input validation and sanitization

## Next Steps

- Customize the UI to match your brand
- Add additional user fields (email, profile picture, etc.)
- Implement password reset functionality
- Add email verification
- Set up production deployment

## Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running locally
- Check your connection string format
- Verify network connectivity for Atlas

**Authentication Issues:**
- Check browser console for errors
- Ensure cookies are enabled
- Verify JWT_SECRET is set in .env.local

**Development Tips:**
- Use browser dev tools to inspect cookies
- Check Network tab for API responses
- Monitor server logs for errors

Need help? Check the main [README.md](README.md) for detailed documentation. 