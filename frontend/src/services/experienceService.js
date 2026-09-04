import experienceApi from './experienceApi';
import educationApi from './educationApi';
import certificationsApi from './certificationsApi';

export const getExperience = (all) => experienceApi.getExperience(all);
export const createExperience = (data) => experienceApi.createExperience(data);
export const updateExperience = (id, data) => experienceApi.updateExperience(id, data);
export const deleteExperience = (id) => experienceApi.deleteExperience(id);

export const getEducation = (all) => educationApi.getEducation(all);
export const createEducation = (data) => educationApi.createEducation(data);
export const updateEducation = (id, data) => educationApi.updateEducation(id, data);
export const deleteEducation = (id) => educationApi.deleteEducation(id);

export const getCertifications = (all) => certificationsApi.getCertifications(all);
export const createCertification = (data) => certificationsApi.createCertification(data);
export const updateCertifications = (id, data) => certificationsApi.updateCertification(id, data);
export const deleteCertification = (id) => certificationsApi.deleteCertification(id);
export const getCertificateViewUrl = (id) => certificationsApi.getCertificateViewUrl(id);

export default {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  getCertifications,
  createCertification,
  updateCertifications,
  deleteCertification,
  getCertificateViewUrl,
};
