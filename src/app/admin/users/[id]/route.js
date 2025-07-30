@@ .. @@
 export async function PUT(request, { params }) {
   return requireAdmin(request, null, async (req) => {
     await dbConnect();
     const { id } = params;
-    const { mealPackage, totalPaid } = await request.json();
+    const { username, password, role, mealPackage, totalPaid } = await request.json();

     // Find user
     const user = await User.findById(id);
     if (!user) {
       return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
     }

+    // Update username if provided
+    if (username && username !== user.username) {
+      // Check if new username already exists
+      const existingUser = await User.findOne({ username, _id: { $ne: id } });
+      if (existingUser) {
+        return NextResponse.json({ success: false, message: 'Username already exists' }, { status: 400 });
+      }
+      user.username = username;
+    }
+
+    // Update password if provided
+    if (password && password.trim() !== '') {
+      if (password.length < 6) {
+        return NextResponse.json({ success: false, message: 'Password must be at least 6 characters long' }, { status: 400 });
+      }
+      user.password = password;
+    }
+
+    // Update role if provided
+    if (role && ['user', 'admin'].includes(role)) {
+      user.role = role;
+    }
+
     let mealPkg = null;
     if (mealPackage) {
       mealPkg = await MealPackage.findById(mealPackage);
       if (!mealPkg) {
         return NextResponse.json({ success: false, message: 'Invalid mealPackage ID' }, { status: 400 });
       }
       user.mealPackage = mealPackage;
+    } else if (mealPackage === '') {
+      // Allow clearing meal package
+      user.mealPackage = null;
     } else if (user.mealPackage) {
       mealPkg = await MealPackage.findById(user.mealPackage);
     }

     if (totalPaid !== undefined) {
       if (typeof totalPaid !== 'number' || totalPaid < 0) {
         return NextResponse.json({ success: false, message: 'totalPaid must be a non-negative number' }, { status: 400 });
       }
       user.totalPaid = totalPaid;
     }

     await user.save();

     // Calculate due
     let due = null;
     if (mealPkg) {
       due = mealPkg.price - user.totalPaid;
     }

     const userObj = user.toObject();
     delete userObj.password;
     return NextResponse.json({ success: true, user: userObj, due });
   });
 }