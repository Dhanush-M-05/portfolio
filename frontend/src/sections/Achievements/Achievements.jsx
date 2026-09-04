import React from 'react';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import { AwardIcon, SparklesIcon, CalendarIcon } from '../../components/Icons/Icons';
import { useCMS } from '../../context/CMSContext';
import './Achievements.css';

export const Achievements = () => {
  const { achievements, getSection } = useCMS();
  const sectionConfig = getSection('achievements');

  const activeAchievements = (achievements || [])
    .filter((item) => item.isVisible !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  if (!activeAchievements || activeAchievements.length === 0) {
    return null;
  }

  return (
    <section id="achievements" className="section achievements-section">
      <div className="container">
        <SectionTitle
          label={sectionConfig.label || "Recognition"}
          title={sectionConfig.title || "Honors & Achievements"}
          subtitle={sectionConfig.subtitle || "Key competitive milestones, hackathon awards, and technical recognitions."}
        />

        <div className="achievements-cards-grid">
          {activeAchievements.map((item) => (
            <article key={item.id || item.title} className="achievement-glass-card">
              <div className="achievement-card-header">
                <div className="achievement-icon-box" aria-hidden="true">
                  <AwardIcon size={22} />
                </div>
                {item.year && (
                  <span className="achievement-year-badge">
                    <CalendarIcon size={13} /> {item.year}
                  </span>
                )}
              </div>

              <h3 className="achievement-title">{item.title}</h3>
              
              {item.organization && (
                <span className="achievement-org-name">{item.organization}</span>
              )}

              <p className="achievement-description">{item.description}</p>

              <div className="achievement-verified-tag">
                <SparklesIcon size={13} /> Verified Milestone
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
