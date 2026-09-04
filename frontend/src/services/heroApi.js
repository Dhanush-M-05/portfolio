import api from './api';

export const getHero = async () => {
  const response = await api.get('/api/hero');
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateHero = async (data) => {
  const response = await api.put('/api/hero', data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export default {
  getHero,
  updateHero,
};
