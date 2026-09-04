import React from 'react';
import { Link } from 'react-router-dom';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { ArrowUpRightIcon } from '../../components/Icons/Icons';
import { useCMS } from '../../context/CMSContext';
import './ProjectsSection.css';

export const ProjectsSection = () => {
  const { projects, getSection } = useCMS();
  const sectionConfig = getSection('projects');

  const activeProjects = (projects || [])
    .filter((p) => p.isVisible !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <div className="projects-header-wrapper">
          <SectionTitle
            label={sectionConfig.label || "Featured Projects"}
            title={sectionConfig.title || "Selected Work"}
            subtitle={sectionConfig.subtitle || "Explore production-grade full stack applications, interactive storefronts, and specialized web tools engineered with modern tech stacks."}
            align="left"
            className="projects-title-block"
          />

          <Link to="/projects" className="view-all-projects-btn">
            <span>View All Projects ({activeProjects.length})</span>
            <ArrowUpRightIcon size={16} />
          </Link>
        </div>

        {/* Bento Grid Layout */}
        <div className="projects-bento-grid">
          {activeProjects.map((project, index) => (
            <ProjectCard
              key={project.id || project.slug}
              project={project}
              size={index === 0 ? 'large' : 'medium'}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
