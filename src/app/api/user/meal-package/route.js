import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/User';
import MealPackage from '@/lib/MealPackage';
import { requireAuth } from '@/lib/auth';

export async function PUT(request) {
  return requireAuth(request, null, async (req) => {
    try {
      await dbConnect();

      const { mealPackageId } = await request.json();

      if (!mealPackageId) {
        return NextResponse.json(
          { success: false, message: 'Meal package ID is required' },
          { status: 400 }
        );
      }

      // Verify the meal package exists
      const mealPackage = await MealPackage.findById(mealPackageId);
      if (!mealPackage) {
        return NextResponse.json(
          { success: false, message: 'Meal package not found' },
          { status: 404 }
        );
      }

      // Update user's meal package
      const user = req.user;
      user.mealPackage = mealPackageId;
      await user.save();

      return NextResponse.json({
        success: true,
        message: 'Meal package updated successfully',
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          mealPackage: user.mealPackage,
          totalPaid: user.totalPaid,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error('Update meal package error:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(request) {
  return requireAuth(request, null, async (req) => {
    try {
      await dbConnect();

      // Remove user's meal package
      const user = req.user;
      user.mealPackage = null;
      await user.save();

      return NextResponse.json({
        success: true,
        message: 'Meal package removed successfully',
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          mealPackage: user.mealPackage,
          totalPaid: user.totalPaid,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error('Remove meal package error:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 