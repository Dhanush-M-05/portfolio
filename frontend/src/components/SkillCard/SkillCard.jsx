import React from 'react';
import { CodeIcon, ServerIcon, DatabaseIcon, TerminalIcon, CpuIcon } from '../Icons/Icons';
import './SkillCard.css';

export const SkillCard = ({ skill }) => {
  const { name, category, description, tag } = skill;

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'languages':
        return <CpuIcon size={18} />;
      case 'frontend':
        return <CodeIcon size={18} />;
      case 'backend':
        return <ServerIcon size={18} />;
      case 'database':
        return <DatabaseIcon size={18} />;
      case 'tools':
        return <TerminalIcon size={18} />;
      default:
        return <CodeIcon size={18} />;
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'languages':
        return 'Language';
      case 'frontend':
        return 'Frontend';
      case 'backend':
        return 'Backend';
      case 'database':
        return 'Database';
      case 'tools':
        return 'Tool';
      default:
        return tag || 'Skill';
    }
  };

  return (
    <div className="skill-card-item">
      <div className="skill-card-top">
        <div className="skill-icon-wrapper">
          {getCategoryIcon(category)}
        </div>
        <div className="skill-meta">
          <h4 className="skill-name">{name}</h4>
          <span className="skill-category-badge">{getCategoryLabel(category)}</span>
        </div>
      </div>

      <p className="skill-description">{description}</p>
    </div>
  );
};

export default SkillCard;
