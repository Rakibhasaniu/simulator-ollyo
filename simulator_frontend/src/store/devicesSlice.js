import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import deviceService from '../services/deviceService';

const initialState = {
  devices: [],
  nextId: 1,
  loading: false,
  error: null,
};

const getDefaultSettings = (deviceType) => {
  switch (deviceType) {
    case 'light':
      return {
        brightness: 100,
        colorTemp: 'warm',
      };
    case 'fan':
      return {
        speed: 0,
      };
    default:
      return {};
  }
};

// Async Thunks for API Integration

export const fetchDevices = createAsyncThunk(
  'devices/fetchDevices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await deviceService.getAllDevices();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createDevice = createAsyncThunk(
  'devices/createDevice',
  async (deviceData, { rejectWithValue }) => {
    try {
      const response = await deviceService.createDevice(deviceData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteDevice = createAsyncThunk(
  'devices/deleteDevice',
  async (id, { rejectWithValue }) => {
    try {
      await deviceService.deleteDevice(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateDevice = createAsyncThunk(
  'devices/updateDevice',
  async ({ id, deviceData }, { rejectWithValue }) => {
    try {
      const response = await deviceService.updateDevice(id, deviceData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteAllDevices = createAsyncThunk(
  'devices/deleteAllDevices',
  async (_, { rejectWithValue }) => {
    try {
      await deviceService.deleteAllDevices();
      return true;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    addDevice: (state, action) => {
      const { deviceType, position = { x: 100, y: 100 } } = action.payload;
      const newDevice = {
        id: `device-${state.nextId}`,
        type: deviceType,
        position,
        settings: getDefaultSettings(deviceType),
      };
      state.devices.push(newDevice);
      state.nextId += 1;
    },
    removeDevice: (state, action) => {
      state.devices = state.devices.filter(d => d.id !== action.payload);
    },
    clearDevices: (state) => {
      state.devices = [];
    },
    loadDevices: (state, action) => {
      state.devices = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        // Only load the first device (single device display)
        if (action.payload && action.payload.length > 0) {
          const device = action.payload[0];
          state.devices = [{
            id: device.id,
            type: device.type,
            name: device.name,
            position: {
              x: device.position_x || 100,
              y: device.position_y || 100
            },
            settings: device.settings
          }];
        } else {
          state.devices = [];
        }
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch devices';
      })
      .addCase(createDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDevice.fulfilled, (state, action) => {
        state.loading = false;
        const device = action.payload;
        // Replace devices array with single device (only one device at a time)
        state.devices = [{
          id: device.id,
          type: device.type,
          name: device.name,
          position: {
            x: device.position_x || 100,
            y: device.position_y || 100
          },
          settings: device.settings
        }];
      })
      .addCase(createDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create device';
      })
      .addCase(deleteDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = state.devices.filter(d => d.id !== action.payload);
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete device';
      })
      .addCase(updateDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDevice = action.payload;
        const index = state.devices.findIndex(d => d.id === updatedDevice.id);
        if (index !== -1) {
          state.devices[index] = {
            id: updatedDevice.id,
            type: updatedDevice.type,
            name: updatedDevice.name,
            position: {
              x: updatedDevice.position_x || 100,
              y: updatedDevice.position_y || 100
            },
            settings: updatedDevice.settings
          };
        }
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update device';
      })
      .addCase(deleteAllDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAllDevices.fulfilled, (state) => {
        state.loading = false;
        state.devices = [];
      })
      .addCase(deleteAllDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete all devices';
      });
  },
});

export const {
  addDevice,
  removeDevice,
  clearDevices,
  loadDevices,
} = devicesSlice.actions;

export default devicesSlice.reducer;
