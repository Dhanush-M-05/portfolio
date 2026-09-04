import api from './api';

export const getProfile = async () => {
  const response = await api.get('/api/profile');
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/api/profile', data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/api/profile/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const deleteProfileImage = async () => {
  const response = await api.delete('/api/profile/image');
  return response.data.data !== undefined ? response.data.data : response.data;
};

export default {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
};
