const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Playlist name is required'],
    trim: true,
    maxlength: [100, 'Playlist name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Playlist description cannot exceed 500 characters'],
  },
  image: {
    type: String,
    trim: true,
    default: null,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Image URL must be a valid HTTP/HTTPS URL',
    },
  },
  tracks: [{
    track: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  mood: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mood',
    required: [true, 'Playlist mood is required'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Playlist creator is required'],
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['editor', 'viewer'],
      default: 'viewer',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  isPublic: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  playCount: {
    type: Number,
    default: 0,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  totalDuration: {
    type: Number, // Total duration in seconds
    default: 0,
  },
  lastPlayed: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for better performance
playlistSchema.index({ createdBy: 1 });
playlistSchema.index({ mood: 1 });
playlistSchema.index({ isPublic: 1, isActive: 1 });
playlistSchema.index({ playCount: -1 });
playlistSchema.index({ likeCount: -1 });

// Virtual for track count
playlistSchema.virtual('trackCount').get(function() {
  return this.tracks.length;
});

// Virtual for formatted duration
playlistSchema.virtual('formattedDuration').get(function() {
  if (!this.totalDuration) return '0:00';
  const hours = Math.floor(this.totalDuration / 3600);
  const minutes = Math.floor((this.totalDuration % 3600) / 60);
  const seconds = this.totalDuration % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Pre-save middleware to calculate total duration
playlistSchema.pre('save', async function(next) {
  if (this.isModified('tracks')) {
    try {
      const Track = mongoose.model('Track');
      const trackIds = this.tracks.map(t => t.track);
      const tracks = await Track.find({ _id: { $in: trackIds } }, 'duration');
      
      this.totalDuration = tracks.reduce((total, track) => {
        return total + (track.duration || 0);
      }, 0);
    } catch (error) {
      console.error('Error calculating total duration:', error);
    }
  }
  next();
});

// Instance method to add track
playlistSchema.methods.addTrack = function(trackId, userId = null) {
  // Check if track already exists
  const existingTrack = this.tracks.find(t => t.track.toString() === trackId.toString());
  if (existingTrack) {
    throw new Error('Track already exists in playlist');
  }

  this.tracks.push({
    track: trackId,
    addedBy: userId,
  });

  return this.save();
};

// Instance method to remove track
playlistSchema.methods.removeTrack = function(trackId) {
  this.tracks = this.tracks.filter(t => t.track.toString() !== trackId.toString());
  return this.save();
};

// Instance method to increment play count
playlistSchema.methods.incrementPlayCount = function() {
  this.playCount += 1;
  this.lastPlayed = new Date();
  return this.save();
};

// Instance method to check if user can edit
playlistSchema.methods.canEdit = function(userId) {
  if (this.createdBy.toString() === userId.toString()) {
    return true;
  }
  
  const collaborator = this.collaborators.find(c => 
    c.user.toString() === userId.toString() && c.role === 'editor'
  );
  
  return !!collaborator;
};

// Static method to get public playlists
playlistSchema.statics.getPublic = function(limit = 20) {
  return this.find({ 
    isPublic: true, 
    isActive: true 
  })
    .sort({ playCount: -1, likeCount: -1 })
    .limit(limit)
    .populate('mood', 'name emoji color')
    .populate('createdBy', 'username avatar')
    .populate('tracks.track', 'name artist duration');
};

// Static method to get playlists by mood
playlistSchema.statics.getByMood = function(moodId, limit = 20) {
  return this.find({ 
    mood: moodId,
    isPublic: true,
    isActive: true 
  })
    .sort({ playCount: -1, likeCount: -1 })
    .limit(limit)
    .populate('mood', 'name emoji color')
    .populate('createdBy', 'username avatar')
    .populate('tracks.track', 'name artist duration');
};

// Static method to get user's playlists
playlistSchema.statics.getUserPlaylists = function(userId, includePrivate = true) {
  const query = { 
    createdBy: userId,
    isActive: true 
  };
  
  if (!includePrivate) {
    query.isPublic = true;
  }
  
  return this.find(query)
    .sort({ updatedAt: -1 })
    .populate('mood', 'name emoji color')
    .populate('tracks.track', 'name artist duration');
};

module.exports = mongoose.model('Playlist', playlistSchema);