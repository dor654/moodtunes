const axios = require("axios");
const config = require("../config/config");

class SpotifyService {
  constructor() {
    this.isConfigured = !!(
      config.SPOTIFY_CLIENT_ID && config.SPOTIFY_CLIENT_SECRET
    );
    this.accessToken = null;
    this.tokenExpiry = null;

    if (this.isConfigured) {
      this.initializeClientCredentials();
    } else {
      console.warn("⚠️  Spotify credentials not configured. Using mock data.");
    }
  }

  /**
   * Initialize Spotify client credentials flow for app-only access
   */
  async initializeClientCredentials() {
    if (!this.isConfigured) {
      return;
    }

    try {
      const credentials = Buffer.from(
        `${config.SPOTIFY_CLIENT_ID}:${config.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64");

      const response = await axios({
        method: "POST",
        url: "https://accounts.spotify.com/api/token",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: "grant_type=client_credentials",
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

      // Test the connection with a simple API call
      try {
        const genresResponse = await axios({
          method: "GET",
          url: "https://api.spotify.com/v1/recommendations/available-genre-seeds",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
        console.log("✅ Spotify API initialized with client credentials");
        console.log(
          `📋 Available genres count: ${genresResponse.data.genres.length}`
        );
      } catch (testError) {
        console.error("❌ Failed to test Spotify API connection:", {
          message: testError.message,
          status: testError.response?.status,
          data: testError.response?.data,
        });
      }

      // Refresh token before expiry
      setTimeout(() => {
        this.initializeClientCredentials();
      }, response.data.expires_in * 1000 - 60000);
    } catch (error) {
      console.error("❌ Failed to initialize Spotify API:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      this.isConfigured = false; // Fallback to mock data
    }
  }

  /**
   * Get mock data for when Spotify API is not available
   */
  getMockTracks(mood, limit = 20) {
    const mockTracks = {
      happy: [
        {
          id: "mock-happy-1",
          name: "Happy Day",
          artist: "Sunshine Band",
          album: "Feel Good Album",
          duration: "3:24",
          image: "https://via.placeholder.com/300x300/FFD700/000000?text=Happy",
          preview_url: null,
          spotify_url: "#",
          spotify_id: "mock-happy-1",
        },
        {
          id: "mock-happy-2",
          name: "Good Vibes",
          artist: "Positive Energy",
          album: "Uplifting Songs",
          duration: "2:58",
          image: "https://via.placeholder.com/300x300/FFD700/000000?text=Happy",
          preview_url: null,
          spotify_url: "#",
          spotify_id: "mock-happy-2",
        },
      ],
      sad: [
        {
          id: "mock-sad-1",
          name: "Melancholy Melody",
          artist: "Blue Notes",
          album: "Emotional Journey",
          duration: "4:12",
          image: "https://via.placeholder.com/300x300/4169E1/FFFFFF?text=Sad",
          preview_url: null,
          spotify_url: "#",
          spotify_id: "mock-sad-1",
        },
        {
          id: "mock-sad-2",
          name: "Rainy Days",
          artist: "Melancholic Soul",
          album: "Tears & Rain",
          duration: "3:45",
          image: "https://via.placeholder.com/300x300/4169E1/FFFFFF?text=Sad",
          preview_url: null,
          spotify_url: "#",
          spotify_id: "mock-sad-2",
        },
      ],
      chill: [
        {
          id: "mock-chill-1",
          name: "Peaceful Mind",
          artist: "Zen Masters",
          album: "Relaxation Station",
          duration: "5:30",
          image: "https://via.placeholder.com/300x300/98FB98/000000?text=Chill",
          preview_url: null,
          spotify_url: "#",
          spotify_id: "mock-chill-1",
        },
      ],
      energetic: [
        {
          id: "mock-energetic-1",
          name: "Power Up",
          artist: "Energy Boosters",
          album: "High Voltage",
          duration: "3:15",
          image:
            "https://via.placeholder.com/300x300/FF6347/FFFFFF?text=Energy",
          preview_url: null,
          spotify_url: "#",
          spotify_id: "mock-energetic-1",
        },
      ],
      focus: [
        {
          id: "mock-focus-1",
          name: "Deep Concentration",
          artist: "Focus Flow",
          album: "Productivity Sounds",
          duration: "8:00",
          image: "https://via.placeholder.com/300x300/DDA0DD/000000?text=Focus",
          preview_url: null,
          spotify_url: "#",
          spotify_id: "mock-focus-1",
        },
      ],
      party: [
        {
          id: "mock-party-1",
          name: "Dance All Night",
          artist: "Party Animals",
          album: "Club Hits",
          duration: "3:42",
          image: "https://via.placeholder.com/300x300/FF1493/FFFFFF?text=Party",
          preview_url: null,
          spotify_url: "#",
          spotify_id: "mock-party-1",
        },
      ],
      sleep: [
        {
          id: "mock-sleep-1",
          name: "Dreamland",
          artist: "Sleep Sounds",
          album: "Peaceful Nights",
          duration: "10:00",
          image: "https://via.placeholder.com/300x300/191970/FFFFFF?text=Sleep",
          preview_url: null,
          spotify_url: "#",
          spotify_id: "mock-sleep-1",
        },
      ],
    };

    const tracks = mockTracks[mood] || mockTracks.chill;
    return tracks.slice(0, limit);
  }

  /**
   * Get mock playlists
   */
  getMockPlaylists(limit = 20) {
    const mockPlaylists = [
      {
        id: "mock-playlist-1",
        name: "Mood Booster Mix",
        description: "A collection of uplifting songs to brighten your day",
        image:
          "https://via.placeholder.com/300x300/6366F1/FFFFFF?text=Playlist",
        tracks: 25,
        owner: "MoodTunes",
        spotify_url: "#",
        spotify_id: "mock-playlist-1",
      },
      {
        id: "mock-playlist-2",
        name: "Chill Vibes Only",
        description: "Relaxing tracks for your peaceful moments",
        image: "https://via.placeholder.com/300x300/10B981/FFFFFF?text=Chill",
        tracks: 30,
        owner: "MoodTunes",
        spotify_url: "#",
        spotify_id: "mock-playlist-2",
      },
    ];

    return mockPlaylists.slice(0, limit);
  }

  /**
   * Map mood to Spotify recommendation parameters
   */
  getMoodParameters(mood) {
    const moodMappings = {
      happy: {
        target_valence: 0.8,
        target_energy: 0.7,
        min_valence: 0.6,
        seed_genres: ["pop", "funk", "soul"],
      },
      sad: {
        target_valence: 0.2,
        target_energy: 0.3,
        max_valence: 0.4,
        seed_genres: ["indie", "alternative", "blues"],
      },
      chill: {
        target_valence: 0.5,
        target_energy: 0.3,
        target_acousticness: 0.7,
        seed_genres: ["indie", "acoustic", "folk"],
      },
      energetic: {
        target_valence: 0.7,
        target_energy: 0.9,
        min_energy: 0.7,
        seed_genres: ["electronic", "rock", "pop"],
      },
      focus: {
        target_valence: 0.4,
        target_energy: 0.4,
        target_instrumentalness: 0.8,
        seed_genres: ["ambient", "classical", "instrumental"],
      },
      party: {
        target_valence: 0.9,
        target_energy: 0.9,
        target_danceability: 0.8,
        seed_genres: ["dance", "electronic", "pop"],
      },
      sleep: {
        target_valence: 0.3,
        target_energy: 0.1,
        target_acousticness: 0.9,
        seed_genres: ["ambient", "jazz", "classical"],
      },
    };

    return moodMappings[mood] || moodMappings.chill;
  }

  /**
   * Get track recommendations based on mood
   */
  async getRecommendationsByMood(mood, limit = 20) {
    // If Spotify is not configured or token expired, return mock data
    if (
      !this.isConfigured ||
      !this.accessToken ||
      Date.now() > this.tokenExpiry
    ) {
      console.log(`🎵 Using mock data for mood: ${mood}`);
      return this.getMockTracks(mood, limit);
    }

    try {
      const moodParams = this.getMoodParameters(mood);
      console.log(`🎵 Spotify request parameters for mood '${mood}':`, {
        limit,
        ...moodParams,
      });

      // Build query parameters
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(moodParams).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.join(",") : value.toString(),
          ])
        ),
      });

      const response = await axios({
        method: "GET",
        url: `https://api.spotify.com/v1/recommendations?${params}`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      return response.data.tracks.map((track) => this.formatTrack(track));
    } catch (error) {
      console.error("Error fetching Spotify recommendations:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        mood: mood,
        limit: limit,
      });

      // Fallback to mock data on error
      console.log(`🎵 Falling back to mock data for mood: ${mood}`);
      return this.getMockTracks(mood, limit);
    }
  }

