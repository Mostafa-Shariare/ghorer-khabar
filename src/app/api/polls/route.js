import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Poll from '@/lib/Poll';
import { requireAuth, requireAdmin } from '@/lib/auth';

// GET - Get all polls (active and expired)
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    let polls;
    if (activeOnly) {
      polls = await Poll.findActive();
    } else {
      polls = await Poll.find({});
    }
    
    return NextResponse.json({
      success: true,
      polls
    });

  } catch (error) {
    console.error('Get polls error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new poll (admin only)
export async function POST(request) {
  return requireAdmin(request, null, async (req) => {
    try {
      await dbConnect();

      const { title, expiresAt } = await request.json();

      // Validate input
      if (!title || !expiresAt) {
        return NextResponse.json(
          { success: false, message: 'Title and expiration date are required' },
          { status: 400 }
        );
      }

      const expirationDate = new Date(expiresAt);
      if (isNaN(expirationDate.getTime())) {
        return NextResponse.json(
          { success: false, message: 'Invalid expiration date' },
          { status: 400 }
        );
      }

      if (expirationDate <= new Date()) {
        return NextResponse.json(
          { success: false, message: 'Expiration date must be in the future' },
          { status: 400 }
        );
      }

      // Create new poll
      const poll = new Poll({
        title,
        expiresAt: expirationDate,
        responses: []
      });

      await poll.save();

      return NextResponse.json({
        success: true,
        message: 'Poll created successfully',
        poll
      });

    } catch (error) {
      console.error('Create poll error:', error);
      
      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return NextResponse.json(
          { success: false, message: messages.join(', ') },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 