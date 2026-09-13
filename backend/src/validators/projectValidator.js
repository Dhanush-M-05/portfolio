export const validateProject = (data) => {
  const errors = {};

  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    errors.title = 'Project title is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateProject,
};
