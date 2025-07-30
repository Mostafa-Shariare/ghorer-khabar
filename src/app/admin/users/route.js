import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/User';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  return requireAdmin(request, null, async () => {
    await dbConnect();
    const users = await User.find().select('-password');
    return NextResponse.json({ success: true, users });
  });
}

export async function DELETE(request) {
  return requireAdmin(request, null, async () => {
    await dbConnect();
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  });
}