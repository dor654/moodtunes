const Track = require('../models/Track');
const Playlist = require('../models/Playlist');
const Mood = require('../models/Mood');
const ApiResponse = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/error');
const spotifyService = require('../services/spotifyService');

/**
 * @desc    Get music recommendations based on mood
 * @route   GET /api/music/recommendations
 * @access  Public
 */
const getRecommendations = asyncHandler(async (req, res) => {
  const { mood, limit = 20, type = 'tracks' } = req.query;

  if (!mood) {
    return res.status(400).json(
      ApiResponse.error('Mood parameter is required')
    );
  }

  try {
    let recommendations;
    
    if (type === 'tracks') {
      // Get recommendations from Spotify
      recommendations = await spotifyService.getRecommendationsByMood(mood, parseInt(limit));
    } else if (type === 'playlists') {
      // Get featured playlists for playlists type
      recommendations = await spotifyService.getFeaturedPlaylists(parseInt(limit));
    } else {
      return res.status(400).json(
        ApiResponse.error('Type must be either "tracks" or "playlists"')
      );
    }

    // Find mood info for response
    const moodInfo = {
      id: mood,
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      emoji: getMoodEmoji(mood),
      color: getMoodColor(mood),
    };

    res.json(
      ApiResponse.success({
        mood: moodInfo,
        type,
        recommendations,
        total: recommendations.length,
      }, `${type} recommendations retrieved successfully`)
    );
  } catch (error) {
    console.error('Error getting recommendations:', error.message);
    res.status(500).json(
      ApiResponse.error('Failed to fetch recommendations')
    );
  }
});

// Helper functions for mood metadata
const getMoodEmoji = (mood) => {
  const moodEmojis = {
    happy: '😊',
    sad: '😢', 
    chill: '😌',
    energetic: '💪',
    focus: '🧘',
    party: '🎉',
    sleep: '😴'
  };
  return moodEmojis[mood] || '🎵';
};

const getMoodColor = (mood) => {
  const moodColors = {
    happy: '#FFD700',
    sad: '#4169E1',
    chill: '#98FB98', 
    energetic: '#FF6347',
    focus: '#DDA0DD',
    party: '#FF1493',
    sleep: '#191970'
  };
  return moodColors[mood] || '#808080';
};

/**
 * @desc    Search tracks
 * @route   GET /api/music/search/tracks
 * @access  Public
 */
const searchTracks = asyncHandler(async (req, res) => {
  const { q: query, limit = 20, page = 1 } = req.query;

  if (!query) {
    return res.status(400).json(
      ApiResponse.error('Search query is required')
    );
  }

  try {
    const searchResults = await spotifyService.search(query, ['track'], parseInt(limit));

    res.json(
      ApiResponse.success({
        query,
        tracks: searchResults.tracks || [],
        total: (searchResults.tracks || []).length,
        page: parseInt(page),
      }, 'Tracks search completed')
    );
  } catch (error) {
    console.error('Error searching tracks:', error.message);
    res.status(500).json(
      ApiResponse.error('Failed to search tracks')
    );
  }
});

/**
 * @desc    Search music (tracks, artists, albums)
 * @route   GET /api/music/search
 * @access  Public
 */
const searchMusic = asyncHandler(async (req, res) => {
  const { q: query, type = 'track', limit = 20 } = req.query;

  if (!query) {
    return res.status(400).json(
      ApiResponse.error('Search query is required')
    );
  }

  try {
    const types = type.split(',').map(t => t.trim());
    const searchResults = await spotifyService.search(query, types, parseInt(limit));

    res.json(
      ApiResponse.success({
        query,
        ...searchResults,
      }, 'Music search completed')
    );
  } catch (error) {
    console.error('Error searching music:', error.message);
    res.status(500).json(
      ApiResponse.error('Failed to search music')
    );
  }
});

/**
 * @desc    Get popular tracks
 * @route   GET /api/music/tracks/popular
 * @access  Public
 */
const getPopularTracks = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  try {
    // Get popular tracks from Spotify's featured playlists or trending
    const playlists = await spotifyService.getFeaturedPlaylists(5);
    
    if (playlists.length > 0) {
      // Get tracks from the first featured playlist
      const tracks = await spotifyService.getPlaylistTracks(playlists[0].id, parseInt(limit));
      
      res.json(
        ApiResponse.success({
          tracks,
          total: tracks.length,
        }, 'Popular tracks retrieved successfully')
      );
    } else {
      // Fallback to happy mood recommendations
      const tracks = await spotifyService.getRecommendationsByMood('happy', parseInt(limit));
      
      res.json(
        ApiResponse.success({
          tracks,
          total: tracks.length,
        }, 'Popular tracks retrieved successfully')
      );
    }
  } catch (error) {
    console.error('Error getting popular tracks:', error.message);
    res.status(500).json(
      ApiResponse.error('Failed to fetch popular tracks')
    );
  }
});

/**
 * @desc    Get track by ID
 * @route   GET /api/music/tracks/:id
 * @access  Public
 */
