export const validateLogin = (data) => {
  const errors = {};
  const identifier = data.email || data.usernameOrEmail || data.username;

  if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
    errors.email = 'Email or username is required';
  }

  if (!data.password || typeof data.password !== 'string' || data.password.length < 4) {
    errors.password = 'Password must be at least 4 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateLogin,
};
