const SpotifyWebApi = require('spotify-web-api-node');
const config = require('../config/config');

class SpotifyService {
  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: config.SPOTIFY_CLIENT_ID,
      clientSecret: config.SPOTIFY_CLIENT_SECRET,
      redirectUri: config.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/auth/callback'
    });
    
    this.initializeClientCredentials();
  }

  /**
   * Initialize Spotify client credentials flow for app-only access
   */
  async initializeClientCredentials() {
    if (!config.SPOTIFY_CLIENT_ID || !config.SPOTIFY_CLIENT_SECRET) {
      console.warn('Spotify credentials not configured. Some features will be limited.');
      return;
    }

    try {
      const data = await this.spotifyApi.clientCredentialsGrant();
      this.spotifyApi.setAccessToken(data.body['access_token']);
      
      // Refresh token before expiry
      setTimeout(() => {
        this.initializeClientCredentials();
      }, (data.body['expires_in'] - 60) * 1000);
      
      console.log('✅ Spotify API initialized with client credentials');
    } catch (error) {
      console.error('❌ Failed to initialize Spotify API:', error.message);
    }
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
        seed_genres: ['pop', 'funk', 'soul']
      },
      sad: {
        target_valence: 0.2,
        target_energy: 0.3,
        max_valence: 0.4,
        seed_genres: ['indie', 'alternative', 'blues']
      },
      chill: {
        target_valence: 0.5,
        target_energy: 0.3,
        target_acousticness: 0.7,
        seed_genres: ['chill', 'ambient', 'lo-fi']
      },
      energetic: {
        target_valence: 0.7,
        target_energy: 0.9,
        min_energy: 0.7,
        seed_genres: ['electronic', 'rock', 'pop']
      },
      focus: {
        target_valence: 0.4,
        target_energy: 0.4,
        target_instrumentalness: 0.8,
        seed_genres: ['ambient', 'classical', 'instrumental']
      },
      party: {
        target_valence: 0.9,
        target_energy: 0.9,
        target_danceability: 0.8,
        seed_genres: ['dance', 'electronic', 'pop']
      },
      sleep: {
        target_valence: 0.3,
        target_energy: 0.1,
        target_acousticness: 0.9,
        seed_genres: ['ambient', 'sleep', 'nature']
      }
    };

    return moodMappings[mood] || moodMappings.chill;
  }

  /**
   * Get track recommendations based on mood
   */
  async getRecommendationsByMood(mood, limit = 20) {
    try {
      const moodParams = this.getMoodParameters(mood);
      
      const recommendations = await this.spotifyApi.getRecommendations({
        limit,
        ...moodParams
      });

      return recommendations.body.tracks.map(track => this.formatTrack(track));
    } catch (error) {
      console.error('Error fetching Spotify recommendations:', error.message);
      throw new Error('Failed to fetch recommendations');
    }
  }

  /**
   * Search for tracks, artists, or albums
   */
  async search(query, types = ['track'], limit = 20) {
    try {
      const results = await this.spotifyApi.search(query, types, { limit });
      
      const formatted = {};
      if (results.body.tracks) {
        formatted.tracks = results.body.tracks.items.map(track => this.formatTrack(track));
      }
      if (results.body.artists) {
        formatted.artists = results.body.artists.items.map(artist => this.formatArtist(artist));
      }
      if (results.body.albums) {
        formatted.albums = results.body.albums.items.map(album => this.formatAlbum(album));
      }

      return formatted;
    } catch (error) {
      console.error('Error searching Spotify:', error.message);
      throw new Error('Failed to search music');
    }
  }

  /**
   * Get featured playlists
   */
  async getFeaturedPlaylists(limit = 20) {
    try {
      const playlists = await this.spotifyApi.getFeaturedPlaylists({ limit });
      return playlists.body.playlists.items.map(playlist => this.formatPlaylist(playlist));
    } catch (error) {
      console.error('Error fetching featured playlists:', error.message);
      throw new Error('Failed to fetch playlists');
    }
  }

  /**
   * Get playlist tracks
   */
  async getPlaylistTracks(playlistId, limit = 50) {
    try {
      const tracks = await this.spotifyApi.getPlaylistTracks(playlistId, { limit });
      return tracks.body.items
        .filter(item => item.track && item.track.preview_url)
        .map(item => this.formatTrack(item.track));
    } catch (error) {
      console.error('Error fetching playlist tracks:', error.message);
      throw new Error('Failed to fetch playlist tracks');
    }
  }

  /**
   * Format Spotify track object to match app structure
   */
  formatTrack(track) {
    return {
      id: track.id,
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      duration: this.formatDuration(track.duration_ms),
      image: track.album.images[0]?.url || '',
      preview_url: track.preview_url,
      spotify_url: track.external_urls.spotify,
      spotify_id: track.id
    };
  }

  /**
   * Format Spotify artist object
   */
  formatArtist(artist) {
    return {
      id: artist.id,
      name: artist.name,
      image: artist.images[0]?.url || '',
      genres: artist.genres,
      spotify_url: artist.external_urls.spotify,
      spotify_id: artist.id
    };
  }

  /**
   * Format Spotify album object
   */
  formatAlbum(album) {
    return {
      id: album.id,
      name: album.name,
      artist: album.artists.map(artist => artist.name).join(', '),
      image: album.images[0]?.url || '',
      release_date: album.release_date,
      total_tracks: album.total_tracks,
      spotify_url: album.external_urls.spotify,
      spotify_id: album.id
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
      image: playlist.images[0]?.url || '',
      tracks: playlist.tracks.total,
      owner: playlist.owner.display_name,
      spotify_url: playlist.external_urls.spotify,
      spotify_id: playlist.id
    };
  }

  /**
   * Convert milliseconds to MM:SS format
   */
  formatDuration(durationMs) {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Generate Spotify authorization URL
   */
  getAuthorizationUrl(scopes = ['user-read-private', 'user-read-email', 'playlist-read-private']) {
    return this.spotifyApi.createAuthorizeURL(scopes, 'state-key');
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
        expires_in: data.body.expires_in
      };
    } catch (error) {
      console.error('Error handling auth callback:', error.message);
      throw new Error('Failed to authorize with Spotify');
    }
  }
}

module.exports = new SpotifyService();