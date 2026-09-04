import api from './api';

export const getNavigation = async (all = false) => {
  const response = await api.get(`/api/navigation${all ? '?all=true' : ''}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const createNavigationItem = async (data) => {
  const response = await api.post('/api/navigation', data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateNavigationItem = async (id, data) => {
  const response = await api.put(`/api/navigation/${id}`, data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateNavigation = async (data) => {
  const response = await api.put('/api/navigation', data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const deleteNavigationItem = async (id) => {
  const response = await api.delete(`/api/navigation/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export default {
  getNavigation,
  createNavigationItem,
  updateNavigationItem,
  updateNavigation,
  deleteNavigationItem,
};
