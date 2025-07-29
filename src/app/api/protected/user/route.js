import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';

export async function GET(request) {
  return requireUser(request, null, async (req) => {
    return NextResponse.json({
      success: true,
      message: 'Access granted to user route',
      user: {
        id: req.user._id,
        username: req.user.username,
        role: req.user.role
      }
    });
  });
} 