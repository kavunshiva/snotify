import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nextTrack,
  pauseTrack,
  playTrack,
  setCurrentTrackTime,
} from '../../features/audio/audioSlice';
import './PlaybackIndicatorComponent.scss';

const PlaybackIndicatorComponent = ({ goToNextTrack }) => {
  const dispatch = useDispatch();

  const id = useSelector((state) => state.audio.currentTrack.id);
  const time = useSelector((state) => state.audio.currentTrack.time);
  const duration = useSelector(
    (state) => state.audio.tracks[id] && state.audio.tracks[id].duration
  );
  const isPlaying = useSelector(
    (state) => state.audio.tracks[id] && state.audio.tracks[id].isPlaying
  );
  const trackIds = useSelector((state) => state.audio.trackIds);

  useEffect(() => {
    const portionCompleted = duration ? time/duration*100.0 : 0.0;

    document
      .getElementById('progress-bar')
      .style
      .width = portionCompleted + "%";

    // TODO: do something less hacky to advance to the next track...
    // i.e., make nextTrack() actually work
    if (portionCompleted >= 100.0) {
      // dispatch(nextTrack());
      goToNextTrack();
    }
  }, [time]);


  const togglePlay = () => {
    if (!id) {
      goToNextTrack();
    } else if (isPlaying) {
      dispatch(pauseTrack({ id }));
    } else {
      dispatch(playTrack({ id }));
    }
  };

  const setCurrentTime = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    dispatch(setCurrentTrackTime({ time: x/rect.width*duration }));
  };

  return (
    <div className="playback-controls">
      <button
        className={`button${isPlaying ? ' paused' : ''}`}
        onClick={togglePlay}
      ></button>
      <div id="progress-container" onClick={setCurrentTime}>
        <div id="progress-bar"></div>
      </div>
    </div>
  );
};

export default PlaybackIndicatorComponent;
