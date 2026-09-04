import React, { useState, useEffect } from 'react';
import {
  DownloadIcon,
  MailIcon,
  MapPinIcon,
  GithubIcon,
  LinkedinIcon,
  FileTextIcon,
  ExternalLinkIcon,
  SparklesIcon,
  EyeIcon,
} from '../components/Icons/Icons';
import Button from '../components/Button/Button';
import { useCMS } from '../context/CMSContext';
import { useDocumentPreview } from '../context/DocumentPreviewContext';
import { getResumeDownloadUrl, getResumeViewUrl } from '../services/resumeService';
import './Resume.css';

export const Resume = () => {
  const { profile, experience, education, certifications, projects, resume, socialLinks } = useCMS();
  const { openPreview } = useDocumentPreview();
  const [activeTab, setActiveTab] = useState('pdf'); // default to 'pdf' for immediate preview of uploaded CV

  const getSocialUrl = (platformName, fallback) => {
    const target = platformName.toLowerCase();
    const link = socialLinks?.find(s => {
      const name = (s.name || s.platform || s.label || '').toLowerCase();
      return name === target;
    });
    return link?.url || fallback;
  };

  const githubLink = getSocialUrl('github', 'https://github.com/Dhanush-M-05');
  const linkedinLink = getSocialUrl('linkedin', 'https://www.linkedin.com/in/dhanush151005/');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const resumeViewUrl = getResumeViewUrl();
  const resumeDownloadUrl = getResumeDownloadUrl();

  return (
    <main className="resume-page-container">
      <div className="container">
        {/* Action Header */}
        <div className="resume-action-header no-print">
          <div>
            <span className="resume-label-badge">Curriculum Vitae</span>
            <h1 className="resume-page-title">Professional Resume</h1>
          </div>

          <div className="resume-action-buttons">
            <button
              type="button"
              onClick={() =>
                openPreview({
                  title: 'Professional Resume',
                  subtitle: `${profile?.name || 'Dhanush M'} • ${resume?.fileName || 'Curriculum Vitae'}`,
                  badge: 'Official CV',
                  fileUrl: resumeViewUrl,
                  downloadUrl: resumeDownloadUrl,
                  fileName: resume?.fileName || 'Dhanush-M-Resume.pdf',
                  iconType: 'resume',
                })
              }
              className="btn btn-secondary btn-md"
              title="Preview PDF in mini viewer"
            >
              <EyeIcon size={16} />
              <span>Mini Preview</span>
            </button>

            {activeTab === 'web' && (
              <Button
                onClick={handlePrint}
                variant="secondary"
                size="md"
                icon={FileTextIcon}
                iconPosition="left"
              >
                Print / Save PDF
              </Button>
            )}

            <Button
              href={resumeDownloadUrl}
              download={resume?.fileName || "Dhanush-M-Resume.pdf"}
              variant="primary"
              size="md"
              icon={DownloadIcon}
              iconPosition="left"
            >
              Download PDF
            </Button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="resume-tabs-bar no-print">
          <div className="resume-segmented-control" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'pdf'}
              className={`resume-tab-btn ${activeTab === 'pdf' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('pdf')}
            >
              <FileTextIcon size={16} />
              <span>Official PDF Document</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'web'}
              className={`resume-tab-btn ${activeTab === 'web' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('web')}
            >
              <SparklesIcon size={16} />
              <span>Interactive Web CV</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Embedded PDF Document Preview */}
        {activeTab === 'pdf' && (
          <div className="resume-pdf-view-card">
            <div className="resume-pdf-card-header no-print">
              <div className="resume-pdf-doc-info">
                <span className="live-doc-indicator" />
                <span className="resume-pdf-filename">{resume?.fileName || 'Dhanush-M-Resume.pdf'}</span>
                <span className="resume-pdf-filesize">
                  ({typeof resume?.fileSize === 'number' ? `${Math.round(resume.fileSize / 1024)} KB` : resume?.fileSize || 'Active'})
                </span>
              </div>

              <div className="resume-pdf-card-actions">
                <button
                  type="button"
                  onClick={() =>
                    openPreview({
                      title: 'Professional Resume',
                      subtitle: `${profile?.name || 'Dhanush M'} • ${resume?.fileName || 'Curriculum Vitae'}`,
                      badge: 'Official CV',
                      fileUrl: resumeViewUrl,
                      downloadUrl: resumeDownloadUrl,
                      fileName: resume?.fileName || 'Dhanush-M-Resume.pdf',
                      iconType: 'resume',
                    })
                  }
                  className="resume-card-action-btn"
                  title="Open mini viewer modal"
                >
                  <EyeIcon size={15} />
                  <span>Mini Window</span>
                </button>
                <a
                  href={resumeDownloadUrl}
                  download={resume?.fileName || "Dhanush-M-Resume.pdf"}
                  className="resume-card-action-btn"
                  title="Download copy of PDF"
                >
                  <DownloadIcon size={15} />
                  <span>Download</span>
                </a>
              </div>
            </div>

            <div className="resume-pdf-iframe-container">
              <iframe
                src={`${resumeViewUrl}#toolbar=1`}
                title="Dhanush M Professional Resume PDF"
                className="resume-pdf-embed-frame"
              />
            </div>
          </div>
        )}

        {/* TAB 2: Printable Glass Web Resume Document */}
        {activeTab === 'web' && (
          <div className="resume-paper-glass-card">
            {/* Header */}
            <header className="resume-doc-header">
              <div>
                <h2 className="resume-candidate-name">{profile?.name || 'Dhanush M'}</h2>
                <span className="resume-candidate-role gradient-text">{profile?.role || 'Web Developer / Full Stack Developer'}</span>
              </div>

              <div className="resume-contact-meta">
                <span className="resume-meta-entry">
                  <MailIcon size={14} />
                  <a href={`mailto:${profile?.email || 'dhanush2005mp@gmail.com'}`}>{profile?.email || 'dhanush2005mp@gmail.com'}</a>
                </span>
                <span className="resume-meta-entry">
                  <MapPinIcon size={14} />
                  <span>{profile?.location || 'Chennai, Tamil Nadu'}</span>
                </span>
                <span className="resume-meta-entry">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{profile?.phone || '9344976660'}</span>
                </span>
                <span className="resume-meta-entry">
                  <GithubIcon size={14} />
                  <a href={githubLink} target="_blank" rel="noopener noreferrer">github.com/Dhanush-M-05</a>
                </span>
                <span className="resume-meta-entry">
                  <LinkedinIcon size={14} />
                  <a href={linkedinLink} target="_blank" rel="noopener noreferrer">linkedin.com/in/dhanush151005</a>
                </span>
              </div>
            </header>

            {/* Professional Summary */}
            <section className="resume-doc-section">
              <h3 className="resume-section-heading">Professional Summary</h3>
              <p className="resume-summary-text">
                Motivated Computer Science graduate seeking opportunities in Web Development / Full Stack Development. Strong interest in building responsive web applications and learning modern software development technologies. Experienced with frontend development, backend APIs, databases, Git, and project-based development.
              </p>
            </section>

            {/* Technical Skills Matrix */}
            <section className="resume-doc-section">
              <h3 className="resume-section-heading">Technical Skills</h3>
              <div className="resume-skills-matrix">
                <div className="skill-matrix-row">
                  <span className="matrix-label">Programming Languages:</span>
                  <span className="matrix-values">Java, Python, JavaScript, SQL</span>
                </div>
                <div className="skill-matrix-row">
                  <span className="matrix-label">Frontend:</span>
                  <span className="matrix-values">HTML, CSS, JavaScript, React.js</span>
                </div>
                <div className="skill-matrix-row">
                  <span className="matrix-label">Backend:</span>
                  <span className="matrix-values">Django, Node.js, REST APIs</span>
                </div>
                <div className="skill-matrix-row">
                  <span className="matrix-label">Database:</span>
                  <span className="matrix-values">MySQL</span>
                </div>
                <div className="skill-matrix-row">
                  <span className="matrix-label">Tools & Technologies:</span>
                  <span className="matrix-values">Git, VS Code</span>
                </div>
              </div>
            </section>

            {/* Projects */}
            <section className="resume-doc-section">
              <h3 className="resume-section-heading">Academic & Engineering Projects</h3>
              <div className="resume-projects-list">
                {(projects || []).map((p) => (
                  <div key={p.id || p.title} className="resume-project-item">
                    <div className="resume-item-top">
                      <h4 className="resume-item-title">{p.title}</h4>
                      <span className="resume-tech-inline">{p.technologies?.join(', ')}</span>
                    </div>
                    <p className="resume-item-desc">{p.shortDescription || p.description}</p>
                    {p.features && (
                      <ul className="resume-bullets">
                        {p.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Experience / Internships */}
            <section className="resume-doc-section">
              <h3 className="resume-section-heading">Internship Experience</h3>
              <div className="resume-exp-list">
                {(experience || []).map((exp) => (
                  <div key={exp.id || exp.role} className="resume-exp-item">
                    <div className="resume-item-top">
                      <div>
                        <h4 className="resume-item-title">{exp.role}</h4>
                        <span className="resume-company-name">{exp.company || exp.organization}</span>
                      </div>
                      <span className="resume-date-badge">{exp.duration || exp.period}</span>
                    </div>
                    {exp.responsibilities && (
                      <ul className="resume-bullets">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="resume-doc-section">
              <h3 className="resume-section-heading">Education</h3>
              <div className="resume-edu-list">
                {(education || []).map((edu) => (
                  <div key={edu.id || edu.degree} className="resume-edu-item">
                    <div className="resume-item-top">
                      <div>
                        <h4 className="resume-item-title">{edu.degree}</h4>
                        <span className="resume-inst-name">{edu.institution} {edu.university ? `• ${edu.university}` : ''}</span>
                      </div>
                      <span className="resume-date-badge">Graduation: {edu.year || 2027} | CGPA: {edu.cgpa || '7.20'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            <section className="resume-doc-section">
              <h3 className="resume-section-heading">Certifications</h3>
              <div className="resume-certs-list">
                {(certifications || []).map((cert) => (
                  <div key={cert.id || cert.title || cert.name} className="resume-cert-item">
                    <span className="resume-cert-title">{cert.title || cert.name}</span>
                    <span className="resume-cert-meta">— {cert.issuer} ({cert.year || cert.date})</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

export default Resume;