  /**
   * Search for tracks, artists, or albums
   */
  async search(query, types = ["track"], limit = 20) {
    try {
      const results = await this.spotifyApi.search(query, types, { limit });

      const formatted = {};
      if (results.body.tracks) {
        formatted.tracks = results.body.tracks.items.map((track) =>
          this.formatTrack(track)
        );
      }
      if (results.body.artists) {
        formatted.artists = results.body.artists.items.map((artist) =>
          this.formatArtist(artist)
        );
      }
      if (results.body.albums) {
        formatted.albums = results.body.albums.items.map((album) =>
          this.formatAlbum(album)
        );
      }

      return formatted;
    } catch (error) {
      console.error("Error searching Spotify:", {
        message: error.message,
        statusCode: error.statusCode,
        body: error.body || error,
        query: query,
        types: types,
        limit: limit,
      });
      throw new Error(`Failed to search music: ${error.message}`);
    }
  }

  /**
   * Get featured playlists
   */
  async getFeaturedPlaylists(limit = 20) {
    // If Spotify is not configured, return mock data
    if (!this.isConfigured) {
      console.log("🎵 Using mock playlists data");
      return this.getMockPlaylists(limit);
    }

    try {
      const playlists = await this.spotifyApi.getFeaturedPlaylists({ limit });
      return playlists.body.playlists.items.map((playlist) =>
        this.formatPlaylist(playlist)
      );
    } catch (error) {
      console.error("Error fetching featured playlists:", {
        message: error.message,
        statusCode: error.statusCode,
        body: error.body || error,
        limit: limit,
      });

      // Fallback to mock data on error
      console.log("🎵 Falling back to mock playlists data");
      return this.getMockPlaylists(limit);
    }
  }

