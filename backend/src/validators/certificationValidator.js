export const validateCertification = (data) => {
  const errors = {};

  const title = data.title || data.name;
  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.title = 'Certificate title is required';
  }

  if (!data.issuer || typeof data.issuer !== 'string' || !data.issuer.trim()) {
    errors.issuer = 'Certificate issuer is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateCertification,
};
