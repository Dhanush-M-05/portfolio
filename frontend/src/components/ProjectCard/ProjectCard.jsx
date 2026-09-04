import React from 'react';
import { Link } from 'react-router-dom';
import { GithubIcon, ExternalLinkIcon, ArrowUpRightIcon } from '../Icons/Icons';
import { useCMS } from '../../context/CMSContext';
import './ProjectCard.css';

export const ProjectCard = ({ project, size = 'default' }) => {
  const { getSection } = useCMS();
  const sectionConfig = getSection('projects');
  const {
    slug,
    title,
    category,
    shortDescription,
    features,
    technologies = [],
    githubUrl,
    liveUrl,
    coverGradient,
    accentColor = '#6366F1'
  } = project;

  const githubBtnText = project.githubBtnText || sectionConfig.githubBtnText || "Code";
  const liveDemoBtnText = project.liveDemoBtnText || sectionConfig.liveDemoBtnText || "Demo";
  const detailsBtnText = project.detailsBtnText || sectionConfig.detailsBtnText || "Details";

  return (
    <article className={`bento-project-card bento-size-${size || project.size || 'medium'}`}>
      {/* Visual Header / Mockup Preview */}
      <div 
        className="project-card-preview" 
        style={{ 
          background: 'linear-gradient(135deg, #F1F4FD 0%, #E8EDFB 50%, #DFE7FA 100%)' 
        }}
      >
        <div className="preview-browser-frame">
          <div className="browser-header">
            <div className="browser-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <div className="browser-address-bar">
              <span className="url-prefix">https://</span>
              <span className="url-slug">{slug}.app</span>
            </div>
          </div>
          <div className="browser-content-canvas">
            <div className="mini-ui-layout">
              <div className="mini-sidebar">
                <div className="mini-line w-60" />
                <div className="mini-line w-40" />
                <div className="mini-line w-50" />
              </div>
              <div className="mini-main">
                <div className="mini-header-bar">
                  <div className="mini-pill" style={{ borderColor: accentColor }} />
                  <div className="mini-pill" />
                </div>
                <div className="mini-cards-grid">
                  <div className="mini-card highlight" style={{ borderLeftColor: accentColor }}>
                    <div className="mini-line w-80" />
                    <div className="mini-line w-50" />
                  </div>
                  <div className="mini-card">
                    <div className="mini-line w-70" />
                    <div className="mini-line w-40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Floating Tag */}
        <span className="project-category-tag">
          {category}
        </span>
      </div>

      {/* Card Body */}
      <div className="project-card-body">
        <div className="project-card-header">
          <h3 className="project-card-title">
            <Link to={`/projects/${slug}`}>{title}</Link>
          </h3>
          <Link 
            to={`/projects/${slug}`} 
            className="project-detail-icon-link" 
            aria-label={`View details for ${title}`}
          >
            <ArrowUpRightIcon size={18} />
          </Link>
        </div>

        <p className="project-card-description">{shortDescription}</p>

        {/* Key Features from CV */}
        {features && features.length > 0 && (
          <ul className="project-card-features">
            {features.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="project-feature-bullet">
                <span className="bullet-indicator" aria-hidden="true">•</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Tech Stack Badges */}
        <div className="project-tech-list">
          {technologies.map((tech) => (
            <span key={tech} className="tech-badge">
              {tech}
            </span>
          ))}
        </div>

        {/* Card Footer Actions */}
        <div className="project-card-actions">
          <div className="project-links-group">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-action-btn"
                aria-label={`View ${title} source code on GitHub`}
              >
                <GithubIcon size={16} />
                <span>{githubBtnText}</span>
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-action-btn project-action-live"
                aria-label={`Open live demo for ${title}`}
              >
                <ExternalLinkIcon size={16} />
                <span>{liveDemoBtnText}</span>
              </a>
            )}
          </div>

          <Link to={`/projects/${slug}`} className="project-view-details-btn">
            <span>{detailsBtnText}</span>
            <ArrowUpRightIcon size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
