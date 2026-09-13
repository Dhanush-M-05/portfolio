export const validateContact = (data) => {
  const errors = {};

  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.name = 'Please enter your name';
  }

  if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
    errors.email = 'Please enter your email address';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
  }

  if (!data.message || typeof data.message !== 'string' || !data.message.trim()) {
    errors.message = 'Please enter your message';
  } else if (data.message.trim().length < 5) {
    errors.message = 'Message must be at least 5 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateContact,
};
