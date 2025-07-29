import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Poll from '@/lib/Poll';
import { requireAdmin } from '@/lib/auth';

export async function POST(request) {
  return requireAdmin(request, null, async () => {
    await dbConnect();
    const { title, expiresAt } = await request.json();
    if (!title || !expiresAt) {
      return NextResponse.json({ success: false, message: 'title and expiresAt are required' }, { status: 400 });
    }
    const expiresDate = new Date(expiresAt);
    if (isNaN(expiresDate.getTime())) {
      return NextResponse.json({ success: false, message: 'Invalid expiresAt timestamp' }, { status: 400 });
    }
    const poll = new Poll({ title, expiresAt: expiresDate });
    await poll.save();
    return NextResponse.json({ success: true, poll });
  });
} 