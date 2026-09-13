import React from 'react';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import { BriefcaseIcon, MapPinIcon, CalendarIcon, CheckIcon } from '../../components/Icons/Icons';
import { useCMS } from '../../context/CMSContext';
import './Experience.css';

export const Experience = () => {
  const { experience, getSection } = useCMS();
  const sectionConfig = getSection('experience');

  const activeExperience = (experience || [])
    .filter((item) => item.isVisible !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  if (!activeExperience || activeExperience.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <SectionTitle
          label={sectionConfig.label || "Career History"}
          title={sectionConfig.title || "Internship & Experience"}
          subtitle={sectionConfig.subtitle || "Hands-on industry internships applying modern frontend libraries, backend architectures, and relational database systems to deliver full-stack features."}
        />

        <div className="experience-timeline">
          {activeExperience.map((item, index) => (
            <div key={item.id || index} className="experience-timeline-item">
              <div className="timeline-marker">
                <div className="timeline-node-icon">
                  <BriefcaseIcon size={16} />
                </div>
                {index !== experience.length - 1 && <div className="timeline-vertical-line" />}
              </div>

              <div className="experience-glass-card">
                <div className="experience-card-header">
                  <div>
                    <span className="experience-type-tag">{item.type || 'Internship'}</span>
                    <h3 className="experience-role-title">{item.role}</h3>
                    <h4 className="experience-org-name">{item.company || item.organization}</h4>
                  </div>

                  <div className="experience-meta-pill">
                    <span className="meta-info">
                      <CalendarIcon size={14} />
                      <span>{item.duration || item.period}</span>
                    </span>
                    {item.location && (
                      <span className="meta-info">
                        <MapPinIcon size={14} />
                        <span>{item.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="experience-summary">{item.description}</p>

                {item.responsibilities && (
                  <div className="experience-responsibilities">
                    <h5 className="responsibilities-heading">Key Contributions:</h5>
                    <ul className="responsibilities-list">
                      {item.responsibilities.map((resp, i) => (
                        <li key={i} className="responsibility-item">
                          <CheckIcon size={14} className="resp-check" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.technologies && (
                  <div className="experience-tech-row">
                    {item.technologies.map((tech) => (
                      <span key={tech} className="tech-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
