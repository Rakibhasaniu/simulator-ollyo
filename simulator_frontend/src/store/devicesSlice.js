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
        power: false,
        brightness: 100,
        colorTemp: 'warm', 
      };
    case 'fan':
      return {
        power: false,
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

export const updateDeviceAsync = createAsyncThunk(
  'devices/updateDeviceAsync',
  async ({ id, deviceData }, { rejectWithValue }) => {
    try {
      const response = await deviceService.updateDevice(id, deviceData);
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
    updateDevice: (state, action) => {
      const { deviceId, updates } = action.payload;
      const deviceIndex = state.devices.findIndex(d => d.id === deviceId);
      if (deviceIndex !== -1) {
        state.devices[deviceIndex] = {
          ...state.devices[deviceIndex],
          ...updates,
        };
      }
    },
    updateDeviceSettings: (state, action) => {
      const { deviceId, settings } = action.payload;
      const deviceIndex = state.devices.findIndex(d => d.id === deviceId);
      if (deviceIndex !== -1) {
        state.devices[deviceIndex].settings = {
          ...state.devices[deviceIndex].settings,
          ...settings,
        };
      }
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
        state.devices = action.payload.map(device => ({
          id: device.id,
          type: device.type,
          name: device.name,
          position: {
            x: device.position_x || 100,
            y: device.position_y || 100
          },
          settings: device.settings
        }));
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
        state.devices.push({
          id: device.id,
          type: device.type,
          name: device.name,
          position: {
            x: device.position_x || 100,
            y: device.position_y || 100
          },
          settings: device.settings
        });
      })
      .addCase(createDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create device';
      })
      .addCase(updateDeviceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeviceAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDevice = action.payload;
        const index = state.devices.findIndex(d => d.id === updatedDevice.id);
        if (index !== -1) {
          state.devices[index] = {
            id: updatedDevice.id,
            type: updatedDevice.type,
            name: updatedDevice.name,
            position: {
              x: updatedDevice.position_x || state.devices[index].position.x,
              y: updatedDevice.position_y || state.devices[index].position.y
            },
            settings: updatedDevice.settings
          };
        }
      })
      .addCase(updateDeviceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update device';
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
  updateDevice,
  updateDeviceSettings,
  removeDevice,
  clearDevices,
  loadDevices,
} = devicesSlice.actions;

export default devicesSlice.reducer;
