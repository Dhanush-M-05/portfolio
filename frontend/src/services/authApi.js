import api from './api';

const TOKEN_KEY = 'portfolio_auth_token';
const ADMIN_USER_KEY = 'portfolio_auth_user';

export const loginAdmin = async ({ usernameOrEmail, email, password, rememberMe = true }) => {
  const loginEmail = email || usernameOrEmail;
  const response = await api.post('/api/auth/login', {
    email: loginEmail,
    password,
  });

  const payload = response.data.data || response.data;
  const { token, user } = payload;

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem('admin_token', token);
  storage.setItem('token', token);
  storage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem('admin_token', token);
  localStorage.setItem('token', token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));

  return { success: true, user, token };
};

export const logoutAdmin = async () => {
  try {
    await api.post('/api/auth/logout');
  } catch (err) {
    // Ignore network error on logout
  }

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_USER_KEY);
  sessionStorage.removeItem('admin_token');
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  localStorage.removeItem('admin_token');

  return { success: true };
};

export const getCurrentAdmin = async () => {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const response = await api.get('/api/auth/verify');
    if (response.data.valid) {
      return response.data.user;
    }
    return null;
  } catch (err) {
    try {
      const meResponse = await api.get('/api/auth/me');
      return meResponse.data.data || meResponse.data;
    } catch (e) {
      return null;
    }
  }
};

export default {
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
};
