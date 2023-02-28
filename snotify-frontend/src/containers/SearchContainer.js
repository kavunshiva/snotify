import React from 'react';
import { useDispatch } from 'react-redux';
import { updateTracks } from '../features/audio/audioSlice';
import SearchComponent from '../components/SearchComponent.js';
import axios from 'axios';

const SearchContainer = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const dispatch = useDispatch();

  const fetchSearchResults = (searchTerm) => {
    return axios(`${baseUrl}/search`, { params: { q: searchTerm } })
      .then((results) => dispatch(updateTracks({
        tracks: results.data.reduce((tracksById, track) => {
          tracksById[track.id] = track;
          return tracksById;
        }, {}),
        trackIds: results.data.map((track) => track.id),
      })))
      .catch(console.log);
  };

  return <SearchComponent fetchResults={fetchSearchResults} />;
}

export default SearchContainer;
