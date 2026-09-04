import api from './api';

export const getSkills = async (category = null, all = false) => {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (all) params.append('all', 'true');
  const qs = params.toString() ? `?${params.toString()}` : '';

  const response = await api.get(`/api/skills${qs}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const getSkillById = async (id) => {
  const response = await api.get(`/api/skills/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const createSkill = async (data) => {
  const response = await api.post('/api/skills', data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateSkill = async (id, data) => {
  const response = await api.put(`/api/skills/${id}`, data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const deleteSkill = async (id) => {
  const response = await api.delete(`/api/skills/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export default {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
