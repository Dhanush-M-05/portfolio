import React, { useState } from 'react';
import { SectionTitle } from '../components/SectionTitle/SectionTitle';
import ProjectCard from '../components/ProjectCard/ProjectCard';
import { SearchIcon, CloseIcon } from '../components/Icons/Icons';
import { useCMS } from '../context/CMSContext';
import './Projects.css';

export const Projects = () => {
  const { projects, getSection, profile } = useCMS();
  const sectionConfig = getSection('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'Full Stack', name: 'Full Stack' },
    { id: 'Frontend', name: 'Frontend' },
    { id: 'Web Application', name: 'Web Applications' }
  ];

  const visibleProjects = (projects || [])
    .filter((p) => p.isVisible !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  const filteredProjects = visibleProjects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (project.category && project.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    const matchesSearch =
      (project.title && project.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.shortDescription && project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.technologies && Array.isArray(project.technologies) && project.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="projects-page-container">
      <div className="container">
        {/* Page Header */}
        <div className="projects-page-header">
          <SectionTitle
            label={sectionConfig.label || "Work Portfolio"}
            title={sectionConfig.title || "Projects & Case Studies"}
            subtitle={sectionConfig.subtitle || `Browse all production-level web applications, full-stack systems, and interface designs engineered by ${profile?.name || 'Dhanush M'}.`}
          />

          {/* Search & Filter Bar */}
          <div className="projects-control-bar">
            {/* Search Input */}
            <div className="search-input-wrapper">
              <SearchIcon size={18} className="search-svg" />
              <input
                type="text"
                placeholder="Search projects by title, tech stack (e.g. React, Django)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="projects-search-input"
                aria-label="Search projects"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <CloseIcon size={14} />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="category-filter-pills" role="tablist">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat.id}
                  className={`category-filter-pill ${selectedCategory === cat.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="projects-full-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id || project.slug} project={project} size="medium" />
            ))}
          </div>
        ) : (
          <div className="projects-empty-state">
            <h3>No matching projects found</h3>
            <p>Try adjusting your search keywords or filter criteria.</p>
            <button
              type="button"
              className="reset-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Projects;
