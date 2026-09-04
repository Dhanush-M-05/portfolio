import api from './api';

export const getFooter = async () => {
  const response = await api.get('/api/footer');
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateFooter = async (data) => {
  const response = await api.put('/api/footer', data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export default {
  getFooter,
  updateFooter,
};
