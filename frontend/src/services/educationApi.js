import api from './api';

export const getEducation = async (all = false) => {
  const response = await api.get(`/api/education${all ? '?all=true' : ''}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const getEducationById = async (id) => {
  const response = await api.get(`/api/education/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const createEducation = async (data) => {
  const response = await api.post('/api/education', data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateEducation = async (id, data) => {
  const response = await api.put(`/api/education/${id}`, data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const deleteEducation = async (id) => {
  const response = await api.delete(`/api/education/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export default {
  getEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
};