  /**
   * Get playlist tracks
   */
  async getPlaylistTracks(playlistId, limit = 50) {
    try {
      const tracks = await this.spotifyApi.getPlaylistTracks(playlistId, {
        limit,
      });
      return tracks.body.items
        .filter((item) => item.track && item.track.preview_url)
        .map((item) => this.formatTrack(item.track));
    } catch (error) {
      console.error("Error fetching playlist tracks:", {
        message: error.message,
        statusCode: error.statusCode,
        body: error.body || error,
        playlistId: playlistId,
        limit: limit,
      });
      throw new Error(`Failed to fetch playlist tracks: ${error.message}`);
    }
  }

  /**
   * Format Spotify track object to match app structure
   */
  formatTrack(track) {
    return {
      id: track.id,
      name: track.name,
      artist: track.artists.map((artist) => artist.name).join(", "),
      album: track.album.name,
      duration: this.formatDuration(track.duration_ms),
      image: track.album.images[0]?.url || "",
      preview_url: track.preview_url,
      spotify_url: track.external_urls.spotify,
      spotify_id: track.id,
    };
  }

  /**
   * Format Spotify artist object
   */
  formatArtist(artist) {
    return {
      id: artist.id,
      name: artist.name,
      image: artist.images[0]?.url || "",
      genres: artist.genres,
      spotify_url: artist.external_urls.spotify,
      spotify_id: artist.id,
    };
  }

  /**
   * Format Spotify album object
   */
  formatAlbum(album) {
    return {
      id: album.id,
      name: album.name,
      artist: album.artists.map((artist) => artist.name).join(", "),
      image: album.images[0]?.url || "",
      release_date: album.release_date,
      total_tracks: album.total_tracks,
      spotify_url: album.external_urls.spotify,
      spotify_id: album.id,
    };
  }

  /**
   * Format Spotify playlist object
   */
  formatPlaylist(playlist) {
    return {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      image: playlist.images[0]?.url || "",
      tracks: playlist.tracks.total,
      owner: playlist.owner.display_name,
      spotify_url: playlist.external_urls.spotify,
      spotify_id: playlist.id,
    };
  }

  /**
   * Convert milliseconds to MM:SS format
   */
  formatDuration(durationMs) {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  /**
   * Generate Spotify authorization URL
   */
  getAuthorizationUrl(
    scopes = ["user-read-private", "user-read-email", "playlist-read-private"]
  ) {
    return this.spotifyApi.createAuthorizeURL(scopes, "state-key");
  }

  /**
   * Handle authorization callback
   */
  async handleAuthCallback(code) {
    try {
      const data = await this.spotifyApi.authorizationCodeGrant(code);
      return {
        access_token: data.body.access_token,
        refresh_token: data.body.refresh_token,
        expires_in: data.body.expires_in,
      };
    } catch (error) {
      console.error("Error handling auth callback:", {
        message: error.message,
        statusCode: error.statusCode,
        body: error.body || error,
        code: code,
      });
      throw new Error(`Failed to authorize with Spotify: ${error.message}`);
    }
  }
}

module.exports = new SpotifyService();
