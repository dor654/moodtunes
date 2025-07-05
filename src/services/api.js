import { moods, mockPlaylists, mockTracks } from "./mockData";

// Mock API service (will be replaced with real API calls later)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchMoods = async () => {
  // Simulate API call
  await delay(500);
  return moods;
};

export const fetchPlaylistsByMood = async (moodId) => {
  // Simulate API call
  await delay(800);
  return mockPlaylists.filter((playlist) => playlist.mood === moodId);
};

export const fetchTracksByPlaylist = async (playlistId) => {
  // Simulate API call
  await delay(700);
  // For now, return all mock tracks for any playlist
  return mockTracks;
};

export const loginUser = async (email, password) => {
  // Simulate API call
  await delay(1000);
  // This is just a mock implementation
  if (email && password) {
    return {
      success: true,
      user: {
        id: "user123",
        name: "Test User",
        email,
      },
    };
  }
  throw new Error("Invalid credentials");
};

export const registerUser = async (username, email, password) => {
  // Simulate API call
  await delay(1000);
  // This is just a mock implementation
  if (username && email && password) {
    return {
      success: true,
      user: {
        id: "user123",
        name: username,
        email,
      },
    };
  }
  throw new Error("Registration failed");
};
