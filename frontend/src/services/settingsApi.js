import api from './api';

export const getSettings = async () => {
  const response = await api.get('/api/settings');
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateSettings = async (data) => {
  const response = await api.put('/api/settings', data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export default {
  getSettings,
  updateSettings,
};
