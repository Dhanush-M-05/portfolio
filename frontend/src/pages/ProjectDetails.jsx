import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GithubIcon, ExternalLinkIcon, CheckIcon } from '../components/Icons/Icons';
import Button from '../components/Button/Button';
import { useCMS } from '../context/CMSContext';
import { getProjectBySlug } from '../services/projectsApi';
import './ProjectDetails.css';

export const ProjectDetails = () => {
  const { slug } = useParams();
  const { projects } = useCMS();
  const [fetchedProject, setFetchedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;
    setIsLoading(true);

    getProjectBySlug(slug)
      .then((data) => {
        if (isMounted) {
          setFetchedProject(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('API getProjectBySlug notice, checking context:', err.message);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const project = fetchedProject || projects.find((p) => p.slug === slug || p.id === slug);

  if (isLoading && !project) {
    return (
      <main className="project-not-found container">
        <div className="not-found-glass-card">
          <h2>Loading Project...</h2>
          <p>Fetching project details from server...</p>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="project-not-found container">
        <div className="not-found-glass-card">
          <h2>Project Not Found</h2>
          <p>The project "{slug}" could not be located in this portfolio.</p>
          <Button to="/projects" variant="primary">
            Back to All Projects
          </Button>
        </div>
      </main>
    );
  }

  // Find next and previous projects for navigation
  const currentIndex = projects.findIndex((p) => p.slug === slug || p.id === slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <main className="project-detail-page">
      {/* Top Breadcrumb Header */}
      <div className="container">
        <nav className="project-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/projects" className="breadcrumb-link">Projects</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{project.title}</span>
        </nav>
      </div>

      {/* Project Hero Banner */}
      <section className="project-hero-section">
        <div className="container">
          <div className="project-hero-glass-card">
            <div className="project-hero-meta-row">
              <span className="project-hero-category">{project.category}</span>
              {project.stats && (
                <div className="project-hero-stats">
                  {Object.entries(project.stats).map(([k, val]) => (
                    <span key={k} className="stat-pill">{val}</span>
                  ))}
                </div>
              )}
            </div>

            <h1 className="project-hero-title">{project.title}</h1>
            <p className="project-hero-tagline">{project.tagline}</p>

            <div className="project-hero-actions">
              {project.liveUrl && (
                <Button
                  href={project.liveUrl}
                  variant="primary"
                  size="md"
                  icon={ExternalLinkIcon}
                >
                  {project.liveDemoBtnText || "Live Demo"}
                </Button>
              )}
              {project.githubUrl && (
                <Button
                  href={project.githubUrl}
                  variant="secondary"
                  size="md"
                  icon={GithubIcon}
                >
                  {project.githubBtnText || "Source Code"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Case Study Content */}
      <div className="container">
        <div className="project-case-study-layout">
          {/* Main Case Content */}
          <div className="case-study-main">
            {/* 1. Overview */}
            <section className="case-study-card">
              <h2 className="case-section-title">
                <span className="case-number">01</span>
                <span>Project Overview</span>
              </h2>
              <p className="case-text">{project.overview || project.shortDescription}</p>
            </section>

            {/* 2. Problem & Solution Comparison */}
            {(project.problem || project.solution) && (
              <section className="case-study-card">
                <h2 className="case-section-title">
                  <span className="case-number">02</span>
                  <span>The Challenge & Solution</span>
                </h2>
                <div className="problem-solution-grid">
                  {project.problem && (
                    <div className="ps-card problem-card">
                      <div className="ps-header">
                        <span className="ps-indicator red" />
                        <h4>The Problem</h4>
                      </div>
                      <p>{project.problem}</p>
                    </div>
                  )}
                  {project.solution && (
                    <div className="ps-card solution-card">
                      <div className="ps-header">
                        <span className="ps-indicator green" />
                        <h4>The Engineering Solution</h4>
                      </div>
                      <p>{project.solution}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 3. Key Features */}
            {project.features && project.features.length > 0 && (
              <section className="case-study-card">
                <h2 className="case-section-title">
                  <span className="case-number">03</span>
                  <span>Key Features & Architecture</span>
                </h2>
                <div className="case-features-grid">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="feature-check-item">
                      <div className="feature-check-icon">
                        <CheckIcon size={14} />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Development Approach & Challenges */}
            {(project.developmentApproach || (project.challenges && project.challenges.length > 0)) && (
              <section className="case-study-card">
                <h2 className="case-section-title">
                  <span className="case-number">04</span>
                  <span>Engineering Approach & Challenges</span>
                </h2>
                {project.developmentApproach && <p className="case-text">{project.developmentApproach}</p>}

                {project.challenges && project.challenges.length > 0 && (
                  <div className="challenges-breakdown-list">
                    {project.challenges.map((c, idx) => (
                      <div key={idx} className="challenge-block">
                        <h4 className="challenge-heading">Challenge: {c.challenge}</h4>
                        <p className="solution-text"><strong>Resolution:</strong> {c.solution}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar Specs */}
          <aside className="case-study-sidebar">
            <div className="sidebar-glass-card">
              <h3 className="sidebar-heading">Project Specs</h3>

              <div className="spec-group">
                <span className="spec-label">Category</span>
                <span className="spec-value">{project.category}</span>
              </div>

              <div className="spec-group">
                <span className="spec-label">Technologies Used</span>
                <div className="sidebar-tech-badges">
                  {project.technologies && project.technologies.map((t) => (
                    <span key={t} className="tech-badge">{t}</span>
                  ))}
                </div>
              </div>

              <div className="spec-group">
                <span className="spec-label">Links & Repositories</span>
                <div className="sidebar-actions-col">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="sidebar-link-btn">
                      <ExternalLinkIcon size={16} />
                      <span>Live Demo URL</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="sidebar-link-btn">
                      <GithubIcon size={16} />
                      <span>GitHub Repository</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Next / Previous Project Navigation */}
        <div className="project-pagination-row">
          {prevProject ? (
            <Link to={`/projects/${prevProject.slug}`} className="pagination-card prev-card">
              <span className="pagination-label">← Previous Project</span>
              <span className="pagination-title">{prevProject.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link to={`/projects/${nextProject.slug}`} className="pagination-card next-card">
              <span className="pagination-label">Next Project →</span>
              <span className="pagination-title">{nextProject.title}</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  );
};

export default ProjectDetails;
