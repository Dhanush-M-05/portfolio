import React from 'react';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import { LayoutIcon, LayersIcon, CodeIcon, ServerIcon, TerminalIcon, SparklesIcon, ArrowUpRightIcon } from '../../components/Icons/Icons';
import { useCMS } from '../../context/CMSContext';
import './Services.css';

export const Services = () => {
  const { services, getSection } = useCMS();
  const sectionConfig = getSection('services');

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'LayoutIcon':
        return <LayoutIcon size={22} />;
      case 'LayersIcon':
        return <LayersIcon size={22} />;
      case 'CodeIcon':
        return <CodeIcon size={22} />;
      case 'ServerIcon':
        return <ServerIcon size={22} />;
      case 'TerminalIcon':
        return <TerminalIcon size={22} />;
      case 'SparklesIcon':
        return <SparklesIcon size={22} />;
      default:
        return <CodeIcon size={22} />;
    }
  };

  const activeServices = (services || [])
    .filter((s) => s.isVisible !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  return (
    <section id="services" className="section services-section">
      <div className="container">
        <SectionTitle
          label={sectionConfig.label || "Services"}
          title={sectionConfig.title || "What I Do"}
          subtitle={sectionConfig.subtitle || "Specialized web development capabilities focused on scalable code, performant user interfaces, and seamless API integrations."}
        />

        <div className="services-cards-grid">
          {activeServices.map((service) => (
            <article key={service.id || service.title} className="service-glass-card">
              <div className="service-card-top">
                <div className="service-icon-container">
                  {getServiceIcon(service.icon)}
                </div>
                <span className="service-number">{service.number}</span>
              </div>

              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.shortDescription}</p>

              {service.deliverables && (
                <div className="service-deliverables-list">
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="deliverable-item">
                      <span className="deliverable-dot" aria-hidden="true" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              <a href={service.link || "#contact"} className="service-card-footer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="service-footer-label">{service.actionText || sectionConfig.cardActionText || "Available for implementation"}</span>
                <div className="service-arrow-indicator" aria-hidden="true">
                  <ArrowUpRightIcon size={16} />
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
