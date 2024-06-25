import React from 'react';
import './Playlist.css';
import TrackList from './TrackList.js';
import Spotify from './Spotify.js'; // Adjust the import path as per your project structure

function Playlist({ playlistName, playlistTracks, onRemove, onNameChange, onSave }) {

  const handleSave = () => {
    const trackUris = playlistTracks.map(track => track.uri);
  
    // Ensure access token is available
    const accessToken = Spotify.getAccessToken();
    if (!accessToken) {
      console.error('Access token not available');
      return;
    }
  
    // Create playlist
    Spotify.createPlaylist(playlistName)
      .then(playlistId => {
        // Add tracks to playlist
        Spotify.addTracksToPlaylist(playlistId, trackUris)
          .then(() => {
            // Optional: Reset playlist state or show confirmation
            onSave();
  
            // Show alert with summary
            const summary = `Playlist "${playlistName}" saved with ${playlistTracks.length} tracks.`;
            alert(summary);
          })
          .catch(error => {
            console.error('Error adding tracks to playlist:', error);
            // Handle error adding tracks
          });
      })
      .catch(error => {
        console.error('Error creating playlist:', error);
        // Handle error creating playlist
      });
  };
  
  

  const handleNameChange = (event) => {
    onNameChange(event.target.value);
  };

  return (
    <div className="Playlist">
      <input defaultValue={'New Playlist'} onChange={handleNameChange} />
      <TrackList tracks={playlistTracks} onRemove={onRemove} isRemoval={true} />
      <button className="Playlist-save" onClick={handleSave}>SAVE TO SPOTIFY</button>
    </div>
  );
}

export default Playlist;
