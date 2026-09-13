import resumeApi, { getResumeDownloadUrl, getResumeViewUrl } from './resumeApi';

export const getResumeInfo = async (all = false) => {
  return resumeApi.getResume(all);
};

export const uploadResume = async (file) => {
  return resumeApi.uploadResume(file);
};

export const updateResume = async (idOrFile, data) => {
  if (idOrFile instanceof File || (typeof Blob !== 'undefined' && idOrFile instanceof Blob)) {
    return resumeApi.uploadResume(idOrFile);
  }
  return resumeApi.updateResume(idOrFile, data);
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
