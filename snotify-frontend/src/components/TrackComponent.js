import React, { useState, useEffect, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearCurrentTrackTime,
  initializeTrack,
  pauseTrack,
  playTrack,
  recordCurrentTrackTime,
} from '../features/audio/audioSlice';
import axios from 'axios';

const TrackComponent = ({ id, artist, title }, ref) => {
  const dispatch = useDispatch();

  const [audio, setAudio] = useState(undefined);
  const [url, setUrl] = useState(undefined);
  const [alreadyFetchedAudio, setAlreadyFetchedAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progressMeterId, setProgressMeterId] = useState(undefined);

  const isPlaying = useSelector(
    (state) => state.audio.tracks[id] && state.audio.tracks[id].isPlaying
  );
  const currentTrackId = useSelector((state) => state.audio.currentTrack.id);
  const currentTrackSetTime = useSelector((state) => state.audio.currentTrack.setTime);

  useEffect(() => {
    if (!audio) return;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);
  useEffect((event) => {
    if (audio && !alreadyFetchedAudio) {
      setIsLoading(false);
      setAlreadyFetchedAudio(true);
      dispatch(initializeTrack({ id, url, duration: audio.duration }));
      dispatch(playTrack({ id }));
    }
  }, [audio]);

  useEffect(() => {
    if (!isLoading || currentTrackId) {
      if (currentTrackId === id) {
        setProgressMeterId(
          setInterval(
            () => dispatch(recordCurrentTrackTime({ time: audio.currentTime })),
            1000,
          )
        );
        dispatch(playTrack({ id }));
      } else if (audio) {
        clearInterval(progressMeterId);
        setProgressMeterId(undefined);
        dispatch(pauseTrack({ id }));
        audio.currentTime = 0;
        dispatch(recordCurrentTrackTime({ time: 0 }));
      }
    }

    return () => {
      if (audio) {
        audio.removeAttribute('src');
        audio.remove();
      }
    };
  }, [currentTrackId]);

  useEffect(() => {
    if (isLoading || !audio || !currentTrackSetTime) return;
    audio.currentTime = currentTrackSetTime;
    dispatch(clearCurrentTrackTime());
  }, [currentTrackSetTime]);

  const toggleTrack = () => {
    if (isLoading) return;

    if (isPlaying) {
      dispatch(pauseTrack({ id }));
    } else if (alreadyFetchedAudio) {
      dispatch(playTrack({ id }));
    } else {
      fetchTrack();
    }
  };

  const fetchTrack = () => {
    setIsLoading(true);
    axios(`${process.env.REACT_APP_BASE_URL}/tracks/${id}`)
      .then((response) => {
        const audioElement = new Audio(response.data.url);
        setUrl(response.data.url);
        audioElement.addEventListener('loadeddata', (event) => {
          setAudio(audioElement);
        });
      })
      .catch(console.log);
  };

  return (
    <tr onClick={toggleTrack} ref={ref}>
      <td>{id}</td>
      <td>{artist}</td>
      <td>{title}</td>
    </tr>
  );
};

export default forwardRef(TrackComponent);
