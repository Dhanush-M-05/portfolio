import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import { getAbout, uploadAboutImage } from '../../api/aboutService';
import Toast from '../../components/Admin/Toast/Toast';
import {
  FileTextIcon,
  SparklesIcon,
  CheckIcon,
  MailIcon,
  BriefcaseIcon,
  DownloadIcon,
  ExternalLinkIcon,
  CloseIcon,
  LayersIcon,
  CodeIcon,
  ShieldCheckIcon
} from '../../components/Icons/Icons';
import './ManageAbout.css';

export const ManageAbout = () => {
  const { about, updateAbout, profile } = useCMS();

  const [formData, setFormData] = useState({
    heading: '',
    subheading: '',
    short_intro: '',
    description: '',
    professional_summary: '',
    image_url: '/dhanush-profile.jpg',
    location: '',
    email: '',
    phone: '',
    years_experience: '1+',
    projects_completed: '3+',
    degree: 'B.E CSE',
    cgpa: '7.20',
    skills_highlight: '',
    resume_url: '/resume.pdf',
    cta_text: 'View Projects',
    cta_link: '#projects'
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [saveSuccessBanner, setSaveSuccessBanner] = useState(false);

  // Directly load authoritative database values on mount
  useEffect(() => {
    let isMounted = true;
    getAbout()
      .then((data) => {
        if (isMounted && data) {
          setFormData({
            heading: data.heading || '',
            subheading: data.subheading || '',
            short_intro: data.short_intro || '',
            description: data.description || '',
            professional_summary: data.professional_summary || '',
            image_url: data.image_url || profile?.avatarUrl || '/dhanush-profile.jpg',
            location: data.location || '',
            email: data.email || '',
            phone: data.phone || '',
            years_experience: data.years_experience || '1+',
            projects_completed: data.projects_completed || '3+',
            degree: data.degree || 'B.E CSE',
            cgpa: data.cgpa || '7.20',
            skills_highlight: data.skills_highlight || '',
            resume_url: data.resume_url || '/resume.pdf',
            cta_text: data.cta_text || 'View Projects',
            cta_link: data.cta_link || '#projects'
          });
        }
      })
      .catch((err) => {
        console.warn('ManageAbout fetch error, falling back to context:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Also sync if context state changes
  useEffect(() => {
    if (about) {
      setFormData((prev) => ({
        ...prev,
        heading: about.heading ?? prev.heading,
        subheading: about.subheading ?? prev.subheading,
        short_intro: about.short_intro ?? prev.short_intro,
        description: about.description ?? prev.description,
        professional_summary: about.professional_summary ?? prev.professional_summary,
        image_url: about.image_url ?? prev.image_url,
        location: about.location ?? prev.location,
        email: about.email ?? prev.email,
        phone: about.phone ?? prev.phone,
        years_experience: about.years_experience ?? prev.years_experience,
        projects_completed: about.projects_completed ?? prev.projects_completed,
        degree: about.degree ?? prev.degree,
        cgpa: about.cgpa ?? prev.cgpa,
        skills_highlight: about.skills_highlight ?? prev.skills_highlight,
        resume_url: about.resume_url ?? prev.resume_url,
        cta_text: about.cta_text ?? prev.cta_text,
        cta_link: about.cta_link ?? prev.cta_link
      }));
    }
  }, [about]);

  const validate = () => {
    const newErrors = {};

    if (!formData.heading.trim()) {
      newErrors.heading = 'About Heading is required.';
    }
    if (!formData.subheading.trim()) {
      newErrors.subheading = 'About Subheading is required.';
    }
    if (!formData.short_intro.trim()) {
      newErrors.short_intro = 'Short Introduction is required.';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Full About Description is required.';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setToastType('error');
      setToastMessage('Please select a valid image file (JPEG, PNG, WebP, SVG).');
      return;
    }

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setToastType('error');
      setToastMessage('Image file size must be less than 10MB.');
      return;
    }

    setIsUploadingImage(true);
    try {
      // First, show instant local preview via FileReader
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        setFormData((prev) => ({ ...prev, image_url: readEvent.target.result }));
      };
      reader.readAsDataURL(file);

      // Attempt backend upload to persist file in public/uploads/
      const uploadRes = await uploadAboutImage(file);
      if (uploadRes?.fileUrl) {
        setFormData((prev) => ({ ...prev, image_url: uploadRes.fileUrl }));
        setToastType('success');
        setToastMessage(`Image "${file.name}" uploaded successfully! Remember to Save Changes.`);
      }
    } catch (err) {
      console.warn('Backend image upload fallback to local data URL:', err.message);
      setToastType('success');
      setToastMessage(`Image "${file.name}" loaded for preview. Click "Save Changes" to publish.`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleResumeFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setToastType('error');
      setToastMessage('Resume file size must be under 10MB.');
      return;
    }

    setIsUploadingResume(true);
    try {
      const uploadRes = await uploadAboutImage(file);
      if (uploadRes?.fileUrl) {
        setFormData((prev) => ({ ...prev, resume_url: uploadRes.fileUrl }));
        setToastType('success');
        setToastMessage(`Resume "${file.name}" uploaded! Remember to Save Changes.`);
      }
    } catch (err) {
      setToastType('error');
      setToastMessage('Failed to upload resume file: ' + err.message);
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleResetImage = () => {
    setFormData((prev) => ({ ...prev, image_url: '/dhanush-profile.jpg' }));
    setToastType('success');
    setToastMessage('Profile image reset to default portrait.');
  };

  const handleResetForm = () => {
    if (about) {
      setFormData({
        heading: about.heading || '',
        subheading: about.subheading || '',
        short_intro: about.short_intro || '',
        description: about.description || '',
        professional_summary: about.professional_summary || '',
        image_url: about.image_url || '/dhanush-profile.jpg',
        location: about.location || '',
        email: about.email || '',
        phone: about.phone || '',
        years_experience: about.years_experience || '1+',
        projects_completed: about.projects_completed || '3+',
        degree: about.degree || 'B.E CSE',
        cgpa: about.cgpa || '7.20',
        skills_highlight: about.skills_highlight || '',
        resume_url: about.resume_url || '/resume.pdf',
        cta_text: about.cta_text || 'View Projects',
        cta_link: about.cta_link || '#projects'
      });
      setErrors({});
      setToastType('success');
      setToastMessage('Form reverted to last saved database content.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setToastType('error');
      setToastMessage('Please review the form errors before saving.');
      return;
    }

    setIsSaving(true);
    setSaveSuccessBanner(false);

    try {
      const response = await updateAbout(formData);
      setToastType('success');
      setToastMessage('About section updated successfully');
      setSaveSuccessBanner(true);
      setTimeout(() => setSaveSuccessBanner(false), 6000);
    } catch (err) {
      setToastType('error');
      setToastMessage('Failed to update About section: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  // Convert comma-separated skills highlight into array for preview
  const skillsArray = formData.skills_highlight
    ? formData.skills_highlight.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <AdminLayout
      title="About Page Editor"
      subtitle="Completely control all About section content, narrative text, contact info, metrics, and imagery from this panel."
      breadcrumb={[{ label: 'About' }]}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Top Banner Notice */}
      {saveSuccessBanner && (
        <div className="about-success-alert-banner">
          <div className="alert-icon-circle">
            <CheckIcon size={18} />
          </div>
          <div className="alert-text-body">
            <strong>About section updated successfully!</strong>
            <span>All public About page elements have been updated from the database.</span>
          </div>
          <button
            type="button"
            className="alert-close-btn"
            onClick={() => setSaveSuccessBanner(false)}
            aria-label="Dismiss alert"
          >
            <CloseIcon size={16} />
          </button>
        </div>
      )}

      {/* Main Two-Column Layout (Left: Form Editor, Right: Real-time Live Preview) */}
      <form onSubmit={handleSubmit} className="about-editor-main-grid" noValidate>
        {/* =========================================================================
            LEFT COLUMN: CMS FORM CONTROLS
            ========================================================================= */}
        <div className="about-form-column">
          {/* Section 1: Headings & Intro */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">1. Header & Introduction</h2>
              <p className="admin-card-subtitle">Define the primary section title, subtitle, and personal greeting.</p>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="heading">
                About Heading <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="heading"
                name="heading"
                className={`admin-input ${errors.heading ? 'is-invalid' : ''}`}
                value={formData.heading}
                onChange={handleChange}
                placeholder="e.g. Professional Summary"
              />
              {errors.heading && <span className="admin-error-text">{errors.heading}</span>}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="subheading">
                About Subheading <span className="required-star">*</span>
              </label>
              <textarea
                id="subheading"
                name="subheading"
                className={`admin-textarea ${errors.subheading ? 'is-invalid' : ''}`}
                rows={2}
                value={formData.subheading}
                onChange={handleChange}
                placeholder="Brief section tagline or mission statement"
              />
              {errors.subheading && <span className="admin-error-text">{errors.subheading}</span>}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="short_intro">
                Short Introduction / Greeting <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="short_intro"
                name="short_intro"
                className={`admin-input ${errors.short_intro ? 'is-invalid' : ''}`}
                value={formData.short_intro}
                onChange={handleChange}
                placeholder="e.g. Hi, I'm Dhanush M — Web Developer / Full Stack Developer."
              />
              {errors.short_intro && <span className="admin-error-text">{errors.short_intro}</span>}
            </div>
          </div>

          {/* Section 2: Narrative & Summary */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">2. Biography & Professional Summary</h2>
              <p className="admin-card-subtitle">Detailed narrative copy displayed on the public About card.</p>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="description">
                Full About Description (Paragraph 1) <span className="required-star">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                className={`admin-textarea ${errors.description ? 'is-invalid' : ''}`}
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Motivated Computer Science graduate seeking opportunities..."
              />
              {errors.description && <span className="admin-error-text">{errors.description}</span>}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="professional_summary">
                Professional Summary (Paragraph 2)
              </label>
              <textarea
                id="professional_summary"
                name="professional_summary"
                className="admin-textarea"
                rows={3}
                value={formData.professional_summary}
                onChange={handleChange}
                placeholder="Passionate about creating clean, accessible interfaces..."
              />
            </div>
          </div>

          {/* Section 3: Profile Image Media */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">3. Profile & About Image</h2>
              <p className="admin-card-subtitle">Upload or specify the centralized profile image URL used across About and Hero.</p>
            </div>

            <div className="image-manager-box">
              <div className="image-preview-wrapper">
                <img
                  src={formData.image_url || '/dhanush-profile.jpg'}
                  alt="About Profile Preview"
                  className="about-preview-thumb"
                  onError={(e) => {
                    e.target.src = '/dhanush-profile.jpg';
                  }}
                />
              </div>

              <div className="image-upload-controls">
                <label className="admin-form-label">Upload New Photo</label>
                <div className="file-input-row">
                  <label className="btn btn-secondary file-upload-trigger">
                    {isUploadingImage ? 'Uploading Image...' : 'Choose Image File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      style={{ display: 'none' }}
                      disabled={isUploadingImage}
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleResetImage}
                    title="Reset to default portrait"
                  >
                    Reset Photo
                  </button>
                </div>
                <span className="helper-note">Supports JPG, PNG, WebP (Max 10MB). Centralized across Hero & About.</span>

                <div className="admin-form-group" style={{ marginTop: '12px' }}>
                  <label className="admin-form-label" htmlFor="image_url">
                    Image URL (Direct Path or External)
                  </label>
                  <input
                    type="text"
                    id="image_url"
                    name="image_url"
                    className="admin-input"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="/uploads/dhanush-profile.jpg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Location & Contact */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">4. Location & Contact Details</h2>
              <p className="admin-card-subtitle">Public contact and geographic metadata.</p>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="location">
                  Location <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className={`admin-input ${errors.location ? 'is-invalid' : ''}`}
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Chennai, Tamil Nadu"
                />
                {errors.location && <span className="admin-error-text">{errors.location}</span>}
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="phone">
                  Phone Number <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className={`admin-input ${errors.phone ? 'is-invalid' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9344976660"
                />
                {errors.phone && <span className="admin-error-text">{errors.phone}</span>}
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="email">
                Email Address <span className="required-star">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`admin-input ${errors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="dhanush2005mp@gmail.com"
              />
              {errors.email && <span className="admin-error-text">{errors.email}</span>}
            </div>
          </div>

          {/* Section 5: Metrics & Skills Highlight */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">5. Experience Metrics & Skills</h2>
              <p className="admin-card-subtitle">Highlight key numerical milestones and featured technologies.</p>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="years_experience">
                  Years of Experience
                </label>
                <input
                  type="text"
                  id="years_experience"
                  name="years_experience"
                  className="admin-input"
                  value={formData.years_experience}
                  onChange={handleChange}
                  placeholder="e.g. 1+"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="projects_completed">
                  Projects Completed
                </label>
                <input
                  type="text"
                  id="projects_completed"
                  name="projects_completed"
                  className="admin-input"
                  value={formData.projects_completed}
                  onChange={handleChange}
                  placeholder="e.g. 3+"
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="degree">
                  Degree / Qualification
                </label>
                <input
                  type="text"
                  id="degree"
                  name="degree"
                  className="admin-input"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="e.g. B.E CSE"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="cgpa">
                  CGPA / Academic Score
                </label>
                <input
                  type="text"
                  id="cgpa"
                  name="cgpa"
                  className="admin-input"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="e.g. 7.20"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="skills_highlight">
                Technologies / Skills Highlight (Comma separated)
              </label>
              <input
                type="text"
                id="skills_highlight"
                name="skills_highlight"
                className="admin-input"
                value={formData.skills_highlight}
                onChange={handleChange}
                placeholder="React.js, Spring Boot, Django, MySQL, JavaScript"
              />
              <span className="helper-note">Enter comma-separated values to display as badges.</span>
            </div>
          </div>

          {/* Section 6: CTA & Resume Link */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">6. Actions & Resume Link</h2>
              <p className="admin-card-subtitle">Configure primary action buttons and downloadable CV paths.</p>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="cta_text">
                  Primary CTA Button Text
                </label>
                <input
                  type="text"
                  id="cta_text"
                  name="cta_text"
                  className="admin-input"
                  value={formData.cta_text}
                  onChange={handleChange}
                  placeholder="e.g. View Projects"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="cta_link">
                  Primary CTA Button Link
                </label>
                <input
                  type="text"
                  id="cta_link"
                  name="cta_link"
                  className="admin-input"
                  value={formData.cta_link}
                  onChange={handleChange}
                  placeholder="e.g. #projects or /projects"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="resume_url">
                Resume / CV File Path
              </label>
              <div className="file-input-row">
                <input
                  type="text"
                  id="resume_url"
                  name="resume_url"
                  className="admin-input"
                  value={formData.resume_url}
                  onChange={handleChange}
                  placeholder="/resume.pdf"
                />
                <label className="btn btn-secondary file-upload-trigger" style={{ whiteSpace: 'nowrap' }}>
                  {isUploadingResume ? 'Uploading...' : 'Upload PDF'}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeFileChange}
                    style={{ display: 'none' }}
                    disabled={isUploadingResume}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="about-form-actions-bar">
            <button
              type="submit"
              className="btn btn-primary save-btn-pill"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="spinner-border" /> Saving Changes...
                </>
              ) : (
                <>
                  <CheckIcon size={16} /> Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary cancel-btn-pill"
              onClick={handleResetForm}
              disabled={isSaving}
            >
              Revert / Cancel
            </button>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: REAL-TIME LIVE PREVIEW
            ========================================================================= */}
        <div className="about-preview-column">
          <div className="live-preview-sticky-card">
            {/* Live Indicator Header */}
            <div className="preview-indicator-bar">
              <div className="live-pulse-dot" />
              <span className="preview-title-text">Live Preview</span>
              <span className="preview-draft-badge">Instant Reflection</span>
            </div>

            {/* Preview Body styled with public frosted glass system */}
            <div className="preview-glass-content">
              <div className="preview-section-header">
                <span className="preview-mini-badge">ABOUT ME</span>
                <h3 className="preview-main-title">{formData.heading || 'Professional Summary'}</h3>
                <p className="preview-subtitle-text">{formData.subheading || 'Section subtitle appears here.'}</p>
              </div>

              {/* Card Container */}
              <div className="preview-narrative-glass-card">
                <div className="preview-photo-and-intro">
                  <div className="preview-avatar-squircle">
                    <img
                      src={formData.image_url || '/dhanush-profile.jpg'}
                      alt="Preview"
                      className="preview-avatar-img"
                      onError={(e) => {
                        e.target.src = '/dhanush-profile.jpg';
                      }}
                    />
                  </div>
                  <div className="preview-intro-group">
                    <h4 className="preview-intro-name">{formData.short_intro || "Hi, I'm Dhanush M"}</h4>
                    <span className="preview-location-tag">{formData.location || 'Chennai, Tamil Nadu'}</span>
                  </div>
                </div>

                <div className="preview-bio-paragraphs">
                  <p className="preview-bio-p1">{formData.description || 'Full description will appear here as you type.'}</p>
                  {formData.professional_summary && (
                    <p className="preview-bio-p2">{formData.professional_summary}</p>
                  )}
                </div>

                {/* Key Metrics Grid */}
                <div className="preview-metrics-grid">
                  <div className="preview-metric-box">
                    <span className="metric-num">{formData.years_experience || '1+'}</span>
                    <span className="metric-name">Experience</span>
                  </div>
                  <div className="preview-metric-box">
                    <span className="metric-num">{formData.projects_completed || '3+'}</span>
                    <span className="metric-name">Projects</span>
                  </div>
                  <div className="preview-metric-box">
                    <span className="metric-num">{formData.degree || 'B.E CSE'}</span>
                    <span className="metric-name">Degree</span>
                  </div>
                  <div className="preview-metric-box">
                    <span className="metric-num">{formData.cgpa || '7.20'}</span>
                    <span className="metric-name">CGPA</span>
                  </div>
                </div>

                {/* Technologies Highlight Chips */}
                {skillsArray.length > 0 && (
                  <div className="preview-skills-row">
                    <span className="skills-row-label">Core Tech:</span>
                    <div className="skills-chip-wrap">
                      {skillsArray.map((skill, index) => (
                        <span key={index} className="preview-tech-chip">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact & CTA Preview */}
                <div className="preview-footer-action">
                  <div className="preview-contact-quick">
                    <span>{formData.email}</span>
                    <span>{formData.phone}</span>
                  </div>
                  <div className="preview-btn-mock">
                    {formData.cta_text || 'View Projects'} &rarr;
                  </div>
                </div>
              </div>

              {/* Note below preview */}
              <p className="preview-footnote">
                Preview updates immediately in real-time. Changes will be published to the public website only after clicking <strong>Save Changes</strong>.
              </p>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default ManageAbout;
