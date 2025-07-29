import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MealPackage from '@/lib/MealPackage';
import { requireAdmin } from '@/lib/auth';

// GET - Get all meal packages
export async function GET() {
  try {
    await dbConnect();
    
    const mealPackages = await MealPackage.find({});
    
    return NextResponse.json({
      success: true,
      mealPackages
    });

  } catch (error) {
    console.error('Get meal packages error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new meal package (admin only)
export async function POST(request) {
  return requireAdmin(request, null, async (req) => {
    try {
      await dbConnect();

      const { name, price } = await request.json();

      // Validate input
      if (!name || !price) {
        return NextResponse.json(
          { success: false, message: 'Name and price are required' },
          { status: 400 }
        );
      }

      if (price < 0) {
        return NextResponse.json(
          { success: false, message: 'Price cannot be negative' },
          { status: 400 }
        );
      }

      // Create new meal package
      const mealPackage = new MealPackage({
        name,
        price
      });

      await mealPackage.save();

      return NextResponse.json({
        success: true,
        message: 'Meal package created successfully',
        mealPackage
      });

    } catch (error) {
      console.error('Create meal package error:', error);
      
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