import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { SaveIcon, SparklesIcon, CheckIcon } from '../../components/Icons/Icons';

export const ManageHero = () => {
  const { hero, updateHero, profile, updateProfile } = useCMS();

  const [formData, setFormData] = useState({
    greeting: "HELLO, I'M",
    primaryBtnText: "View My Work",
    primaryBtnLink: "#projects",
    resumeBtnText: "Download Resume",
    secondaryBtnText: "Let's Talk",
    secondaryBtnLink: "#contact",
    talkLinkText: "Let's Talk",
    name: "",
    role: "",
    tagline: "",
    heroDescription: ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (hero) {
      setFormData((prev) => ({
        ...prev,
        greeting: hero.greeting || "HELLO, I'M",
        primaryBtnText: hero.primaryBtnText || "View My Work",
        primaryBtnLink: hero.primaryBtnLink || "#projects",
        resumeBtnText: hero.resumeBtnText || "Download Resume",
        secondaryBtnText: hero.secondaryBtnText || "Let's Talk",
        secondaryBtnLink: hero.secondaryBtnLink || "#contact",
        talkLinkText: hero.talkLinkText || "Let's Talk",
        name: profile?.name || "",
        role: profile?.role || "",
        tagline: profile?.tagline || "",
        heroDescription: profile?.heroDescription || ""
      }));
    }
  }, [hero, profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateHero({
        greeting: formData.greeting,
        primaryBtnText: formData.primaryBtnText,
        primaryBtnLink: formData.primaryBtnLink,
        resumeBtnText: formData.resumeBtnText,
        secondaryBtnText: formData.secondaryBtnText,
        secondaryBtnLink: formData.secondaryBtnLink,
        talkLinkText: formData.talkLinkText
      });

      if (formData.name || formData.role || formData.tagline || formData.heroDescription) {
        await updateProfile({
          name: formData.name,
          role: formData.role,
          tagline: formData.tagline,
          heroDescription: formData.heroDescription
        });
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save hero content:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Hero Section CMS"
      subtitle="Manage your primary landing headline, greeting pill, buttons, and introductory copy"
      breadcrumb={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Hero Section' }]}
    >
      <div className="admin-content-card">
        {saveSuccess && (
          <div className="admin-alert admin-alert-success" style={{ marginBottom: '1.5rem' }}>
            <CheckIcon size={18} />
            <span>Hero section updated successfully! Public website updated immediately.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-section">
            <h3 className="admin-section-title">Headline & Introductory Copy</h3>
            
            <div className="admin-form-group">
              <label className="admin-label">Greeting Badge Text</label>
              <input
                type="text"
                name="greeting"
                value={formData.greeting}
                onChange={handleChange}
                placeholder="HELLO, I'M"
                className="admin-input"
              />
              <span className="admin-help-text">Appears in the small pill badge above your name (e.g. HELLO, I'M).</span>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Dhanush M"
                  className="admin-input"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Professional Role / Title</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Web Developer / Full Stack Developer"
                  className="admin-input"
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Positioning Subtitle / Tagline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="Motivated Computer Science graduate seeking opportunities..."
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Hero Bio / Short Description</label>
              <textarea
                name="heroDescription"
                rows={3}
                value={formData.heroDescription}
                onChange={handleChange}
                placeholder="Experienced with frontend development, backend APIs..."
                className="admin-textarea"
              />
            </div>
          </div>

          <div className="admin-form-section" style={{ marginTop: '2rem' }}>
            <h3 className="admin-section-title">Call-To-Action (CTA) Buttons & Links</h3>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-label">Primary Button Text</label>
                <input
                  type="text"
                  name="primaryBtnText"
                  value={formData.primaryBtnText}
                  onChange={handleChange}
                  placeholder="View My Work"
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Primary Button Target Link</label>
                <input
                  type="text"
                  name="primaryBtnLink"
                  value={formData.primaryBtnLink}
                  onChange={handleChange}
                  placeholder="#projects"
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-label">Resume Button Text</label>
                <input
                  type="text"
                  name="resumeBtnText"
                  value={formData.resumeBtnText}
                  onChange={handleChange}
                  placeholder="Download Resume"
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Secondary Button Text</label>
                <input
                  type="text"
                  name="secondaryBtnText"
                  value={formData.secondaryBtnText}
                  onChange={handleChange}
                  placeholder="Let's Talk"
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-label">Secondary Button Target Link</label>
                <input
                  type="text"
                  name="secondaryBtnLink"
                  value={formData.secondaryBtnLink}
                  onChange={handleChange}
                  placeholder="#contact"
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Bottom Quick Talk Link Text</label>
                <input
                  type="text"
                  name="talkLinkText"
                  value={formData.talkLinkText}
                  onChange={handleChange}
                  placeholder="Let's Talk"
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          <div className="admin-actions-bar" style={{ marginTop: '2rem' }}>
            <button
              type="submit"
              disabled={isSaving}
              className="admin-btn admin-btn-primary"
            >
              <SaveIcon size={16} />
              <span>{isSaving ? 'Saving Changes...' : 'Save Hero Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ManageHero;
