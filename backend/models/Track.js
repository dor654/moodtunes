const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Track name is required'],
    trim: true,
    maxlength: [200, 'Track name cannot exceed 200 characters'],
  },
  artist: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true,
    maxlength: [200, 'Artist name cannot exceed 200 characters'],
  },
  album: {
    type: String,
    trim: true,
    maxlength: [200, 'Album name cannot exceed 200 characters'],
  },
  duration: {
    type: Number, // Duration in seconds
    min: [1, 'Duration must be at least 1 second'],
  },
  preview_url: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Preview URL must be a valid HTTP/HTTPS URL',
    },
  },
  image: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Image URL must be a valid HTTP/HTTPS URL',
    },
  },
  externalIds: {
    spotify: {
      type: String,
      trim: true,
    },
    youtube: {
      type: String,
      trim: true,
    },
    apple: {
      type: String,
      trim: true,
    },
  },
  audioFeatures: {
    tempo: {
      type: Number,
      min: 60,
      max: 200,
    },
    energy: {
      type: Number,
      min: 0,
      max: 1,
    },
    valence: {
      type: Number,
      min: 0,
      max: 1,
    },
    danceability: {
      type: Number,
      min: 0,
      max: 1,
    },
    acousticness: {
      type: Number,
      min: 0,
      max: 1,
    },
    instrumentalness: {
      type: Number,
      min: 0,
      max: 1,
    },
    loudness: {
      type: Number,
    },
    speechiness: {
      type: Number,
      min: 0,
      max: 1,
    },
  },
  genres: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  moods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mood',
  }],
  popularity: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  playCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes for better performance
trackSchema.index({ name: 1, artist: 1 });
trackSchema.index({ artist: 1 });
trackSchema.index({ genres: 1 });
trackSchema.index({ moods: 1 });
trackSchema.index({ popularity: -1 });
trackSchema.index({ 'externalIds.spotify': 1 });

// Virtual for full track name
trackSchema.virtual('fullName').get(function() {
  return `${this.artist} - ${this.name}`;
});

// Virtual for formatted duration
trackSchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return null;
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Instance method to increment play count
trackSchema.methods.incrementPlayCount = function() {
  this.playCount += 1;
  return this.save();
};

// Static method to get popular tracks
trackSchema.statics.getPopular = function(limit = 20) {
  return this.find({ isActive: true })
    .sort({ popularity: -1, playCount: -1 })
    .limit(limit)
    .populate('moods', 'name emoji color');
};

// Static method to get tracks by mood
trackSchema.statics.getByMood = function(moodId, limit = 20) {
  return this.find({ 
    moods: moodId,
    isActive: true 
  })
    .sort({ popularity: -1, playCount: -1 })
    .limit(limit)
    .populate('moods', 'name emoji color');
};

// Static method to search tracks
trackSchema.statics.search = function(query, limit = 20) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    isActive: true,
    $or: [
      { name: { $regex: searchRegex } },
      { artist: { $regex: searchRegex } },
      { album: { $regex: searchRegex } },
      { genres: { $regex: searchRegex } },
    ],
  })
    .sort({ popularity: -1, playCount: -1 })
    .limit(limit)
    .populate('moods', 'name emoji color');
};

module.exports = mongoose.model('Track', trackSchema);