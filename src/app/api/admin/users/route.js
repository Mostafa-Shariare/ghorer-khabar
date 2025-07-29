import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/User';
import MealPackage from '@/lib/MealPackage';
import { requireAdmin } from '@/lib/auth';

export async function POST(request) {
  return requireAdmin(request, null, async (req) => {
    await dbConnect();
    const { username, password, mealPackage, totalPaid } = await request.json();

    // Validate input
    if (!username || !password || !mealPackage || totalPaid === undefined) {
      return NextResponse.json(
        { success: false, message: 'username, password, mealPackage, and totalPaid are required' },
        { status: 400 }
      );
    }
    if (username.length < 3) {
      return NextResponse.json(
        { success: false, message: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    if (typeof totalPaid !== 'number' || totalPaid < 0) {
      return NextResponse.json(
        { success: false, message: 'totalPaid must be a non-negative number' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Username already exists' },
        { status: 400 }
      );
    }

    // Validate mealPackage exists
    const mealPkg = await MealPackage.findById(mealPackage);
    if (!mealPkg) {
      return NextResponse.json(
        { success: false, message: 'Invalid mealPackage ID' },
        { status: 400 }
      );
    }

    // Create user
    const user = new User({
      username,
      password,
      mealPackage,
      totalPaid,
      role: 'user',
      votes: []
    });
    await user.save();

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;
    return NextResponse.json({ success: true, user: userObj });
  });
} 