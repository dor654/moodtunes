// import { get, post, put, patch } from '../utils/api';

// Mock delay for simulating API calls
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    await delay(300);
    
    // Mock user profile data
    const profile = {
      id: userId,
      username: 'music_lover',
      email: 'user@example.com',
      displayName: 'Music Lover',
      avatar: `https://ui-avatars.com/api/?name=Music+Lover&background=6366f1&color=fff&size=200`,
      bio: 'Love discovering new music and sharing great tunes!',
      location: 'Music City',
      joinedAt: '2023-01-15T00:00:00.000Z',
      stats: {
        totalPlaylists: 12,
        totalTracks: 247,
        totalListenHours: 156,
        favoriteGenres: ['Pop', 'Rock', 'Electronic'],
      },
      preferences: {
        privateProfile: false,
        explicitContent: false,
        autoplay: true,
        highQuality: true,
        notifications: {
          newReleases: true,
          recommendations: true,
          social: false,
        },
      },
      social: {
        followers: 45,
        following: 23,
        publicPlaylists: 8,
      },
    };
    
    return profile;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch user profile');
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const allowedFields = [
      'displayName',
      'bio',
      'location',
      'avatar',
      'preferences',
    ];
    
    // Filter out non-allowed fields
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});
    
    if (Object.keys(filteredUpdates).length === 0) {
      throw new Error('No valid fields to update');
    }
    
    await delay(500);
    
    return {
      userId,
      updatedFields: Object.keys(filteredUpdates),
      updatedAt: new Date().toISOString(),
      message: 'Profile updated successfully',
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to update profile');
  }
};

// Get user preferences
export const getUserPreferences = async (userId) => {
  try {
    await delay(200);
    
    const preferences = {
      music: {
        explicitContent: false,
        autoplay: true,
        crossfade: 0,
        volume: 0.8,
        equalizer: {
          preset: 'flat',
          custom: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      },
      playback: {
        quality: 'high', // 'low', 'medium', 'high', 'very_high'
        downloadQuality: 'high',
        offlineMode: false,
        gaplessPlayback: true,
      },
      notifications: {
        newReleases: true,
        recommendations: true,
        social: false,
        playlistUpdates: true,
        email: true,
        push: false,
      },
      privacy: {
        privateSession: false,
        shareActivity: true,
        showProfile: true,
        recentlyPlayed: true,
      },
      appearance: {
        theme: 'dark',
        compactMode: false,
        showFriendActivity: true,
        language: 'en',
      },
    };
    
    return preferences;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch user preferences');
  }
};

// Update user preferences
export const updateUserPreferences = async (userId, preferences) => {
  try {
    if (!preferences || typeof preferences !== 'object') {
      throw new Error('Invalid preferences data');
    }
    
    await delay(400);
    
    return {
      userId,
      updatedAt: new Date().toISOString(),
      message: 'Preferences updated successfully',
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to update preferences');
  }
};

// Get user's saved tracks
export const getSavedTracks = async (userId, offset = 0, limit = 50) => {
  try {
    await delay(400);
    
    // Mock saved tracks
    const savedTracks = [
      {
        id: 'saved_1',
        savedAt: '2023-12-01T00:00:00.000Z',
        track: {
          id: 'track1',
          name: 'Shape of You',
          artist: 'Ed Sheeran',
          album: '÷ (Divide)',
          duration: '3:53',
          image: 'https://i.scdn.co/image/ab67616d00001e02b46f74097655d7f353caab14',
        },
      },
      // Add more mock saved tracks as needed
    ];
    
    return {
      tracks: savedTracks.slice(offset, offset + limit),
      total: savedTracks.length,
      offset,
      limit,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch saved tracks');
  }
};

// Get user's playlists
export const getUserPlaylists = async (userId, offset = 0, limit = 20) => {
  try {
    await delay(300);
    
    // Mock user playlists
    const userPlaylists = [
      {
        id: 'user_playlist_1',
        name: 'My Favorites',
        description: 'My all-time favorite songs',
        image: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=♪',
        tracks: 25,
        isPublic: false,
        isOwner: true,
        createdAt: '2023-11-15T00:00:00.000Z',
        updatedAt: '2023-12-01T00:00:00.000Z',
      },
      {
        id: 'user_playlist_2',
        name: 'Workout Mix',
        description: 'High energy tracks for gym sessions',
        image: 'https://via.placeholder.com/300x300/ef4444/ffffff?text=💪',
        tracks: 18,
        isPublic: true,
        isOwner: true,
        createdAt: '2023-11-20T00:00:00.000Z',
        updatedAt: '2023-11-28T00:00:00.000Z',
      },
    ];
    
    return {
      playlists: userPlaylists.slice(offset, offset + limit),
      total: userPlaylists.length,
      offset,
      limit,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch user playlists');
  }
};

// Get user's listening history
export const getUserHistory = async (userId, limit = 50) => {
  try {
    await delay(400);
    
    // Mock listening history
    const history = [
      {
        playedAt: '2023-12-01T14:30:00.000Z',
        track: {
          id: 'track1',
          name: 'Shape of You',
          artist: 'Ed Sheeran',
          album: '÷ (Divide)',
          duration: '3:53',
          image: 'https://i.scdn.co/image/ab67616d00001e02b46f74097655d7f353caab14',
        },
        context: {
          type: 'playlist',
          id: 'playlist1',
          name: 'Daily Mix 1',
        },
      },
      // Add more history items as needed
    ];
    
    return {
      history: history.slice(0, limit),
      total: history.length,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch listening history');
  }
};

// Follow/Unfollow user
export const toggleUserFollow = async (userId, targetUserId, isFollowing) => {
  try {
    await delay(300);
    
    return {
      userId,
      targetUserId,
      isFollowing: !isFollowing,
      message: isFollowing ? 'User unfollowed' : 'User followed',
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to update follow status');
  }
};

// Get user's followers
export const getUserFollowers = async (userId, offset = 0, limit = 20) => {
  try {
    await delay(300);
    
    // Mock followers
    const followers = [
      {
        id: 'follower_1',
        username: 'music_fan_1',
        displayName: 'Music Fan',
        avatar: 'https://ui-avatars.com/api/?name=Music+Fan&background=8b5cf6&color=fff',
        followedAt: '2023-11-15T00:00:00.000Z',
      },
      // Add more followers as needed
    ];
    
    return {
      followers: followers.slice(offset, offset + limit),
      total: followers.length,
      offset,
      limit,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch followers');
  }
};

// Get users that this user follows
export const getUserFollowing = async (userId, offset = 0, limit = 20) => {
  try {
    await delay(300);
    
    // Mock following
    const following = [
      {
        id: 'following_1',
        username: 'indie_lover',
        displayName: 'Indie Music Lover',
        avatar: 'https://ui-avatars.com/api/?name=Indie+Lover&background=10b981&color=fff',
        followedAt: '2023-10-20T00:00:00.000Z',
      },
      // Add more following as needed
    ];
    
    return {
      following: following.slice(offset, offset + limit),
      total: following.length,
      offset,
      limit,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch following');
  }
};

// Delete user account
export const deleteUserAccount = async (userId, password) => {
  try {
    if (!password) {
      throw new Error('Password confirmation required');
    }
    
    await delay(1000);
    
    return {
      userId,
      deletedAt: new Date().toISOString(),
      message: 'Account deleted successfully',
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to delete account');
  }
};