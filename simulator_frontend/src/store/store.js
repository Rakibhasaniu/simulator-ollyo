import { configureStore } from '@reduxjs/toolkit';
import devicesReducer from './devicesSlice';
import presetsReducer from './presetsSlice';

export const store = configureStore({
  reducer: {
    devices: devicesReducer,
    presets: presetsReducer,
  },
});
