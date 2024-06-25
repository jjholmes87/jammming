import React, { useState } from 'react';
import './SearchBar.css';
import Spotify from './Spotify.js';

const SearchBar = ({ setSearchResults }) => {
  const [term, setTerm] = useState('');

  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };

  const search = () => {
    Spotify.search(term)
      .then(results => {
        setSearchResults(results);
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
        value={term}
        onChange={handleTermChange}
      />
      <button className="SearchButton" onClick={search}>
        SEARCH
      </button>
    </div>
  );
};

export default SearchBar;