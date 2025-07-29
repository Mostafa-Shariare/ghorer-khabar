import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/User';
import MealPackage from '@/lib/MealPackage';
import { requireUser } from '@/lib/auth';

export async function GET(request) {
  return requireUser(request, null, async (req) => {
    await dbConnect();
    const user = await User.findById(req.user._id).populate('mealPackage');
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    let mealPackageName = null;
    let mealPackagePrice = null;
    let due = null;
    if (user.mealPackage) {
      mealPackageName = user.mealPackage.name;
      mealPackagePrice = user.mealPackage.price;
      due = mealPackagePrice - user.totalPaid;
    }
    const yesVotes = user.votes ? user.votes.filter(v => v.response === 'yes').length : 0;
    return NextResponse.json({
      success: true,
      mealPackage: mealPackageName,
      price: mealPackagePrice,
      amountPaid: user.totalPaid,
      due,
      yesVotes
    });
  });
} 