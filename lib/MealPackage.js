import mongoose from 'mongoose';

const mealPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Meal package name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  }
});

// Static method to find meal packages by price range
mealPackageSchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  return this.find({
    price: { $gte: minPrice, $lte: maxPrice }
  });
};

export default mongoose.models.MealPackage || mongoose.model('MealPackage', mealPackageSchema); 