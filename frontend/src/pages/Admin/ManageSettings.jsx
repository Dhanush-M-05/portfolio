import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import Toast from '../../components/Admin/Toast/Toast';

export const ManageSettings = () => {
  const { settings, updateSettings } = useCMS();

  const [formData, setFormData] = useState({
    siteTitle: settings?.siteTitle || 'Dhanush M | Portfolio',
    metaDescription: settings?.metaDescription || '',
    heroHeading: settings?.heroHeading || 'Dhanush M',
    heroTitle: settings?.heroTitle || 'Web Developer',
    heroTagline: settings?.heroTagline || '',
    aboutHeading: settings?.aboutHeading || 'Building With Purpose',
    contactEmail: settings?.contactEmail || 'dhanush2005mp@gmail.com',
    footerText: settings?.footerText || 'Designed & Built with React and Pure CSS.',
  });

  useEffect(() => {
    if (settings) {
      setFormData((prev) => ({
        ...prev,
        siteTitle: settings.siteTitle || prev.siteTitle,
        metaDescription: settings.metaDescription || prev.metaDescription,
        heroHeading: settings.heroHeading || prev.heroHeading,
        heroTitle: settings.heroTitle || prev.heroTitle,
        heroTagline: settings.heroTagline || prev.heroTagline,
        aboutHeading: settings.aboutHeading || prev.aboutHeading,
        contactEmail: settings.contactEmail || prev.contactEmail,
        footerText: settings.footerText || prev.footerText,
      }));
    }
  }, [settings]);

  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
      setToastMessage('Global website settings updated successfully!');
    } catch (err) {
      setToastMessage('Error updating settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Website Settings"
      subtitle="Configure global metadata, search engine tags, headlines, and system parameters."
      breadcrumb={[{ label: 'Settings' }]}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">SEO & Metadata</h2>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="siteTitle">Browser Tab Title</label>
              <input
                type="text"
                id="siteTitle"
                name="siteTitle"
                className="admin-input"
                value={formData.siteTitle}
                onChange={handleChange}
                required
              />
              <span className="admin-help-text">Displayed on search engines and browser tabs.</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="metaDescription">Meta Description</label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                className="admin-textarea"
                rows={3}
                value={formData.metaDescription}
                onChange={handleChange}
              />
              <span className="admin-help-text">Recommended length: between 120 and 160 characters.</span>
            </div>

            <div className="admin-card-header" style={{ marginTop: '32px' }}>
              <h2 className="admin-card-title">Public Content Headlines</h2>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="heroHeading">Hero Name Headline</label>
                <input
                  type="text"
                  id="heroHeading"
                  name="heroHeading"
                  className="admin-input"
                  value={formData.heroHeading}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="heroTitle">Professional Role Headline</label>
                <input
                  type="text"
                  id="heroTitle"
                  name="heroTitle"
                  className="admin-input"
                  value={formData.heroTitle}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="heroTagline">Positioning Tagline</label>
              <input
                type="text"
                id="heroTagline"
                name="heroTagline"
                className="admin-input"
                value={formData.heroTagline}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="footerText">Footer Copyright Attribution</label>
              <input
                type="text"
                id="footerText"
                name="footerText"
                className="admin-input"
                value={formData.footerText}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>

          <div>
            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">Backend Status</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>API Base URL:</span>
                  <span style={{ fontFamily: 'monospace', color: '#0F172A' }}>
                    {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>Environment:</span>
                  <span style={{ fontWeight: 600, color: '#059669' }}>Active</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Architecture:</span>
                  <span style={{ fontWeight: 600, color: '#4F46E5' }}>API Service Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default ManageSettings;
