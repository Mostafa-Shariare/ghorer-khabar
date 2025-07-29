import { NextResponse } from 'next/server';
import { clearTokenCookie } from '@/lib/jwt';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

    // Clear JWT token from HttpOnly cookie
    clearTokenCookie(response);

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 