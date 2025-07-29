import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/User';
import Poll from '@/lib/Poll';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
  return requireAuth(request, null, async (req) => {
    try {
      await dbConnect();

      const { pollId, response } = await request.json();

      if (!pollId || !response) {
        return NextResponse.json(
          { success: false, message: 'Poll ID and response are required' },
          { status: 400 }
        );
      }

      // Verify the poll exists and is active
      const poll = await Poll.findById(pollId);
      if (!poll) {
        return NextResponse.json(
          { success: false, message: 'Poll not found' },
          { status: 404 }
        );
      }

      if (!poll.isActive()) {
        return NextResponse.json(
          { success: false, message: 'Poll is not active' },
          { status: 400 }
        );
      }

      // Validate response
      if (!['yes', 'no'].includes(response)) {
        return NextResponse.json(
          { success: false, message: 'Response must be "yes" or "no"' },
          { status: 400 }
        );
      }

      // Add response to poll
      await poll.addResponse(req.user._id, response);

      // Add vote to user (for backward compatibility)
      const user = req.user;
      await user.addVote(pollId, response);

      return NextResponse.json({
        success: true,
        message: 'Vote recorded successfully',
        vote: {
          pollId,
          response,
          votedAt: new Date()
        }
      });

    } catch (error) {
      console.error('Vote error:', error);
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

      const { searchParams } = new URL(request.url);
      const pollId = searchParams.get('pollId');

      const user = req.user;

      if (pollId) {
        // Get user's vote for specific poll
        const vote = user.getVote(pollId);
        return NextResponse.json({
          success: true,
          vote: vote || null
        });
      } else {
        // Get all user's votes
        return NextResponse.json({
          success: true,
          votes: user.votes
        });
      }

    } catch (error) {
      console.error('Get votes error:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 