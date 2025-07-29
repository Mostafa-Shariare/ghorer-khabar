import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/User';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
  return requireAuth(request, null, async (req) => {
    try {
      await dbConnect();

      const { amount } = await request.json();

      if (!amount || amount <= 0) {
        return NextResponse.json(
          { success: false, message: 'Valid payment amount is required' },
          { status: 400 }
        );
      }

      // Update user's total paid amount
      const user = req.user;
      user.totalPaid += amount;
      await user.save();

      return NextResponse.json({
        success: true,
        message: 'Payment recorded successfully',
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          mealPackage: user.mealPackage,
          totalPaid: user.totalPaid,
          createdAt: user.createdAt
        },
        payment: {
          amount,
          newTotal: user.totalPaid
        }
      });

    } catch (error) {
      console.error('Payment error:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

export async function GET(request) {
  return requireAuth(request, null, async (req) => {
    try {
      await dbConnect();

      const user = req.user;

      return NextResponse.json({
        success: true,
        paymentInfo: {
          totalPaid: user.totalPaid,
          userId: user._id,
          username: user.username
        }
      });

    } catch (error) {
      console.error('Get payment info error:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 