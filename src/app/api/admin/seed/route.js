import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/User';
import MealPackage from '@/lib/MealPackage';
import Poll from '@/lib/Poll';
import { requireAdmin } from '@/lib/auth';

export async function POST(request) {
  return requireAdmin(request, null, async () => {
    await dbConnect();

    // Clear existing data
    await User.deleteMany({});
    await MealPackage.deleteMany({});
    await Poll.deleteMany({});

    // Seed meal packages
    const mealPackages = await MealPackage.insertMany([
      { name: 'Standard', price: 100 },
      { name: 'Premium', price: 150 },
      { name: 'Deluxe', price: 200 },
    ]);

    // Seed users
    const users = await User.insertMany([
      { username: 'alice', password: 'password1', mealPackage: mealPackages[0]._id, totalPaid: 100, role: 'user' },
      { username: 'bob', password: 'password2', mealPackage: mealPackages[1]._id, totalPaid: 50, role: 'user' },
      { username: 'carol', password: 'password3', mealPackage: mealPackages[2]._id, totalPaid: 0, role: 'user' },
      { username: 'dave', password: 'password4', mealPackage: mealPackages[0]._id, totalPaid: 100, role: 'user' },
      { username: 'admin', password: 'adminpass', mealPackage: mealPackages[1]._id, totalPaid: 150, role: 'admin' },
    ]);

    // Seed polls
    const now = new Date();
    const polls = await Poll.insertMany([
      { title: 'Active Poll', expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), responses: [] },
      { title: 'Expired Poll', expiresAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), responses: [] },
    ]);

    // Add votes
    await Poll.findByIdAndUpdate(polls[0]._id, {
      $push: {
        responses: [
          { userId: users[0]._id, response: 'yes' },
          { userId: users[1]._id, response: 'no' },
          { userId: users[2]._id, response: 'yes' },
        ],
      },
    });
    await Poll.findByIdAndUpdate(polls[1]._id, {
      $push: {
        responses: [
          { userId: users[0]._id, response: 'no' },
          { userId: users[1]._id, response: 'yes' },
          { userId: users[3]._id, response: 'yes' },
        ],
      },
    });

    return NextResponse.json({ success: true, message: 'Database seeded', mealPackages, users, polls });
  });
} 