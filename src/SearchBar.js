import React, { useState } from 'react';
import './SearchBar.css';
import Spotify from './Spotify.js';

const spotifyApiUrl = 'https://api.spotify.com/v1';

const SearchBar = ({ setSearchResults }) => {
  const [term, setTerm] = useState('');

  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };

  const search = () => {
    const accessToken = Spotify.getAccessToken();
    if (!accessToken) {
      console.error('Access token not available');
      return;
    }

    fetch(`${spotifyApiUrl}/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
      })
      .then(data => {
        console.log('Search results:', data); // For debugging - you can remove this line
        setSearchResults(data.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        })));
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // Handle error state or display an error message to the user
      });
  };

  return (
    <div className="SearchBar">
      <input
        placeholder="Enter A Song, Album, or Artist"
        onChange={handleTermChange}
      />
      <button className="SearchButton" onClick={search}>
        SEARCH
      </button>
    </div>
  );
}

export default SearchBar;
