import React from 'react';
import './SectionTitle.css';

export const SectionTitle = ({
  label,
  title,
  subtitle,
  align = 'center', // 'left' | 'center'
  className = '',
}) => {
  return (
    <div className={`section-header-block align-${align} ${className}`}>
      {label && (
        <div className="section-header-badge">
          <span className="badge-dot" aria-hidden="true" />
          <span>{label}</span>
        </div>
      )}
      {title && <h2 className="section-main-heading">{title}</h2>}
      {subtitle && <p className="section-main-subtitle">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
