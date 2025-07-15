const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  searchTracks,
  searchMusic,
  getPopularTracks,
  getTrack,
  createTrack,
  updateTrack,
  deleteTrack,
  playTrack,
  getUserPlaylists,
  getPublicPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  playPlaylist,
} = require('../controllers/musicController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const {
  validatePlaylistCreate,
  validateAddTrack,
  validateObjectId,
  validatePagination,
  validateSearch,
} = require('../middleware/validators');

// ===== RECOMMENDATIONS =====

/**
 * @route   GET /api/music/recommendations
 * @desc    Get music recommendations based on mood
 * @access  Public
 */
router.get('/recommendations', getRecommendations);

// ===== TRACKS =====

/**
 * @route   GET /api/music/search
 * @desc    Search music (tracks, artists, albums)  
 * @access  Public
 */
router.get('/search', validateSearch, validatePagination, searchMusic);

/**
 * @route   GET /api/music/search/tracks
 * @desc    Search tracks
 * @access  Public
 */
router.get('/search/tracks', validateSearch, validatePagination, searchTracks);

/**
 * @route   GET /api/music/tracks/popular
 * @desc    Get popular tracks
 * @access  Public
 */
router.get('/tracks/popular', getPopularTracks);

/**
 * @route   GET /api/music/tracks/:id
 * @desc    Get track by ID
 * @access  Public
 */
router.get('/tracks/:id', validateObjectId(), getTrack);

/**
 * @route   POST /api/music/tracks
 * @desc    Create a new track (Admin/Content management)
 * @access  Private
 */
router.post('/tracks', authenticate, createTrack);

/**
 * @route   PUT /api/music/tracks/:id
 * @desc    Update track
 * @access  Private
 */
router.put('/tracks/:id', authenticate, validateObjectId(), updateTrack);

/**
 * @route   DELETE /api/music/tracks/:id
 * @desc    Delete track
 * @access  Private
 */
router.delete('/tracks/:id', authenticate, validateObjectId(), deleteTrack);

/**
 * @route   POST /api/music/tracks/:id/play
 * @desc    Increment track play count
 * @access  Public
 */
router.post('/tracks/:id/play', validateObjectId(), playTrack);

// ===== PLAYLISTS =====

/**
 * @route   GET /api/music/playlists
 * @desc    Get user's playlists
 * @access  Private
 */
router.get('/playlists', authenticate, getUserPlaylists);

/**
 * @route   GET /api/music/playlists/public
 * @desc    Get public playlists
 * @access  Public
 */
router.get('/playlists/public', getPublicPlaylists);

/**
 * @route   GET /api/music/playlists/:id
 * @desc    Get playlist by ID
 * @access  Public (with access control for private playlists)
 */
router.get('/playlists/:id', optionalAuth, validateObjectId(), getPlaylist);

/**
 * @route   POST /api/music/playlists
 * @desc    Create a new playlist
 * @access  Private
 */
router.post('/playlists', authenticate, validatePlaylistCreate, createPlaylist);

/**
 * @route   PUT /api/music/playlists/:id
 * @desc    Update playlist
 * @access  Private
 */
router.put('/playlists/:id', authenticate, validateObjectId(), updatePlaylist);

/**
 * @route   DELETE /api/music/playlists/:id
 * @desc    Delete playlist
 * @access  Private
 */
router.delete('/playlists/:id', authenticate, validateObjectId(), deletePlaylist);

/**
 * @route   POST /api/music/playlists/:id/tracks
 * @desc    Add track to playlist
 * @access  Private
 */
router.post('/playlists/:id/tracks', authenticate, validateObjectId(), validateAddTrack, addTrackToPlaylist);

/**
 * @route   DELETE /api/music/playlists/:id/tracks/:trackId
 * @desc    Remove track from playlist
 * @access  Private
 */
router.delete('/playlists/:id/tracks/:trackId', authenticate, validateObjectId(), validateObjectId('trackId'), removeTrackFromPlaylist);

/**
 * @route   POST /api/music/playlists/:id/play
 * @desc    Increment playlist play count
 * @access  Public
 */
router.post('/playlists/:id/play', validateObjectId(), playPlaylist);

module.exports = router;