const getTrack = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.params.id)
    .populate('moods', 'name emoji color')
    .populate('addedBy', 'username avatar');

  if (!track || !track.isActive) {
    return res.status(404).json(
      ApiResponse.notFound('Track not found')
    );
  }

  res.json(
    ApiResponse.success({
      track,
    }, 'Track retrieved successfully')
  );
});

/**
 * @desc    Create a new track (Admin/Content management functionality)
 * @route   POST /api/music/tracks
 * @access  Private
 */
const createTrack = asyncHandler(async (req, res) => {
  const {
    name,
    artist,
    album,
    duration,
    preview_url,
    image,
    externalIds,
    audioFeatures,
    genres,
    moods,
    popularity,
  } = req.body;

  // Check if track already exists
  const existingTrack = await Track.findOne({
    name: name.trim(),
    artist: artist.trim(),
  });

  if (existingTrack) {
    return res.status(409).json(
      ApiResponse.conflict('Track with this name and artist already exists')
    );
  }

  const track = await Track.create({
    name: name.trim(),
    artist: artist.trim(),
    album: album?.trim(),
    duration,
    preview_url,
    image,
    externalIds,
    audioFeatures,
    genres: genres?.map(genre => genre.toLowerCase().trim()),
    moods,
    popularity: popularity || 0,
    addedBy: req.user._id,
  });

  await track.populate('moods', 'name emoji color');

  res.status(201).json(
    ApiResponse.success({
      track,
    }, 'Track created successfully')
  );
});

/**
 * @desc    Update track
 * @route   PUT /api/music/tracks/:id
 * @access  Private
 */
const updateTrack = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.params.id);

  if (!track) {
    return res.status(404).json(
      ApiResponse.notFound('Track not found')
    );
  }

  // Check if user can edit (only creator or admin)
  if (track.addedBy && track.addedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json(
      ApiResponse.forbidden('You can only edit tracks you added')
    );
  }

  const updateFields = [
    'name', 'artist', 'album', 'duration', 'preview_url', 'image',
    'externalIds', 'audioFeatures', 'genres', 'moods', 'popularity', 'isActive'
  ];

  updateFields.forEach(field => {
    if (req.body[field] !== undefined) {
      if (field === 'genres' && Array.isArray(req.body[field])) {
        track[field] = req.body[field].map(genre => genre.toLowerCase().trim());
      } else if (typeof req.body[field] === 'string') {
        track[field] = req.body[field].trim();
      } else {
        track[field] = req.body[field];
      }
    }
  });

  await track.save();
  await track.populate('moods', 'name emoji color');

  res.json(
    ApiResponse.success({
      track,
    }, 'Track updated successfully')
  );
});

/**
 * @desc    Delete track
 * @route   DELETE /api/music/tracks/:id
 * @access  Private
 */
const deleteTrack = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.params.id);

  if (!track) {
    return res.status(404).json(
      ApiResponse.notFound('Track not found')
    );
  }

  // Check if user can delete (only creator or admin)
  if (track.addedBy && track.addedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json(
      ApiResponse.forbidden('You can only delete tracks you added')
    );
  }

  // Soft delete
  track.isActive = false;
  await track.save();

  res.json(
    ApiResponse.success(null, 'Track deleted successfully')
  );
});

/**
 * @desc    Increment track play count
 * @route   POST /api/music/tracks/:id/play
 * @access  Public
 */
const playTrack = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.params.id);

  if (!track || !track.isActive) {
    return res.status(404).json(
      ApiResponse.notFound('Track not found')
    );
  }

  await track.incrementPlayCount();

  res.json(
    ApiResponse.success({
      playCount: track.playCount,
    }, 'Play count updated')
  );
});

/**
 * @desc    Get user's playlists
 * @route   GET /api/music/playlists
 * @access  Private
 */
const getUserPlaylists = asyncHandler(async (req, res) => {
  const { includePrivate = true } = req.query;

  const playlists = await Playlist.getUserPlaylists(
    req.user._id, 
    includePrivate === 'true'
  );

  res.json(
    ApiResponse.success({
      playlists,
      total: playlists.length,
    }, 'User playlists retrieved successfully')
  );
});

/**
 * @desc    Get public playlists
 * @route   GET /api/music/playlists/public
 * @access  Public
 */
const getPublicPlaylists = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const playlists = await Playlist.getPublic(parseInt(limit));

  res.json(
    ApiResponse.success({
      playlists,
      total: playlists.length,
    }, 'Public playlists retrieved successfully')
  );
});

/**
 * @desc    Get playlist by ID
 * @route   GET /api/music/playlists/:id
 * @access  Public
 */
const getPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id)
    .populate('mood', 'name emoji color')
    .populate('createdBy', 'username avatar')
    .populate('tracks.track', 'name artist duration image preview_url')
    .populate('tracks.addedBy', 'username');

  if (!playlist || !playlist.isActive) {
    return res.status(404).json(
      ApiResponse.notFound('Playlist not found')
    );
  }

  // Check if user has access to private playlist
  if (!playlist.isPublic && req.user?._id.toString() !== playlist.createdBy._id.toString()) {
    const isCollaborator = playlist.collaborators.some(
      c => c.user.toString() === req.user?._id.toString()
    );
    
    if (!isCollaborator) {
      return res.status(403).json(
        ApiResponse.forbidden('Access denied to private playlist')
      );
    }
  }

  res.json(
    ApiResponse.success({
      playlist,
    }, 'Playlist retrieved successfully')
  );
});

