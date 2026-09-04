import React, { useState } from 'react';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import { MailIcon, CopyIcon, CheckIcon, SendIcon, MapPinIcon, GithubIcon, LinkedinIcon } from '../../components/Icons/Icons';
import Button from '../../components/Button/Button';
import { sendContactMessage } from '../../services/contactService';
import { useCMS } from '../../context/CMSContext';
import './ContactSection.css';

export const ContactSection = () => {
  const { profile, getSection, settings } = useCMS();
  const sectionConfig = getSection('contact');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email || 'dhanush2005mp@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => {
      setCopiedEmail(false);
    }, 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseStatus(null);
    setLoading(true);

    try {
      const result = await sendContactMessage(formData);
      setResponseStatus({
        success: true,
        message: result.message || sectionConfig.successMessage || 'Thank you for reaching out, Dhanush M will reply shortly.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setFormErrors({});
    } catch (error) {
      if (error.validationErrors) {
        setFormErrors(error.validationErrors);
      } else {
        setResponseStatus({
          success: false,
          message: error.message || sectionConfig.errorMessage || 'Failed to submit message.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <SectionTitle
          label={sectionConfig.label || "Get In Touch"}
          title={sectionConfig.title || "Let's Connect"}
          subtitle={sectionConfig.subtitle || "Have a project in mind, an opportunity to discuss, or want to connect? Send a message or reach out directly."}
        />

        <div className="contact-glass-grid">
          {/* Left Info Column */}
          <div className="contact-info-panel">
            <div className="contact-author-badge">
              <span className="author-dot" />
              <span>Direct Inquiries</span>
            </div>

            <h3 className="contact-panel-title">
              Let's connect and discuss new opportunities.
            </h3>

            <p className="contact-panel-desc">
              Open to opportunities in Web Development and Full Stack Development. Reach out through the contact form or directly via email, phone, LinkedIn, or GitHub.
            </p>

            <div className="contact-details-list">
              {/* Email */}
              <div className="contact-detail-card">
                <div className="detail-icon-box">
                  <MailIcon size={20} />
                </div>
                <div className="detail-text-group">
                  <span className="detail-label">Email Address</span>
                  <a href={`mailto:${profile.email || 'dhanush2005mp@gmail.com'}`} className="detail-value">
                    {profile.email || 'dhanush2005mp@gmail.com'}
                  </a>
                </div>
                <button
                  type="button"
                  className="copy-email-btn"
                  onClick={handleCopyEmail}
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                </button>
              </div>

              {/* Phone */}
              <div className="contact-detail-card">
                <div className="detail-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="detail-text-group">
                  <span className="detail-label">Phone</span>
                  <a href="tel:9344976660" className="detail-value">
                    {profile.phone || '9344976660'}
                  </a>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="contact-detail-card">
                <div className="detail-icon-box">
                  <LinkedinIcon size={20} />
                </div>
                <div className="detail-text-group">
                  <span className="detail-label">LinkedIn</span>
                  <a 
                    href="https://www.linkedin.com/in/dhanush151005/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="detail-value"
                  >
                    linkedin.com/in/dhanush151005
                  </a>
                </div>
              </div>

              {/* GitHub */}
              <div className="contact-detail-card">
                <div className="detail-icon-box">
                  <GithubIcon size={20} />
                </div>
                <div className="detail-text-group">
                  <span className="detail-label">GitHub</span>
                  <a 
                    href="https://github.com/Dhanush-M-05" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="detail-value"
                  >
                    github.com/Dhanush-M-05
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="contact-detail-card">
                <div className="detail-icon-box">
                  <MapPinIcon size={20} />
                </div>
                <div className="detail-text-group">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{profile.location || 'Chennai, Tamil Nadu'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="contact-form-panel">
            <form onSubmit={handleSubmit} className="contact-actual-form" noValidate>
              <div className="form-grid-row">
                {/* Name */}
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Your Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className={`form-input ${formErrors.name ? 'is-invalid' : ''}`}
                    disabled={loading}
                    required
                  />
                  {formErrors.name && <span className="form-error-msg">{formErrors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Your Email <span className="required-star">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className={`form-input ${formErrors.email ? 'is-invalid' : ''}`}
                    disabled={loading}
                    required
                  />
                  {formErrors.email && <span className="form-error-msg">{formErrors.email}</span>}
                </div>
              </div>

              {/* Subject */}
              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  Subject <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Project inquiry / Opportunity"
                  className={`form-input ${formErrors.subject ? 'is-invalid' : ''}`}
                  disabled={loading}
                  required
                />
                {formErrors.subject && <span className="form-error-msg">{formErrors.subject}</span>}
              </div>

              {/* Message */}
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message <span className="required-star">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your message here..."
                  className={`form-textarea ${formErrors.message ? 'is-invalid' : ''}`}
                  disabled={loading}
                  required
                />
                {formErrors.message && <span className="form-error-msg">{formErrors.message}</span>}
              </div>

              {/* Status Alert Banner */}
              {responseStatus && (
                <div
                  className={`contact-status-banner ${
                    responseStatus.success ? 'status-success' : 'status-error'
                  }`}
                  role="alert"
                >
                  <span className="status-banner-icon">
                    {responseStatus.success ? <CheckIcon size={18} /> : '!'}
                  </span>
                  <div className="status-banner-content">
                    <strong>{responseStatus.success ? 'Message Received' : 'Notice'}</strong>
                    <p>{responseStatus.message}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={loading ? undefined : SendIcon}
                disabled={loading}
                className="contact-submit-btn"
              >
                {loading ? 'Sending Message...' : (sectionConfig.submitBtnText || 'Send Message')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
