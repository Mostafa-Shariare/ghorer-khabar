import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Poll from '@/lib/Poll';
import { requireUser } from '@/lib/auth';

export async function POST(request, { params }) {
  return requireUser(request, null, async (req) => {
    await dbConnect();
    const { pollId } = params;
    const { response } = await request.json();
    const userId = req.user._id;

    if (!['yes', 'no'].includes(response)) {
      return NextResponse.json({ success: false, message: "Response must be 'yes' or 'no'" }, { status: 400 });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return NextResponse.json({ success: false, message: 'Poll not found' }, { status: 404 });
    }

    // Block voting if poll has expired
    if (Date.now() >= new Date(poll.expiresAt).getTime()) {
      return NextResponse.json({ success: false, message: 'Poll is expired. Voting is closed.' }, { status: 400 });
    }

    await poll.addResponse(userId, response);
    return NextResponse.json({ success: true, message: 'Vote recorded' });
  });
} 