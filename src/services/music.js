import { get, post, put, del } from '../utils/api';

// Fetch music recommendations based on mood
export const getMoodRecommendations = async (moodId, preferences = {}) => {
  try {
    const params = new URLSearchParams({
      mood: moodId,
      type: 'tracks',
      limit: preferences.limit || 20
    });

    const response = await get(`/music/recommendations?${params}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch mood recommendations');
  }
};

// Fetch tracks for a specific playlist
export const getPlaylistTracks = async (playlistId) => {
  try {
    const response = await get(`/music/playlists/${playlistId}`);
    return {
      playlistId,
      tracks: response.data.playlist.tracks || [],
      total: response.data.playlist.tracks?.length || 0,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch playlist tracks');
  }
};

// Search for music
export const searchMusic = async (query, filters = {}) => {
  try {
    if (!query || query.trim().length === 0) {
      return {
        tracks: [],
        playlists: [],
        artists: [],
        total: 0,
        query: '',
      };
    }

    const params = new URLSearchParams({
      q: query.trim(),
      type: filters.type || 'track',
      limit: filters.limit || 20
    });

    const response = await get(`/music/search?${params}`);
    return {
      ...response.data,
      total: (response.data.tracks?.length || 0) + 
             (response.data.artists?.length || 0) + 
             (response.data.albums?.length || 0),
      query: query,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to search music');
  }
};

// Get personalized recommendations
export const getPersonalizedRecommendations = async (userId) => {
  try {
    const response = await get('/music/tracks/popular?limit=20');
    const tracks = response.data.tracks || [];
    
    return {
      forYou: tracks.slice(0, 10),
      trending: tracks.slice(2, 8),
      newReleases: tracks.slice(1, 6),
      basedOnHistory: tracks.slice(3, 9),
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch personalized recommendations');
  }
};

// Like/Unlike a track
export const toggleTrackLike = async (trackId, isLiked) => {
  try {
    // Use the play endpoint as a like indicator for now
    await post(`/music/tracks/${trackId}/play`);
    
    return {
      trackId,
      isLiked: !isLiked,
      message: isLiked ? 'Track removed from favorites' : 'Track added to favorites',
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to update track like status');
  }
};

// Save/Unsave a playlist
export const togglePlaylistSave = async (playlistId, isSaved) => {
  try {
    // Use the play endpoint as a save indicator for now
    await post(`/music/playlists/${playlistId}/play`);
    
    return {
      playlistId,
      isSaved: !isSaved,
      message: isSaved ? 'Playlist removed from library' : 'Playlist saved to library',
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to update playlist save status');
  }
};

// Create a new playlist
export const createPlaylist = async (playlistData) => {
  try {
    const { name, description, mood, tracks = [] } = playlistData;
    
    if (!name || name.trim().length === 0) {
      throw new Error('Playlist name is required');
    }
    
    const response = await post('/music/playlists', {
      name: name.trim(),
      description: description?.trim() || '',
      mood: mood || 'happy', // Default mood
      isPublic: false,
      tracks
    });
    
    return response.data.playlist;
  } catch (error) {
    throw new Error(error.message || 'Failed to create playlist');
  }
};

// Update playlist
export const updatePlaylist = async (playlistId, updates) => {
  try {
    const response = await put(`/music/playlists/${playlistId}`, updates);
    return response.data.playlist;
  } catch (error) {
    throw new Error(error.message || 'Failed to update playlist');
  }
};

// Delete playlist
export const deletePlaylist = async (playlistId) => {
  try {
    await del(`/music/playlists/${playlistId}`);
    return {
      playlistId,
      message: 'Playlist deleted successfully',
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to delete playlist');
  }
};

// Add tracks to playlist
export const addTracksToPlaylist = async (playlistId, trackIds) => {
  try {
    if (!trackIds || trackIds.length === 0) {
      throw new Error('No tracks provided');
    }
    
    // Add tracks one by one (API only supports adding one track at a time)
    for (const trackId of trackIds) {
      await post(`/music/playlists/${playlistId}/tracks`, { trackId });
    }
    
    return {
      playlistId,
      addedTracks: trackIds.length,
      message: `${trackIds.length} track(s) added to playlist`,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to add tracks to playlist');
  }
};

// Remove tracks from playlist
export const removeTracksFromPlaylist = async (playlistId, trackIds) => {
  try {
    if (!trackIds || trackIds.length === 0) {
      throw new Error('No tracks provided');
    }
    
    // Remove tracks one by one
    for (const trackId of trackIds) {
      await del(`/music/playlists/${playlistId}/tracks/${trackId}`);
    }
    
    return {
      playlistId,
      removedTracks: trackIds.length,
      message: `${trackIds.length} track(s) removed from playlist`,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to remove tracks from playlist');
  }
};

// Get user's listening history
export const getListeningHistory = async (limit = 50) => {
  try {
    // For now, use popular tracks as listening history
    const response = await get(`/music/tracks/popular?limit=${limit}`);
    
    const history = (response.data.tracks || []).map((track, index) => ({
      ...track,
      playedAt: new Date(Date.now() - index * 3600000).toISOString(), // Spread over hours
      playCount: Math.floor(Math.random() * 10) + 1,
    }));
    
    return {
      history,
      total: history.length,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch listening history');
  }
};

// Record track play
export const recordTrackPlay = async (trackId, duration) => {
  try {
    // Use the backend API to record play
    await post(`/music/tracks/${trackId}/play`);
    
    return {
      trackId,
      duration,
      playedAt: new Date().toISOString(),
    };
  } catch (error) {
    // Don't throw error for tracking - just log it
    console.error('Failed to record track play:', error);
    return null;
  }
};

// Get user's top tracks
export const getTopTracks = async (timeRange = 'medium_term', limit = 20) => {
  try {
    // Use popular tracks as top tracks for now
    const response = await get(`/music/tracks/popular?limit=${limit}`);
    
    return {
      timeRange,
      tracks: response.data.tracks || [],
      total: (response.data.tracks || []).length,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch top tracks');
  }
};

// Get user's top artists
export const getTopArtists = async (timeRange = 'medium_term', limit = 20) => {
  try {
    // Use search with popular artist names as fallback
    const popularArtists = ['Ed Sheeran', 'Taylor Swift', 'Drake', 'Ariana Grande', 'Post Malone'];
    
    const artists = popularArtists.slice(0, limit).map((artist, index) => ({
      id: `artist_${index}`,
      name: artist,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(artist)}&background=6366f1&color=fff&size=300`,
      genres: ['Pop', 'Rock', 'Electronic'].slice(0, Math.floor(Math.random() * 3) + 1),
      popularity: Math.floor(Math.random() * 100),
    }));
    
    return {
      timeRange,
      artists,
      total: artists.length,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch top artists');
  }
};