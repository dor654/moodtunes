const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const {
  validateProfileUpdate,
  validatePasswordChange,
  validateObjectId,
  validatePagination,
} = require('../middleware/validators');

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, validateProfileUpdate, updateProfile);

/**
 * @route   PUT /api/users/password
 * @desc    Change user password
 * @access  Private
 */
router.put('/password', authenticate, validatePasswordChange, changePassword);

/**
 * @route   POST /api/users/favorites/tracks/:trackId
 * @desc    Add track to favorites
 * @access  Private
 */
router.post('/favorites/tracks/:trackId', authenticate, validateObjectId('trackId'), addFavoriteTrack);

/**
 * @route   DELETE /api/users/favorites/tracks/:trackId
 * @desc    Remove track from favorites
 * @access  Private
 */
router.delete('/favorites/tracks/:trackId', authenticate, validateObjectId('trackId'), removeFavoriteTrack);

/**
 * @route   POST /api/users/favorites/playlists/:playlistId
 * @desc    Add playlist to favorites
 * @access  Private
 */
router.post('/favorites/playlists/:playlistId', authenticate, validateObjectId('playlistId'), addFavoritePlaylist);

/**
 * @route   DELETE /api/users/favorites/playlists/:playlistId
 * @desc    Remove playlist from favorites
 * @access  Private
 */
router.delete('/favorites/playlists/:playlistId', authenticate, validateObjectId('playlistId'), removeFavoritePlaylist);

/**
 * @route   GET /api/users/favorites/tracks
 * @desc    Get user's favorite tracks
 * @access  Private
 */
router.get('/favorites/tracks', authenticate, validatePagination, getFavoriteTracks);

/**
 * @route   GET /api/users/favorites/playlists
 * @desc    Get user's favorite playlists
 * @access  Private
 */
router.get('/favorites/playlists', authenticate, validatePagination, getFavoritePlaylists);

/**
 * @route   POST /api/users/moods/:moodId
 * @desc    Update user's recent mood
 * @access  Private
 */
router.post('/moods/:moodId', authenticate, validateObjectId('moodId'), updateRecentMood);

module.exports = router;