import React, { useState, useEffect, createRef } from 'react';
import { useSelector } from 'react-redux';
import TrackComponent from './TrackComponent.js';
import PlaybackIndicatorComponent from './PlaybackIndicatorComponent/PlaybackIndicatorComponent.js';

const SearchComponent = ({ fetchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [refs, setRefs] = useState([]);

  const tracks = useSelector((state) => state.audio.tracks);
  const trackIds = useSelector((state) => state.audio.trackIds);
  const currentTrackId = useSelector((state) => state.audio.currentTrack.id);

  useEffect(() => {
    if (!searchTerm) return;

    const debouncedFetchResults = setTimeout(() => fetchResults(searchTerm), 500);

    return () => clearTimeout(debouncedFetchResults);
  }, [searchTerm]);

  useEffect(() => {
    if (trackIds) {
      setRefs(trackIds.map(() => createRef()));
    }
  }, [trackIds]);

  const goToNextTrack = () => {
    const currentTrackIndex = trackIds.findIndex((trackId) => trackId === currentTrackId);
    if (currentTrackIndex < trackIds.length - 1) {
      refs[currentTrackIndex + 1].current.click();
    }
  };

  return (
    <div>
      <h1>search snotify</h1>
      <input
        name="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {
        trackIds.length
          ? <div>
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <PlaybackIndicatorComponent goToNextTrack={goToNextTrack} />
              </div>
              <table>
                <thead>
                  <tr>
                    <td>ID</td>
                    <td>Artist</td>
                    <td>Title</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    trackIds.map((id, i) => <TrackComponent
                      key={i}
                      id={tracks[id].id}
                      artist={tracks[id].artist}
                      title={tracks[id].title}
                      ref={refs[i]}
                    />)
                  }
                </tbody>
              </table>
            </div>
          : null
      }
    </div>
  );
};

export default SearchComponent;
