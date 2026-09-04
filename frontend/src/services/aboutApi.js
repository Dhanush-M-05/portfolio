import api from './api';

export const getAbout = async () => {
  const response = await api.get('/api/about');
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateAbout = async (data) => {
  const response = await api.put('/api/about', data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export default {
  getAbout,
  updateAbout,
};
