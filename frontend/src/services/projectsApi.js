import api from './api';

export const getProjects = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.featured !== undefined) query.append('featured', params.featured);
  if (params.search) query.append('search', params.search);
  if (params.all) query.append('all', 'true');

  const qs = query.toString() ? `?${query.toString()}` : '';
  const response = await api.get(`/api/projects${qs}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const getProjectById = async (id) => {
  const response = await api.get(`/api/projects/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const getProjectBySlug = async (slug) => {
  const response = await api.get(`/api/projects/slug/${slug}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const createProject = async (data) => {
  const response = await api.post('/api/projects', data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateProject = async (id, data) => {
  const response = await api.put(`/api/projects/${id}`, data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/api/projects/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const addProjectImage = async (id, formDataOrData) => {
  const isFormData = formDataOrData instanceof FormData;
  const response = await api.post(`/api/projects/${id}/images`, formDataOrData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const deleteProjectImage = async (id, imageId) => {
  const response = await api.delete(`/api/projects/${id}/images/${imageId}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export default {
  getProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  addProjectImage,
  deleteProjectImage,
};
