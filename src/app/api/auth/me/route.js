import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await authenticateUser(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        mealPackage: user.mealPackage,
        totalPaid: user.totalPaid,
        votes: user.votes,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 