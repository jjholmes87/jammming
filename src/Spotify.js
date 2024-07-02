const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = 'https://jammming-jjholmes87.netlify.app/';
const spotifyAuthorizeUrl = 'https://accounts.spotify.com/authorize';
const spotifyApiUrl = 'https://api.spotify.com/v1';

let accessToken;

const Spotify = {
  // Function to obtain access token
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessUrl = `${spotifyAuthorizeUrl}?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  // Function to search tracks
  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`${spotifyApiUrl}/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      });
  },

  // Function to create a new playlist
  createPlaylist(name) {
    const accessToken = this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    return fetch(`${spotifyApiUrl}/me/playlists`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ name: name })
    })
      .then(response => {
        if (response.ok) {
          return response.json().then(jsonResponse => jsonResponse.id);
        }
        throw new Error('Failed to create playlist');
      })
      .catch(error => {
        console.error('Error creating playlist:', error);
        throw error; // Propagate the error
      });
  },

  // Function to add tracks to a playlist
  addTracksToPlaylist(playlistId, trackUris) {
    const accessToken = this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    return fetch(`${spotifyApiUrl}/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ uris: trackUris })
    })
      .then(response => {
        if (response.ok) {
          return;
        }
        throw new Error('Failed to add tracks to playlist');
      })
      .catch(error => {
        console.error('Error adding tracks to playlist:', error);
        throw error; // Propagate the error
      });
  }
};

export default Spotify;
