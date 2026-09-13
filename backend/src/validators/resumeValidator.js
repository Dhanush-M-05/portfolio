export const validateResumeMeta = (data) => {
  const errors = {};

  if (data.title && typeof data.title !== 'string') {
    errors.title = 'Title must be a string';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateResumeMeta,
};
