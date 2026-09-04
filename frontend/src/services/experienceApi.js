import api from './api';

export const getExperience = async (all = false) => {
  const response = await api.get(`/api/experience${all ? '?all=true' : ''}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const getExperienceById = async (id) => {
  const response = await api.get(`/api/experience/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const createExperience = async (data) => {
  const response = await api.post('/api/experience', data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateExperience = async (id, data) => {
  const response = await api.put(`/api/experience/${id}`, data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const deleteExperience = async (id) => {
  const response = await api.delete(`/api/experience/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export default {
  getExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
};
