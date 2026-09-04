import api, { API_BASE_URL } from './api';

export const getCertifications = async (all = false) => {
  const response = await api.get(`/api/certifications${all ? '?all=true' : ''}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const getCertificationById = async (id) => {
  const response = await api.get(`/api/certifications/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const createCertification = async (dataOrFormData) => {
  let payload = dataOrFormData;

  if (!(dataOrFormData instanceof FormData)) {
    payload = new FormData();
    Object.entries(dataOrFormData).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        if (key === 'skillsCovered' && Array.isArray(val)) {
          payload.append(key, val.join(', '));
        } else {
          payload.append(key, val);
        }
      }
    });
  }

  const response = await api.post('/api/certifications', payload);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const updateCertification = async (id, dataOrFormData) => {
  let payload = dataOrFormData;

  if (!(dataOrFormData instanceof FormData)) {
    payload = new FormData();
    Object.entries(dataOrFormData).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        if (key === 'skillsCovered' && Array.isArray(val)) {
          payload.append(key, val.join(', '));
        } else {
          payload.append(key, val);
        }
      }
    });
  }

  const response = await api.put(`/api/certifications/${id}`, payload);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const deleteCertification = async (id) => {
  const response = await api.delete(`/api/certifications/${id}`);
  return response.data.data !== undefined ? response.data.data : response.data;
};

export const getCertificateViewUrl = (id) => {
  return `${API_BASE_URL}/api/certifications/${id}/view`;
};

export default {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
  getCertificateViewUrl,
};
