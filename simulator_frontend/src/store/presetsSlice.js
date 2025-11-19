import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const fetchPresets = createAsyncThunk(
  'presets/fetchPresets',
  async () => {
    const response = await axios.get(`${API_URL}/presets`);
    return response.data.data; 
  }
);

export const savePreset = createAsyncThunk(
  'presets/savePreset',
  async ({ name, devices }) => {
    const response = await axios.post(`${API_URL}/presets`, {
      name,
      devices: devices, 
    });
    return response.data.data; 
  }
);


export const deletePreset = createAsyncThunk(
  'presets/deletePreset',
  async (presetId) => {
    await axios.delete(`${API_URL}/presets/${presetId}`);
    return presetId;
  }
);

const initialState = {
  presets: [],
  loading: false,
  error: null,
};

const presetsSlice = createSlice({
  name: 'presets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPresets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPresets.fulfilled, (state, action) => {
        state.loading = false;
        state.presets = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPresets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.presets = []; 
      })
      .addCase(savePreset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePreset.fulfilled, (state, action) => {
        state.loading = false;
        state.presets.push(action.payload);
      })
      .addCase(savePreset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deletePreset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePreset.fulfilled, (state, action) => {
        state.loading = false;
        state.presets = state.presets.filter(p => p.id !== action.payload);
      })
      .addCase(deletePreset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = presetsSlice.actions;

export default presetsSlice.reducer;
