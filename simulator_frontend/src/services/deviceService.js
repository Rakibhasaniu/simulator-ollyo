import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const deviceService = {
  getAllDevices: async () => {
    try {
      const response = await api.get('/devices');
      return response.data.data; 
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getDevice: async (id) => {
    try {
      const response = await api.get(`/devices/${id}`);
      return response.data.data; 
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createDevice: async (deviceData) => {
    try {
      const response = await api.post('/devices', deviceData);
      return response.data.data; 
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteDevice: async (id) => {
    try {
      const response = await api.delete(`/devices/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateDevice: async (id, deviceData) => {
    try {
      const response = await api.put(`/devices/${id}`, deviceData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteAllDevices: async () => {
    try {
      const response = await api.delete('/devices');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default deviceService;
