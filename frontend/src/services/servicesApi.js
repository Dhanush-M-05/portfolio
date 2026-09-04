import api from './api';

export const getServices = async (all = false) => {
  const response = await api.get(`/api/services${all ? '?all=true' : ''}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const getServiceById = async (id) => {
  const response = await api.get(`/api/services/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const createService = async (data) => {
  const response = await api.post('/api/services', data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateService = async (id, data) => {
  const response = await api.put(`/api/services/${id}`, data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/api/services/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export default {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
