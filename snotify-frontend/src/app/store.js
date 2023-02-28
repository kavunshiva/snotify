import { configureStore } from '@reduxjs/toolkit';
import audioSlice from '../features/audio/audioSlice';

export default configureStore({
  reducer: {
    audio: audioSlice,
  },
})
