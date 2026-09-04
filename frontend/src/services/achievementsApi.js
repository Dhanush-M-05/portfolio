import api from './api';

export const getAchievements = async (all = false) => {
  const response = await api.get(`/api/achievements${all ? '?all=true' : ''}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const getAchievementById = async (id) => {
  const response = await api.get(`/api/achievements/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const createAchievement = async (data) => {
  const response = await api.post('/api/achievements', data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateAchievement = async (id, data) => {
  const response = await api.put(`/api/achievements/${id}`, data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const deleteAchievement = async (id) => {
  const response = await api.delete(`/api/achievements/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export default {
  getAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
