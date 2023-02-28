import { createSlice } from '@reduxjs/toolkit';

export const audioSlice = createSlice({
  name: 'audio',
  initialState: {
    tracks: {},
    currentTrack: { id: undefined, time: 0 },
    trackIds: [],
  },
  reducers: {
    clearCurrentTrackTime: (state) => {
      state.currentTrack = { ...state.currentTrack, setTime: undefined };
    },
    initializeTrack: (state, action) => {
      const { id, url, duration } = action.payload;
      state.tracks[id] = { ...state.tracks[id], url, duration, isPlaying: false };
    },
    nextTrack: (state) => {
      const currentTrackIndex = state.trackIds.findIndex((id) => state.currentTrack.id === id);
      if (currentTrackIndex < state.trackIds.length - 1) {
        state.tracks[state.currentTrack.id] = {
          ...state.tracks[state.currentTrack.id],
          time: 0,
          isPlaying: false,
        };

        const nextTrackId = state.trackIds[currentTrackIndex + 1];
        state.currentTrack = {
          ...state.currentTrack,
          id: nextTrackId,
          time: 0,
        };
        state.tracks[nextTrackId] = { ...state.tracks[nextTrackId], isPlaying: true };
      }
    },
    pauseTrack: (state, action) => {
      const { id } = action.payload;
      state.tracks[id] = { ...state.tracks[id], isPlaying: false };
    },
    playTrack: (state, action) => {
      const { id } = action.payload;
      state.tracks[id] = { ...state.tracks[id], isPlaying: true };
      if (state.currentTrack.id && state.currentTrack.id !== id) {
        state.tracks[state.currentTrack.id] = {
          ...state.tracks[state.currentTrack.id],
          time: 0,
          isPlaying: false,
        };
      }
      state.currentTrack = { ...state.currentTrack, id, time: 0 };
    },
    recordCurrentTrackTime: (state, action) => {
      const { time } = action.payload;
      state.currentTrack = { ...state.currentTrack, time };
    },
    setCurrentTrackTime: (state, action) => {
      const { time } = action.payload;
      state.currentTrack = { ...state.currentTrack, setTime: time };
    },
    updateTracks: (state, action) => {
      const { tracks, trackIds } = action.payload;
      state.tracks = tracks;
      state.trackIds = trackIds;
    },
  },
});

export const {
  clearCurrentTrackTime,
  initializeTrack,
  nextTrack,
  pauseTrack,
  playTrack,
  recordCurrentTrackTime,
  setCurrentTrackTime,
  updateTracks,
} = audioSlice.actions;

export default audioSlice.reducer;
