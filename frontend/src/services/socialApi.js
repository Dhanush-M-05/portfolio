import api from './api';

export const getSocialLinks = async (all = false) => {
  const response = await api.get(`/api/social-links${all ? '?all=true' : ''}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const createSocialLink = async (data) => {
  const response = await api.post('/api/social-links', data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateSocialLink = async (id, data) => {
  const response = await api.put(`/api/social-links/${id}`, data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateSocialLinks = async (links) => {
  const response = await api.put('/api/social-links', { links });
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const deleteSocialLink = async (id) => {
  const response = await api.delete(`/api/social-links/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export default {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  updateSocialLinks,
  deleteSocialLink,
};
