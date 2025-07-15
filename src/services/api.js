import { get, post } from '../utils/api';

export const fetchMoods = async () => {
  try {
    // Use hardcoded moods since they're standard
    const moods = [
      {
        id: "happy",
        name: "Happy",
        emoji: "😊",
        color: "#FFD700",
        description: "Upbeat and cheerful music to enhance your positive mood",
      },
      {
        id: "sad",
        name: "Sad",
        emoji: "😢",
        color: "#4169E1",
        description: "Emotional and reflective tunes for when you're feeling down",
      },
      {
        id: "chill",
        name: "Chill",
        emoji: "😌",
        color: "#98FB98",
        description: "Relaxing and laid-back music to help you unwind",
      },
      {
        id: "energetic",
        name: "Energetic",
        emoji: "💪",
        color: "#FF6347",
        description: "High-energy tracks to keep you motivated and moving",
      },
      {
        id: "focus",
        name: "Focus",
        emoji: "🧘",
        color: "#DDA0DD",
        description: "Concentration-enhancing music for work or study",
      },
      {
        id: "party",
        name: "Party",
        emoji: "🎉",
        color: "#FF1493",
        description: "Dance and party hits to elevate any celebration",
      },
      {
        id: "sleep",
        name: "Sleep",
        emoji: "😴",
        color: "#191970",
        description: "Calm and soothing sounds for better sleep",
      },
    ];
    return moods;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch moods');
  }
};

export const fetchPlaylistsByMood = async (moodId) => {
  try {
    const params = new URLSearchParams({
      mood: moodId,
      type: 'playlists',
      limit: 20
    });

    const response = await get(`/music/recommendations?${params}`);
    return response.data.recommendations || [];
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch playlists');
  }
};

export const fetchTracksByPlaylist = async (playlistId) => {
  try {
    const response = await get(`/music/playlists/${playlistId}`);
    return response.data.playlist.tracks || [];
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch playlist tracks');
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await post('/auth/login', { email, password });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await post('/auth/register', { username, email, password });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Registration failed');
  }
};
