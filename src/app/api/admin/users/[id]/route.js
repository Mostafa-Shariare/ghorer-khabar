import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/User';
import MealPackage from '@/lib/MealPackage';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request, { params }) {
  return requireAdmin(request, null, async (req) => {
    await dbConnect();
    const { id } = params;
    const { mealPackage, totalPaid } = await request.json();

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    let mealPkg = null;
    if (mealPackage) {
      mealPkg = await MealPackage.findById(mealPackage);
      if (!mealPkg) {
        return NextResponse.json({ success: false, message: 'Invalid mealPackage ID' }, { status: 400 });
      }
      user.mealPackage = mealPackage;
    } else if (user.mealPackage) {
      mealPkg = await MealPackage.findById(user.mealPackage);
    }

    if (totalPaid !== undefined) {
      if (typeof totalPaid !== 'number' || totalPaid < 0) {
        return NextResponse.json({ success: false, message: 'totalPaid must be a non-negative number' }, { status: 400 });
      }
      user.totalPaid = totalPaid;
    }

    await user.save();

    // Calculate due
    let due = null;
    if (mealPkg) {
      due = mealPkg.price - user.totalPaid;
    }

    const userObj = user.toObject();
    delete userObj.password;
    return NextResponse.json({ success: true, user: userObj, due });
  });
} 