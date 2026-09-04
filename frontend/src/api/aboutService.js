import api from '../services/api';

/**
 * Fetch the authoritative About section data from the backend API/database.
 * Used by both Public Website and Admin Dashboard.
 */
export const getAbout = async () => {
  try {
    const response = await api.get(`/api/about?_t=${Date.now()}`);
    return response.data?.data !== undefined ? response.data.data : response.data;
  } catch (error) {
    console.error('Failed to fetch About data from API:', error.message);
    throw error;
  }
};

/**
 * Update the authoritative About section in the database.
 * Used by Admin Dashboard -> About Editor.
 */
export const updateAbout = async (data) => {
  try {
    const response = await api.put('/api/about', data);
    return response.data?.data !== undefined ? response.data.data : response.data;
  } catch (error) {
    console.error('Failed to update About data via API:', error.message);
    throw error;
  }
};

/**
 * Upload an image or resume document to the backend storage.
 */
export const uploadAboutImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/api/upload', formData);
    return response.data;
  } catch (error) {
    console.error('Failed to upload file via API:', error.message);
    throw error;
  }
};

export default {
  getAbout,
  updateAbout,
  uploadAboutImage
};
