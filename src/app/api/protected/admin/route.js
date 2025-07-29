import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  return requireAdmin(request, null, async (req) => {
    return NextResponse.json({
      success: true,
      message: 'Access granted to admin route',
      user: {
        id: req.user._id,
        username: req.user.username,
        role: req.user.role
      }
    });
  });
} 