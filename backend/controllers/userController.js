const User = require('../models/User');
const Playlist = require('../models/Playlist');
const Track = require('../models/Track');
const ApiResponse = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/error');
const bcrypt = require('bcryptjs');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('favorites.tracks', 'name artist image duration')
    .populate('favorites.playlists', 'name description image trackCount')
    .populate('preferences.recentMoods.mood', 'name emoji color');

  res.json(
    ApiResponse.success({
      user: user.getPublicProfile(),
    }, 'Profile retrieved successfully')
  );
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { username, email, preferences } = req.body;
  
  const user = await User.findById(req.user._id);

  // Check if username or email already exists (if they're being changed)
  if (username && username !== user.username) {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json(
        ApiResponse.conflict('Username already exists')
      );
    }
    user.username = username;
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json(
        ApiResponse.conflict('Email already exists')
      );
    }
    user.email = email.toLowerCase();
  }

  // Update preferences
  if (preferences) {
    if (preferences.favoriteGenres) {
      user.preferences.favoriteGenres = preferences.favoriteGenres;
    }
    if (preferences.playbackSettings) {
      user.preferences.playbackSettings = {
        ...user.preferences.playbackSettings,
        ...preferences.playbackSettings,
      };
    }
  }

  await user.save();

  res.json(
    ApiResponse.success({
      user: user.getPublicProfile(),
    }, 'Profile updated successfully')
  );
});

/**
 * @desc    Change user password
 * @route   PUT /api/users/password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json(
      ApiResponse.error('Current password is incorrect', 400)
    );
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json(
    ApiResponse.success(null, 'Password changed successfully')
  );
});

/**
 * @desc    Add track to favorites
 * @route   POST /api/users/favorites/tracks/:trackId
 * @access  Private
 */
const addFavoriteTrack = asyncHandler(async (req, res) => {
  const { trackId } = req.params;

  // Verify track exists
  const track = await Track.findById(trackId);
  if (!track) {
    return res.status(404).json(
      ApiResponse.notFound('Track not found')
    );
  }

  const user = await User.findById(req.user._id);

  // Check if already in favorites
  if (user.favorites.tracks.includes(trackId)) {
    return res.status(409).json(
      ApiResponse.conflict('Track already in favorites')
    );
  }

  user.favorites.tracks.push(trackId);
  await user.save();

  res.json(
    ApiResponse.success(null, 'Track added to favorites')
  );
});

/**
 * @desc    Remove track from favorites
 * @route   DELETE /api/users/favorites/tracks/:trackId
 * @access  Private
 */
const removeFavoriteTrack = asyncHandler(async (req, res) => {
  const { trackId } = req.params;

  const user = await User.findById(req.user._id);

  user.favorites.tracks = user.favorites.tracks.filter(
    id => id.toString() !== trackId
  );
  
  await user.save();

  res.json(
    ApiResponse.success(null, 'Track removed from favorites')
  );
});

/**
 * @desc    Add playlist to favorites
 * @route   POST /api/users/favorites/playlists/:playlistId
 * @access  Private
 */
const addFavoritePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  // Verify playlist exists and is public or user has access
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    return res.status(404).json(
      ApiResponse.notFound('Playlist not found')
    );
  }

  if (!playlist.isPublic && playlist.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json(
      ApiResponse.forbidden('Cannot add private playlist to favorites')
    );
  }

  const user = await User.findById(req.user._id);

  // Check if already in favorites
  if (user.favorites.playlists.includes(playlistId)) {
    return res.status(409).json(
      ApiResponse.conflict('Playlist already in favorites')
    );
  }

  user.favorites.playlists.push(playlistId);
  await user.save();

  res.json(
    ApiResponse.success(null, 'Playlist added to favorites')
  );
});

/**
 * @desc    Remove playlist from favorites
 * @route   DELETE /api/users/favorites/playlists/:playlistId
 * @access  Private
 */
const removeFavoritePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const user = await User.findById(req.user._id);

  user.favorites.playlists = user.favorites.playlists.filter(
    id => id.toString() !== playlistId
  );
  
  await user.save();

  res.json(
    ApiResponse.success(null, 'Playlist removed from favorites')
  );
});

/**
 * @desc    Get user's favorite tracks
 * @route   GET /api/users/favorites/tracks
 * @access  Private
 */
const getFavoriteTracks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const user = await User.findById(req.user._id)
    .populate({
      path: 'favorites.tracks',
      options: { 
        limit: limit,
        skip: skip 
      },
      populate: {
        path: 'moods',
        select: 'name emoji color'
      }
    });

  const totalFavorites = user.favorites.tracks.length;
  const totalPages = Math.ceil(totalFavorites / limit);

  res.json(
    ApiResponse.success({
      tracks: user.favorites.tracks,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalFavorites,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }, 'Favorite tracks retrieved successfully')
  );
});

/**
 * @desc    Get user's favorite playlists
 * @route   GET /api/users/favorites/playlists
 * @access  Private
 */
const getFavoritePlaylists = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const user = await User.findById(req.user._id)
    .populate({
      path: 'favorites.playlists',
      options: { 
        limit: limit,
        skip: skip 
      },
      populate: [
        {
          path: 'mood',
          select: 'name emoji color'
        },
        {
          path: 'createdBy',
          select: 'username avatar'
        }
      ]
    });

  const totalFavorites = user.favorites.playlists.length;
  const totalPages = Math.ceil(totalFavorites / limit);

  res.json(
    ApiResponse.success({
      playlists: user.favorites.playlists,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalFavorites,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }, 'Favorite playlists retrieved successfully')
  );
});

/**
 * @desc    Update user's recent mood
 * @route   POST /api/users/moods/:moodId
 * @access  Private
 */
const updateRecentMood = asyncHandler(async (req, res) => {
  const { moodId } = req.params;

  const user = await User.findById(req.user._id);

  // Remove existing entry for this mood if it exists
  user.preferences.recentMoods = user.preferences.recentMoods.filter(
    item => item.mood.toString() !== moodId
  );

  // Add new entry at the beginning
  user.preferences.recentMoods.unshift({
    mood: moodId,
    timestamp: new Date(),
  });

  // Keep only the last 10 recent moods
  if (user.preferences.recentMoods.length > 10) {
    user.preferences.recentMoods = user.preferences.recentMoods.slice(0, 10);
  }

  await user.save();

  res.json(
    ApiResponse.success(null, 'Recent mood updated')
  );
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  addFavoriteTrack,
  removeFavoriteTrack,
  addFavoritePlaylist,
  removeFavoritePlaylist,
  getFavoriteTracks,
  getFavoritePlaylists,
  updateRecentMood,
};