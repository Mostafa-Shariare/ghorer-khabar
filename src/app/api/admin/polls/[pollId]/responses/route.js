import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Poll from '@/lib/Poll';
import User from '@/lib/User';
import { requireAdmin } from '@/lib/auth';

export async function GET(request, { params }) {
  return requireAdmin(request, null, async () => {
    await dbConnect();
    const { pollId } = params;
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return NextResponse.json({ success: false, message: 'Poll not found' }, { status: 404 });
    }
    // Get all userIds from responses
    const userIds = poll.responses.map(r => r.userId);
    // Fetch users in one query
    const users = await User.find({ _id: { $in: userIds } }).select('username');
    // Map userId to username
    const userMap = {};
    users.forEach(u => { userMap[u._id.toString()] = u.username; });
    // Build table
    const table = poll.responses.map(r => ({
      userId: r.userId,
      username: userMap[r.userId.toString()] || 'Unknown',
      vote: r.response
    }));
    return NextResponse.json({ success: true, responses: table });
  });
} 