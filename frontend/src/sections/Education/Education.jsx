import React from 'react';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import { GraduationCapIcon, CalendarIcon, MapPinIcon, CheckIcon } from '../../components/Icons/Icons';
import { useCMS } from '../../context/CMSContext';
import './Education.css';

export const Education = () => {
  const { education, getSection } = useCMS();
  const sectionConfig = getSection('education');

  const activeEducation = (education || [])
    .filter((edu) => edu.isVisible !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  return (
    <section id="education" className="section education-section">
      <div className="container">
        <SectionTitle
          label={sectionConfig.label || "Academic Foundation"}
          title={sectionConfig.title || "Education"}
          subtitle={sectionConfig.subtitle || "Formal engineering education in Computer Science, covering algorithm design, data structures, and modern software engineering."}
        />

        <div className="education-cards-container">
          {activeEducation.map((edu) => (
            <div key={edu.id || edu.degree} className="education-glass-card">
              <div className="education-header">
                <div className="education-icon-box" aria-hidden="true">
                  <GraduationCapIcon size={24} />
                </div>
                <div className="education-title-meta">
                  <span className="education-grade-badge">
                    {edu.cgpa ? `CGPA: ${edu.cgpa}` : (edu.grade || 'CGPA: 7.20')}
                  </span>
                  <h3 className="education-degree">{edu.degree}</h3>
                  <h4 className="education-institution">
                    {edu.institution} {edu.university ? `• ${edu.university}` : ''}
                  </h4>
                </div>
                <div className="education-time-location">
                  <span className="meta-info">
                    <CalendarIcon size={14} />
                    <span>{edu.period || `Graduation: ${edu.year || 2027}`}</span>
                  </span>
                  {edu.location && (
                    <span className="meta-info">
                      <MapPinIcon size={14} />
                      <span>{edu.location}</span>
                    </span>
                  )}
                </div>
              </div>

              {edu.description && (
                <p className="education-desc-text">{edu.description}</p>
              )}

              {edu.highlights && (
                <div className="education-highlights-list">
                  {edu.highlights.map((highlight, idx) => (
                    <div key={idx} className="education-highlight-item">
                      <CheckIcon size={14} className="highlight-check" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
