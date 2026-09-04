import React, { useState, useEffect } from 'react';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import {
  CodeIcon,
  LayersIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  MailIcon,
  DownloadIcon
} from '../../components/Icons/Icons';
import { useCMS } from '../../context/CMSContext';
import { getAbout } from '../../api/aboutService';
import { getResumeDownloadUrl } from '../../services/resumeService';
import './About.css';

export const About = () => {
  const { about: contextAbout, profile, getSection } = useCMS();
  const sectionConfig = getSection('about');
  const [aboutData, setAboutData] = useState(contextAbout);
  const [isLoading, setIsLoading] = useState(!contextAbout);

  // Directly fetch authoritative database record on mount to guarantee fresh API data
  useEffect(() => {
    let isMounted = true;

    const fetchAuthoritativeAbout = async () => {
      try {
        const data = await getAbout();
        if (isMounted && data) {
          setAboutData(data);
        }
      } catch (err) {
        console.warn('Direct about API fetch error, relying on context:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAuthoritativeAbout();

    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize when context state updates (e.g. from Admin save in same session)
  useEffect(() => {
    if (contextAbout) {
      setAboutData(contextAbout);
      setIsLoading(false);
    }
  }, [contextAbout]);

  // Loading skeleton / state
  if (isLoading && !aboutData) {
    return (
      <section id="about" className="section about-section">
        <div className="container">
          <SectionTitle
            label={sectionConfig.label || "About Me"}
            title="Loading..."
            subtitle="Fetching latest profile information from API..."
          />
        </div>
      </section>
    );
  }

  const about = aboutData || {};

  // Extract skills highlight into badge array
  const skillsArray = about.skills_highlight
    ? about.skills_highlight.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const coreFocus = about.core_focus && about.core_focus.length > 0
    ? about.core_focus
    : [
        {
          icon: <CodeIcon size={20} />,
          title: "Frontend Engineering",
          description: "Building responsive, modular user interfaces with HTML, CSS, JavaScript, and React.js."
        },
        {
          icon: <LayersIcon size={20} />,
          title: "Backend & REST APIs",
          description: "Designing structured backend services, view logic, and API endpoints using Django and Node.js."
        },
        {
          icon: <ShieldCheckIcon size={20} />,
          title: "Database Management",
          description: "Engineering relational database schemas, tables, and optimized queries with MySQL."
        },
        {
          icon: <SparklesIcon size={20} />,
          title: "Developer Workflows",
          description: "Collaborating with Git version control, GitHub repositories, and structured debugging in VS Code."
        }
      ];

  const photoUrl = about.image_url || about.image || profile?.avatarUrl || '/dhanush-profile.jpg';

  return (
    <section id="about" className="section about-section">
      <div className="container">
        {/* Dynamic Section Header */}
        <SectionTitle
          label={sectionConfig.label || "About Me"}
          title={about.heading || sectionConfig.title || "Professional Summary"}
          subtitle={about.subheading || sectionConfig.subtitle || "A dedicated developer focused on responsive web development, robust backend APIs, and clean software practices."}
        />

        <div className="about-main-grid">
          {/* Narrative Card */}
          <div className="about-narrative-card">
            {/* Header: Photo, Greeting, Location */}
            <div className="about-identity-header">
              {photoUrl && (
                <div className="about-avatar-frame">
                  <img
                    src={photoUrl}
                    alt={profile?.name || "Dhanush M"}
                    className="about-avatar-photo"
                    onError={(e) => {
                      e.target.src = '/dhanush-profile.jpg';
                    }}
                  />
                </div>
              )}
              <div className="about-identity-content">
                <h3 className="about-bio-heading">
                  {about.short_intro || `Hi, I'm ${profile?.name || 'Dhanush M'} — ${profile?.role || 'Web Developer'}.`}
                </h3>
                {about.location && (
                  <span className="about-location-badge">
                    {about.location}
                  </span>
                )}
              </div>
            </div>

            {/* Paragraph 1: Full Description */}
            {about.description && (
              <p className="about-bio-text">
                {about.description}
              </p>
            )}

            {/* Paragraph 2: Professional Summary */}
            {about.professional_summary && (
              <p className="about-bio-text">
                {about.professional_summary}
              </p>
            )}

            {/* Dynamic Metrics & Key Stats */}
            <div className="about-stats-grid">
              <div className="about-stat-item">
                <span className="stat-value gradient-text">{about.years_experience || "1+"}</span>
                <span className="stat-label">Experience</span>
              </div>
              <div className="about-stat-item">
                <span className="stat-value gradient-text">{about.projects_completed || "3+"}</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="about-stat-item">
                <span className="stat-value gradient-text">{about.degree || "B.E CSE"}</span>
                <span className="stat-label">Degree</span>
              </div>
              <div className="about-stat-item">
                <span className="stat-value gradient-text">{about.cgpa || "7.20"}</span>
                <span className="stat-label">CGPA</span>
              </div>
            </div>

            {/* Dynamic Skills Highlight Badges */}
            {skillsArray.length > 0 && (
              <div className="about-skills-highlight-box">
                <span className="about-skills-label">Core Technologies</span>
                <div className="about-skills-chips-wrap">
                  {skillsArray.map((skill, idx) => (
                    <span key={idx} className="about-skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Contact Bar */}
            {(about.email || about.phone) && (
              <div className="about-contact-quick-bar">
                {about.email && (
                  <a href={`mailto:${about.email}`} className="about-contact-meta-item">
                    <MailIcon size={15} /> {about.email}
                  </a>
                )}
                {about.phone && (
                  <a href={`tel:${about.phone}`} className="about-contact-meta-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {about.phone}
                  </a>
                )}
              </div>
            )}

            {/* Actions: Primary CTA & Resume */}
            <div className="about-cta-row">
              {about.cta_text && (
                <a
                  href={about.cta_link || "#projects"}
                  className="btn btn-primary about-cta-btn"
                >
                  {about.cta_text} <ArrowRightIcon size={16} />
                </a>
              )}

              {about.resume_url && (
                <a
                  href={getResumeDownloadUrl()}
                  download="Dhanush_M_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary about-cta-btn"
                >
                  <DownloadIcon size={16} /> Download CV
                </a>
              )}
            </div>
          </div>

          {/* Core Focus Columns */}
          <div className="about-pillars-column">
            {coreFocus.map((pillar, idx) => (
              <div key={idx} className="pillar-glass-card">
                <div className="pillar-icon-box" aria-hidden="true">
                  {pillar.icon || <CodeIcon size={20} />}
                </div>
                <div className="pillar-content">
                  <h4 className="pillar-title">{pillar.title}</h4>
                  <p className="pillar-desc">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
