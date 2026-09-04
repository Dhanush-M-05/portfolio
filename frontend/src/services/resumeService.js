import resumeApi, { getResumeDownloadUrl, getResumeViewUrl } from './resumeApi';

export const getResumeInfo = async (all = false) => {
  return resumeApi.getResume(all);
};

export const uploadResume = async (file) => {
  return resumeApi.uploadResume(file);
};

export const updateResume = async (id, data) => {
  return resumeApi.updateResume(id, data);
};

export const deleteResume = async (id) => {
  return resumeApi.deleteResume(id);
};

export { getResumeDownloadUrl, getResumeViewUrl };

export default {
  getResumeInfo,
  uploadResume,
  updateResume,
  deleteResume,
  getResumeDownloadUrl,
  getResumeViewUrl,
};
