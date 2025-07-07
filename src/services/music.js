import { get, post, put, del } from '../utils/api';
import { mockTracks, mockPlaylists, moods } from './mockData';

// Mock delay for simulating API calls
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch music recommendations based on mood
export const getMoodRecommendations = async (moodId, preferences = {}) => {
  try {
    await delay(800);
    
    // Filter playlists by mood
    const moodPlaylists = mockPlaylists.filter(playlist => playlist.mood === moodId);
    
    // Return recommendations with additional metadata
    return {
      mood: moods.find(m => m.id === moodId),
      playlists: moodPlaylists,
      tracks: mockTracks, // In real app, this would be mood-specific
      total: moodPlaylists.length,
      preferences: preferences,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch mood recommendations');
  }
};

// Fetch tracks for a specific playlist
export const getPlaylistTracks = async (playlistId) => {
  try {
    await delay(500);
    
    // In real app, this would fetch tracks specific to the playlist
    return {
      playlistId,
      tracks: mockTracks,
      total: mockTracks.length,
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
        total: 0,
      };
    }

    await delay(600);
    
    const lowerQuery = query.toLowerCase();
    
    // Filter tracks by query
    const matchingTracks = mockTracks.filter(track => 
      track.name.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery) ||
      track.album.toLowerCase().includes(lowerQuery)
    );
    
    // Filter playlists by query
    const matchingPlaylists = mockPlaylists.filter(playlist =>
      playlist.name.toLowerCase().includes(lowerQuery) ||
      playlist.description.toLowerCase().includes(lowerQuery)
    );
    
    return {
      query,
      tracks: matchingTracks,
      playlists: matchingPlaylists,
      total: matchingTracks.length + matchingPlaylists.length,
      filters: filters,
    };
  } catch (error) {
    throw new Error(error.message || 'Search failed');
  }
};

// Get personalized recommendations
export const getPersonalizedRecommendations = async (userId) => {
  try {
    await delay(700);
    
    // Mock personalized recommendations based on user history
    return {
      forYou: mockTracks.slice(0, 10),
      trending: mockTracks.slice(2, 8),
      newReleases: mockTracks.slice(1, 6),
      basedOnHistory: mockTracks.slice(3, 9),
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch personalized recommendations');
  }
};

// Like/Unlike a track
export const toggleTrackLike = async (trackId, isLiked) => {
  try {
    await delay(300);
    
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
    await delay(300);
    
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
    const { name, description, tracks = [] } = playlistData;
    
    if (!name || name.trim().length === 0) {
      throw new Error('Playlist name is required');
    }
    
    await delay(500);
    
    const newPlaylist = {
      id: `playlist_${Date.now()}`,
      name: name.trim(),
      description: description?.trim() || '',
      image: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=♪',
      tracks: tracks.length,
      mood: 'custom',
      createdAt: new Date().toISOString(),
      isCustom: true,
    };
    
    return newPlaylist;
  } catch (error) {
    throw new Error(error.message || 'Failed to create playlist');
  }
};

// Update playlist
export const updatePlaylist = async (playlistId, updates) => {
  try {
    await delay(400);
    
    return {
      playlistId,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to update playlist');
  }
};

// Delete playlist
export const deletePlaylist = async (playlistId) => {
  try {
    await delay(300);
    
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
    
    await delay(400);
    
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
    
    await delay(300);
    
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
    await delay(400);
    
    // Mock listening history
    const history = mockTracks.slice(0, limit).map((track, index) => ({
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
    await delay(100);
    
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
    await delay(500);
    
    // Mock top tracks based on time range
    const shuffledTracks = [...mockTracks].sort(() => Math.random() - 0.5);
    
    return {
      timeRange,
      tracks: shuffledTracks.slice(0, limit),
      total: Math.min(limit, shuffledTracks.length),
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch top tracks');
  }
};

// Get user's top artists
export const getTopArtists = async (timeRange = 'medium_term', limit = 20) => {
  try {
    await delay(500);
    
    // Extract unique artists from mock tracks
    const artists = [...new Set(mockTracks.map(track => track.artist))]
      .slice(0, limit)
      .map((artist, index) => ({
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