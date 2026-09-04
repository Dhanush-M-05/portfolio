import api from './api';

export const sendContactMessage = async (messageData) => {
  const response = await api.post('/api/contact', messageData);
  return response.data;
};

export const getMessages = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.isRead !== undefined) query.append('isRead', params.isRead);

  const qs = query.toString() ? `?${query.toString()}` : '';
  const response = await api.get(`/api/contact${qs}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const getMessageById = async (id) => {
  const response = await api.get(`/api/contact/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const markMessageAsRead = async (id, isRead = true) => {
  const response = await api.patch(`/api/contact/${id}/read`, { isRead });
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const markMessageRead = markMessageAsRead;

export const deleteMessage = async (id) => {
  const response = await api.delete(`/api/contact/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export default {
  sendContactMessage,
  getMessages,
  getMessageById,
  markMessageAsRead,
  deleteMessage,
};
