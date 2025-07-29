import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MealPackage from '@/lib/MealPackage';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  return requireAdmin(request, null, async () => {
    await dbConnect();
    const packages = await MealPackage.find();
    return NextResponse.json({ success: true, packages });
  });
}

export async function POST(request) {
  return requireAdmin(request, null, async () => {
    await dbConnect();
    const { name, price } = await request.json();
    if (!name || typeof price !== 'number' || price < 0) {
      return NextResponse.json({ success: false, message: 'name and non-negative price are required' }, { status: 400 });
    }
    const pkg = new MealPackage({ name, price });
    await pkg.save();
    return NextResponse.json({ success: true, package: pkg });
  });
}

export async function PUT(request) {
  return requireAdmin(request, null, async () => {
    await dbConnect();
    const { id, name, price } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 });
    }
    const pkg = await MealPackage.findById(id);
    if (!pkg) {
      return NextResponse.json({ success: false, message: 'Package not found' }, { status: 404 });
    }
    if (name) pkg.name = name;
    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        return NextResponse.json({ success: false, message: 'price must be a non-negative number' }, { status: 400 });
      }
      pkg.price = price;
    }
    await pkg.save();
    return NextResponse.json({ success: true, package: pkg });
  });
}

export async function DELETE(request) {
  return requireAdmin(request, null, async () => {
    await dbConnect();
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 });
    }
    const pkg = await MealPackage.findByIdAndDelete(id);
    if (!pkg) {
      return NextResponse.json({ success: false, message: 'Package not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Package deleted' });
  });
} 