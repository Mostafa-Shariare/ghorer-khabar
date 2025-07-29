import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Poll title is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required']
  },
  responses: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    response: {
      type: String,
      enum: ['yes', 'no'],
      required: true
    }
  }]
});

// Method to add a response
pollSchema.methods.addResponse = function(userId, response) {
  // Check if user already responded
  const existingResponseIndex = this.responses.findIndex(resp => 
    resp.userId.toString() === userId.toString()
  );
  
  if (existingResponseIndex !== -1) {
    // Update existing response
    this.responses[existingResponseIndex].response = response;
  } else {
    // Add new response
    this.responses.push({ userId, response });
  }
  
  return this.save();
};

// Method to get user's response
pollSchema.methods.getUserResponse = function(userId) {
  return this.responses.find(resp => 
    resp.userId.toString() === userId.toString()
  );
};

// Method to get poll results
pollSchema.methods.getResults = function() {
  const yesCount = this.responses.filter(resp => resp.response === 'yes').length;
  const noCount = this.responses.filter(resp => resp.response === 'no').length;
  const total = this.responses.length;
  
  return {
    yes: yesCount,
    no: noCount,
    total: total,
    yesPercentage: total > 0 ? Math.round((yesCount / total) * 100) : 0,
    noPercentage: total > 0 ? Math.round((noCount / total) * 100) : 0
  };
};

// Method to check if poll is expired
pollSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Method to check if poll is active
pollSchema.methods.isActive = function() {
  const now = new Date();
  return now <= this.expiresAt;
};

// Static method to find active polls
pollSchema.statics.findActive = function() {
  const now = new Date();
  return this.find({
    expiresAt: { $gt: now }
  });
};

// Static method to find expired polls
pollSchema.statics.findExpired = function() {
  const now = new Date();
  return this.find({
    expiresAt: { $lte: now }
  });
};

export default mongoose.models.Poll || mongoose.model('Poll', pollSchema); 