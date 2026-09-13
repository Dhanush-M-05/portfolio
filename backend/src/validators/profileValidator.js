export const validateProfile = (data) => {
  const errors = {};

  if (data.name !== undefined && (!data.name || typeof data.name !== 'string' || !data.name.trim())) {
    errors.name = 'Profile name cannot be empty';
  }

  if (data.email && typeof data.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateProfile,
};
