import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Poll from '@/lib/Poll';
import { requireAuth } from '@/lib/auth';

// GET - Get poll details and results
export async function GET(request, { params }) {
  return requireAuth(request, null, async (req) => {
    try {
      await dbConnect();

      const { id } = params;
      const poll = await Poll.findById(id);

      if (!poll) {
        return NextResponse.json(
          { success: false, message: 'Poll not found' },
          { status: 404 }
        );
      }

      // Get user's response for this poll
      const userResponse = poll.getUserResponse(req.user._id);
      const results = poll.getResults();

      return NextResponse.json({
        success: true,
        poll: {
          id: poll._id,
          title: poll.title,
          createdAt: poll.createdAt,
          expiresAt: poll.expiresAt,
          isActive: poll.isActive(),
          isExpired: poll.isExpired(),
          userResponse: userResponse ? userResponse.response : null,
          results
        }
      });

    } catch (error) {
      console.error('Get poll error:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// DELETE - Delete poll (admin only)
export async function DELETE(request, { params }) {
  return requireAuth(request, null, async (req) => {
    try {
      await dbConnect();

      const { id } = params;
      const poll = await Poll.findById(id);

      if (!poll) {
        return NextResponse.json(
          { success: false, message: 'Poll not found' },
          { status: 404 }
        );
      }

      // Check if user is admin
      if (req.user.role !== 'admin') {
        return NextResponse.json(
          { success: false, message: 'Admin access required' },
          { status: 403 }
        );
      }

      await Poll.findByIdAndDelete(id);

      return NextResponse.json({
        success: true,
        message: 'Poll deleted successfully'
      });

    } catch (error) {
      console.error('Delete poll error:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 