import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheckIcon,
  LockIcon,
  UserIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
} from '../../components/Icons/Icons';
import './AdminLogin.css';

export const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errors = {};
    if (!formData.usernameOrEmail.trim()) {
      errors.usernameOrEmail = 'Please enter your username or email address.';
    }
    if (!formData.password) {
      errors.password = 'Please enter your password.';
    } else if (formData.password.length < 4) {
      errors.password = 'Password must be at least 4 characters long.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-screen">
      {/* Dynamic Ambient Background Blobs */}
      <div className="admin-login-blobs" aria-hidden="true">
        <div className="login-blob login-blob-1" />
        <div className="login-blob login-blob-2" />
        <div className="login-blob login-blob-3" />
      </div>
      <div className="admin-login-grid-pattern" aria-hidden="true" />

      {/* Main Glassmorphic Card */}
      <div className="admin-login-card">
        {/* Brand Monogram & Heading */}
        <div className="admin-login-header">
          <div className="admin-login-monogram">
            <span>DM</span>
            <div className="monogram-glow-ring" />
          </div>
          <h1 className="admin-login-title">CMS Control Center</h1>
          <p className="admin-login-subtitle">
            Administrative workspace for Dhanush M
          </p>
        </div>

        {/* Auth Error Notification */}
        {authError && (
          <div className="admin-login-error-alert" role="alert">
            <span className="error-alert-dot" />
            <span>{authError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="admin-login-form">
          {/* Username or Email */}
          <div className="login-form-field">
            <label className="login-field-label" htmlFor="usernameOrEmail">
              Username or Email
            </label>
            <div className="login-input-group">
              <input
                type="text"
                id="usernameOrEmail"
                className={`login-custom-input ${formErrors.usernameOrEmail ? 'is-invalid' : ''}`}
                placeholder="dhanush2005mp@gmail.com"
                value={formData.usernameOrEmail}
                onChange={(e) => {
                  setFormData({ ...formData, usernameOrEmail: e.target.value });
                  if (formErrors.usernameOrEmail) setFormErrors({ ...formErrors, usernameOrEmail: null });
                }}
                disabled={loading}
                autoComplete="username"
                required
              />
              <span className="login-input-icon">
                <UserIcon size={17} />
              </span>
            </div>
            {formErrors.usernameOrEmail && (
              <span className="login-field-error-text">{formErrors.usernameOrEmail}</span>
            )}
          </div>

          {/* Password */}
          <div className="login-form-field">
            <div className="login-label-row">
              <label className="login-field-label" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                className="login-toggle-pass-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="login-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`login-custom-input ${formErrors.password ? 'is-invalid' : ''}`}
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (formErrors.password) setFormErrors({ ...formErrors, password: null });
                }}
                disabled={loading}
                autoComplete="current-password"
                required
              />
              <span className="login-input-icon">
                <LockIcon size={17} />
              </span>
            </div>
            {formErrors.password && (
              <span className="login-field-error-text">{formErrors.password}</span>
            )}
          </div>

          {/* Remember Session */}
          <div className="login-options-row">
            <label className="login-remember-label">
              <input
                type="checkbox"
                className="login-remember-checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              />
              <span>Remember session</span>
            </label>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="login-submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-button-spinner" />
                <span>Authenticating Session...</span>
              </>
            ) : (
              <>
                <ShieldCheckIcon size={18} />
                <span>Authenticate & Access CMS</span>
              </>
            )}
          </button>
        </form>

        {/* Card Footer */}
        <div className="admin-login-footer">
          <Link to="/" className="login-return-link">
            <ArrowLeftIcon size={16} />
            <span>Return to Public Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