/**
 * @desc    Create a new playlist
 * @route   POST /api/music/playlists
 * @access  Private
 */
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, mood, isPublic = false, tracks = [] } = req.body;

  // Verify mood exists
  const moodDoc = await Mood.findById(mood);
  if (!moodDoc || !moodDoc.isActive) {
    return res.status(404).json(
      ApiResponse.notFound('Mood not found')
    );
  }

  const playlist = await Playlist.create({
    name: name.trim(),
    description: description?.trim(),
    mood,
    createdBy: req.user._id,
    isPublic,
    tracks: tracks.map(trackId => ({
      track: trackId,
      addedBy: req.user._id,
    })),
  });

  await playlist.populate([
    { path: 'mood', select: 'name emoji color' },
    { path: 'tracks.track', select: 'name artist duration' },
  ]);

  res.status(201).json(
    ApiResponse.success({
      playlist,
    }, 'Playlist created successfully')
  );
});

/**
 * @desc    Update playlist
 * @route   PUT /api/music/playlists/:id
 * @access  Private
 */
const updatePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json(
      ApiResponse.notFound('Playlist not found')
    );
  }

  // Check if user can edit
  if (!playlist.canEdit(req.user._id)) {
    return res.status(403).json(
      ApiResponse.forbidden('You can only edit your own playlists or playlists you collaborate on')
    );
  }

  const { name, description, mood, isPublic, tags } = req.body;

  if (name) playlist.name = name.trim();
  if (description !== undefined) playlist.description = description?.trim();
  if (mood) {
    // Verify new mood exists
    const moodDoc = await Mood.findById(mood);
    if (!moodDoc || !moodDoc.isActive) {
      return res.status(404).json(
        ApiResponse.notFound('Mood not found')
      );
    }
    playlist.mood = mood;
  }
  if (typeof isPublic === 'boolean') playlist.isPublic = isPublic;
  if (tags) playlist.tags = tags.map(tag => tag.toLowerCase().trim());

  await playlist.save();
  await playlist.populate('mood', 'name emoji color');

  res.json(
    ApiResponse.success({
      playlist,
    }, 'Playlist updated successfully')
  );
});

/**
 * @desc    Delete playlist
 * @route   DELETE /api/music/playlists/:id
 * @access  Private
 */
const deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json(
      ApiResponse.notFound('Playlist not found')
    );
  }

  // Only creator can delete
  if (playlist.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json(
      ApiResponse.forbidden('You can only delete your own playlists')
    );
  }

  // Soft delete
  playlist.isActive = false;
  await playlist.save();

  res.json(
    ApiResponse.success(null, 'Playlist deleted successfully')
  );
});

/**
 * @desc    Add track to playlist
 * @route   POST /api/music/playlists/:id/tracks
 * @access  Private
 */
const addTrackToPlaylist = asyncHandler(async (req, res) => {
  const { trackId } = req.body;
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json(
      ApiResponse.notFound('Playlist not found')
    );
  }

  // Check if user can edit
  if (!playlist.canEdit(req.user._id)) {
    return res.status(403).json(
      ApiResponse.forbidden('You can only edit your own playlists or playlists you collaborate on')
    );
  }

  // Verify track exists
  const track = await Track.findById(trackId);
  if (!track || !track.isActive) {
    return res.status(404).json(
      ApiResponse.notFound('Track not found')
    );
  }

  try {
    await playlist.addTrack(trackId, req.user._id);
    await playlist.populate('tracks.track', 'name artist duration');

    res.json(
      ApiResponse.success({
        playlist,
      }, 'Track added to playlist successfully')
    );
  } catch (error) {
    if (error.message === 'Track already exists in playlist') {
      return res.status(409).json(
        ApiResponse.conflict('Track already exists in playlist')
      );
    }
    throw error;
  }
});

/**
 * @desc    Remove track from playlist
 * @route   DELETE /api/music/playlists/:id/tracks/:trackId
 * @access  Private
 */
const removeTrackFromPlaylist = asyncHandler(async (req, res) => {
  const { trackId } = req.params;
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json(
      ApiResponse.notFound('Playlist not found')
    );
  }

  // Check if user can edit
  if (!playlist.canEdit(req.user._id)) {
    return res.status(403).json(
      ApiResponse.forbidden('You can only edit your own playlists or playlists you collaborate on')
    );
  }

  await playlist.removeTrack(trackId);

  res.json(
    ApiResponse.success(null, 'Track removed from playlist successfully')
  );
});

/**
 * @desc    Increment playlist play count
 * @route   POST /api/music/playlists/:id/play
 * @access  Public
 */
const playPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist || !playlist.isActive) {
    return res.status(404).json(
      ApiResponse.notFound('Playlist not found')
    );
  }

  await playlist.incrementPlayCount();

  res.json(
    ApiResponse.success({
      playCount: playlist.playCount,
    }, 'Play count updated')
  );
});

module.exports = {
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
};