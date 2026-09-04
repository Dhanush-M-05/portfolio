import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { SaveIcon, CheckIcon } from '../../components/Icons/Icons';

export const ManageFooter = () => {
  const { footer, updateFooter, profile } = useCMS();

  const [formData, setFormData] = useState({
    brandName: "Dhanush M",
    brandRole: "Web Developer",
    tagline: "",
    quickLinksHeading: "Navigation",
    deepLinksHeading: "Portfolio",
    contactHeading: "Direct Inquiries",
    contactDesc: "Available for web development projects, freelance collaborations, and full-time opportunities.",
    copyrightText: "Designed & Built with React and Pure CSS."
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (footer) {
      setFormData({
        brandName: footer.brandName || profile?.name || "Dhanush M",
        brandRole: footer.brandRole || profile?.role || "Web Developer",
        tagline: footer.tagline || profile?.tagline || "",
        quickLinksHeading: footer.quickLinksHeading || "Navigation",
        deepLinksHeading: footer.deepLinksHeading || "Portfolio",
        contactHeading: footer.contactHeading || "Direct Inquiries",
        contactDesc: footer.contactDesc || "Available for web development projects, freelance collaborations, and full-time opportunities.",
        copyrightText: footer.copyrightText || "Designed & Built with React and Pure CSS."
      });
    }
  }, [footer, profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateFooter(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save footer:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Footer CMS"
      subtitle="Manage your public footer text, headings, branding, direct inquiries info, and copyright notice"
      breadcrumb={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Footer' }]}
    >
      <div className="admin-content-card">
        {saveSuccess && (
          <div className="admin-alert admin-alert-success" style={{ marginBottom: '1.5rem' }}>
            <CheckIcon size={18} />
            <span>Footer settings updated successfully! Public website updated immediately.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-section">
            <h3 className="admin-section-title">Footer Branding & Tagline</h3>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-label">Brand Name</label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  placeholder="Dhanush M"
                  className="admin-input"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Brand Role</label>
                <input
                  type="text"
                  name="brandRole"
                  value={formData.brandRole}
                  onChange={handleChange}
                  placeholder="Web Developer"
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Footer Tagline</label>
              <textarea
                name="tagline"
                rows={2}
                value={formData.tagline}
                onChange={handleChange}
                placeholder="Motivated Computer Science graduate seeking opportunities..."
                className="admin-textarea"
              />
            </div>
          </div>

          <div className="admin-form-section" style={{ marginTop: '2rem' }}>
            <h3 className="admin-section-title">Column Headings & Inquiries Text</h3>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-label">Quick Links Column Heading</label>
                <input
                  type="text"
                  name="quickLinksHeading"
                  value={formData.quickLinksHeading}
                  onChange={handleChange}
                  placeholder="Navigation"
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Deep Links Column Heading</label>
                <input
                  type="text"
                  name="deepLinksHeading"
                  value={formData.deepLinksHeading}
                  onChange={handleChange}
                  placeholder="Portfolio"
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Inquiries Column Heading</label>
                <input
                  type="text"
                  name="contactHeading"
                  value={formData.contactHeading}
                  onChange={handleChange}
                  placeholder="Direct Inquiries"
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Inquiries Supporting Paragraph</label>
              <textarea
                name="contactDesc"
                rows={2}
                value={formData.contactDesc}
                onChange={handleChange}
                placeholder="Available for web development projects, freelance collaborations, and full-time opportunities."
                className="admin-textarea"
              />
            </div>
          </div>

          <div className="admin-form-section" style={{ marginTop: '2rem' }}>
            <h3 className="admin-section-title">Bottom Bar & Copyright Notice</h3>

            <div className="admin-form-group">
              <label className="admin-label">Copyright Notice Subtitle</label>
              <input
                type="text"
                name="copyrightText"
                value={formData.copyrightText}
                onChange={handleChange}
                placeholder="Designed & Built with React and Pure CSS."
                className="admin-input"
              />
              <span className="admin-help-text">Appears alongside &copy; {new Date().getFullYear()} {formData.brandName}.</span>
            </div>
          </div>

          <div className="admin-actions-bar" style={{ marginTop: '2rem' }}>
            <button
              type="submit"
              disabled={isSaving}
              className="admin-btn admin-btn-primary"
            >
              <SaveIcon size={16} />
              <span>{isSaving ? 'Saving Changes...' : 'Save Footer Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ManageFooter;
