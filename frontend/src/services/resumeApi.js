import api, { API_BASE_URL } from './api';

export const getResume = async (all = false) => {
  const response = await api.get(`/api/resume${all ? '?all=true' : ''}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/resume', formData);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateResume = async (id, data) => {
  const response = await api.put(`/api/resume/${id}`, data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const deleteResume = async (id) => {
  const response = await api.delete(`/api/resume/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const getResumeDownloadUrl = () => {
  return `${API_BASE_URL}/api/resume/download`;
};

export const getResumeViewUrl = () => {
  return `${API_BASE_URL}/api/resume/view`;
};

export default {
  getResume,
  uploadResume,
  updateResume,
  deleteResume,
  getResumeDownloadUrl,
  getResumeViewUrl,
};
