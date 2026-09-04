import api from './api';

export const getSections = async () => {
  try {
    const response = await api.get('/api/sections');
    return response.data;
  } catch (err) {
    console.warn('API getSections failed:', err.message);
    return null;
  }
};

export const updateSections = async (sectionsList) => {
  try {
    const response = await api.put('/api/sections', sectionsList);
    return response.data?.data || response.data || sectionsList;
  } catch (err) {
    console.warn('API updateSections failed:', err.message);
    return sectionsList;
  }
};

export default {
  getSections,
  updateSections,
};
