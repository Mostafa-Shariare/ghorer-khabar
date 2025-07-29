import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  mealPackage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MealPackage',
    default: null
  },
  totalPaid: {
    type: Number,
    default: 0,
    min: [0, 'Total paid cannot be negative']
  },
  votes: [{
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Poll',
      required: true
    },
    response: {
      type: String,
      required: true
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get user without password
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Method to add a vote (for backward compatibility)
userSchema.methods.addVote = function(pollId, response) {
  // Check if user already voted on this poll
  const existingVoteIndex = this.votes.findIndex(vote => 
    vote.pollId.toString() === pollId.toString()
  );
  
  if (existingVoteIndex !== -1) {
    // Update existing vote
    this.votes[existingVoteIndex].response = response;
    this.votes[existingVoteIndex].votedAt = new Date();
  } else {
    // Add new vote
    this.votes.push({ pollId, response });
  }
  
  return this.save();
};

// Method to get user's vote for a specific poll
userSchema.methods.getVote = function(pollId) {
  return this.votes.find(vote => 
    vote.pollId.toString() === pollId.toString()
  );
};

// Method to update total paid amount
userSchema.methods.updateTotalPaid = function(amount) {
  this.totalPaid += amount;
  return this.save();
};

// Method to set meal package
userSchema.methods.setMealPackage = function(mealPackageId) {
  this.mealPackage = mealPackageId;
  return this.save();
};

// Static method to find users by role
userSchema.statics.findByRole = function(role) {
  return this.find({ role }).select('-password');
};

// Static method to find users with meal package
userSchema.statics.findWithMealPackage = function() {
  return this.find({ mealPackage: { $ne: null } }).select('-password');
};

export default mongoose.models.User || mongoose.model('User', userSchema); 