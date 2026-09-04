import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import FileUploader from '../../components/Admin/FileUploader/FileUploader';
import Toast from '../../components/Admin/Toast/Toast';
import { SparklesIcon, CheckIcon } from '../../components/Icons/Icons';
import { uploadProfileImage, deleteProfileImage } from '../../services/profileApi';

export const ManageProfile = () => {
  const { profile, updateProfile } = useCMS();

  const [formData, setFormData] = useState({
    name: profile.name || '',
    role: profile.role || '',
    degree: profile.degree || 'B.E.',
    department: profile.department || 'Computer Science and Engineering',
    college: profile.college || 'J.N.N Institute',
    domain: profile.domain || '',
    email: profile.email || '',
    location: profile.location || '',
    phone: profile.phone || '+91 98765 43210',
    tagline: profile.tagline || '',
    heroDescription: profile.heroDescription || '',
    aboutHeading: profile.aboutHeading || '',
    aboutSubheading: profile.aboutSubheading || '',
    avatarUrl: profile.avatarUrl || profile.image || '/dhanush-profile.jpg',
    image: profile.image || profile.avatarUrl || '/dhanush-profile.jpg',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoSelect = async (file) => {
    if (!file) return;
    setIsUploadingPhoto(true);
    setToastMessage('Uploading profile photo to Cloudinary...');
    try {
      const result = await uploadProfileImage(file);
      const newUrl = result.profileImageUrl || result.url || result.data?.profileImageUrl;
      setFormData((prev) => ({ ...prev, avatarUrl: newUrl, image: newUrl }));
      updateProfile({ avatarUrl: newUrl, image: newUrl });
      setToastMessage('Profile photo uploaded successfully to Cloudinary! Live on portfolio.');
    } catch (err) {
      setToastMessage('Failed to upload photo: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleResetPhoto = async () => {
    setIsUploadingPhoto(true);
    try {
      await deleteProfileImage();
      const defaultAvatar = '/dhanush-profile.jpg';
      setFormData((prev) => ({ ...prev, avatarUrl: defaultAvatar, image: defaultAvatar }));
      updateProfile({ avatarUrl: defaultAvatar, image: defaultAvatar });
      setToastMessage('Profile photo reset to default.');
    } catch (err) {
      setToastMessage('Failed to reset photo: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setToastMessage('Profile updated successfully! Live on public portfolio.');
    } catch (err) {
      setToastMessage('Failed to update profile: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Profile Management"
      subtitle="Edit your developer identity, headline, biography, and profile photo."
      breadcrumb={[{ label: 'Profile' }]}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Main Details */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">General Identity</h2>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="admin-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="role">Professional Title</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  className="admin-input"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Academic Details for Profile Card Overlay */}
            <div className="admin-card-header" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
              <h2 className="admin-card-title">Academic & Education Details (Profile Card Overlay)</h2>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="degree">Degree / Course</label>
                <input
                  type="text"
                  id="degree"
                  name="degree"
                  className="admin-input"
                  placeholder="e.g. B.E."
                  value={formData.degree}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  className="admin-input"
                  placeholder="e.g. Computer Science and Engineering"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="college">College / Institution</label>
              <input
                type="text"
                id="college"
                name="college"
                className="admin-input"
                placeholder="e.g. J.N.N Institute"
                value={formData.college}
                onChange={handleChange}
              />
            </div>

            <div className="admin-card-header" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
              <h2 className="admin-card-title">Contact & Domain Info</h2>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="domain">Primary Domain</label>
                <input
                  type="text"
                  id="domain"
                  name="domain"
                  className="admin-input"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="email">Public Contact Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="admin-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="admin-input"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="phone">Phone (Optional)</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="admin-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="tagline">Hero Tagline</label>
              <input
                type="text"
                id="tagline"
                name="tagline"
                className="admin-input"
                value={formData.tagline}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="heroDescription">Hero Bio Description</label>
              <textarea
                id="heroDescription"
                name="heroDescription"
                className="admin-textarea"
                rows={3}
                value={formData.heroDescription}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="aboutHeading">About Section Heading</label>
              <input
                type="text"
                id="aboutHeading"
                name="aboutHeading"
                className="admin-input"
                value={formData.aboutHeading}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={isSaving}
              >
                {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </div>

          {/* Sidebar Info & Profile Photo Management */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Profile Photo Card */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">Profile Photo</h2>
              </div>

              {/* Current Photo Preview */}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  margin: '0 auto 12px auto',
                  border: '2px solid var(--admin-primary-border)',
                  boxShadow: '0 8px 24px rgba(79, 70, 229, 0.15)',
                  backgroundColor: '#F1F5F9',
                }}>
                  <img
                    src={formData.avatarUrl || '/dhanush-profile.jpg'}
                    alt="Current profile preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    onError={(e) => {
                      e.target.src = '/dhanush-profile.jpg';
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleResetPhoto}
                    className="admin-btn admin-btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    disabled={isUploadingPhoto}
                  >
                    {isUploadingPhoto ? 'Processing...' : 'Reset to Default Photo'}
                  </button>
                </div>
              </div>

              {formData.avatarUrl && formData.avatarUrl.includes('cloudinary') && (
                <div style={{
                  background: '#EEF2FF',
                  border: '1px solid #C7D2FE',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  marginBottom: '12px',
                  fontSize: '0.75rem',
                  color: '#4338CA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px',
                }}>
                  <span style={{ fontWeight: 600 }}>☁️ Hosted on Cloudinary</span>
                  <a
                    href={formData.avatarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#4F46E5', textDecoration: 'underline', fontSize: '0.72rem' }}
                  >
                    View Asset ↗
                  </a>
                </div>
              )}

              {/* Drag & Drop / Click to Upload to Cloudinary */}
              <FileUploader
                label={isUploadingPhoto ? "Uploading to Cloudinary..." : "Upload New Photo to Cloudinary"}
                helpText="JPG, PNG, WebP (Max 5MB) — Saved to portfolio/profile"
                accept="image/*"
                onFileSelect={handlePhotoSelect}
                currentPreviewUrl={formData.avatarUrl ? 'Active Photo' : ''}
              />

              {/* Direct URL Alternative */}
              <div className="admin-form-group" style={{ marginTop: '14px' }}>
                <label className="admin-form-label" htmlFor="avatarUrl" style={{ fontSize: '0.75rem' }}>
                  Or Direct Image URL
                </label>
                <input
                  type="text"
                  id="avatarUrl"
                  name="avatarUrl"
                  className="admin-input"
                  style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                  placeholder="https://example.com/photo.jpg or /dhanush-profile.jpg"
                  value={formData.avatarUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({ ...prev, avatarUrl: val, image: val }));
                  }}
                />
              </div>
            </div>

            {/* Live Synchronisation Note */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">Live Sync Note</h2>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                Any photo uploaded here automatically displays in the <strong>Hero Section</strong> of the public landing page, immediately upon saving.
              </p>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default ManageProfile;
