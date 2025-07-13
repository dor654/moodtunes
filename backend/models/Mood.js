const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Mood name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Mood name cannot exceed 50 characters'],
  },
  description: {
    type: String,
    required: [true, 'Mood description is required'],
    trim: true,
    maxlength: [200, 'Mood description cannot exceed 200 characters'],
  },
  emoji: {
    type: String,
    required: [true, 'Mood emoji is required'],
    maxlength: [10, 'Emoji cannot exceed 10 characters'],
  },
  color: {
    type: String,
    required: [true, 'Mood color is required'],
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color'],
  },
  intensity: {
    type: Number,
    required: [true, 'Mood intensity is required'],
    min: [1, 'Intensity must be between 1 and 10'],
    max: [10, 'Intensity must be between 1 and 10'],
  },
  category: {
    type: String,
    required: [true, 'Mood category is required'],
    enum: ['happy', 'sad', 'energetic', 'calm', 'romantic', 'angry', 'nostalgic', 'focused'],
  },
  musicalCharacteristics: {
    tempo: {
      min: {
        type: Number,
        min: 60,
        max: 200,
      },
      max: {
        type: Number,
        min: 60,
        max: 200,
      },
    },
    energy: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5,
    },
    valence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5,
    },
    danceability: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5,
    },
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // null for system-created moods
  },
}, {
  timestamps: true,
});

// Indexes for better performance
moodSchema.index({ name: 1 });
moodSchema.index({ category: 1 });
moodSchema.index({ intensity: 1 });
moodSchema.index({ isActive: 1 });

// Virtual for formatted name
moodSchema.virtual('displayName').get(function() {
  return `${this.emoji} ${this.name}`;
});

// Instance method to increment usage count
moodSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

// Static method to get popular moods
moodSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ usageCount: -1 })
    .limit(limit);
};

// Static method to get moods by category
moodSchema.statics.getByCategory = function(category) {
  return this.find({ 
    category: category,
    isActive: true 
  }).sort({ intensity: 1 });
};

// Static method to get random moods
moodSchema.statics.getRandom = function(limit = 6) {
  return this.aggregate([
    { $match: { isActive: true } },
    { $sample: { size: limit } }
  ]);
};

module.exports = mongoose.model('Mood', moodSchema);