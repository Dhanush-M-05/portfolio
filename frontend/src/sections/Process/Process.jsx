import React from 'react';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import { SearchIcon, LayoutIcon, CodeIcon, SparklesIcon, CheckIcon } from '../../components/Icons/Icons';
import './Process.css';

export const Process = () => {
  const steps = [
    {
      number: "01",
      title: "Discover",
      subtitle: "Requirements & Scope",
      description: "Analyze core problem statements, target user personas, system workflows, and technical constraints.",
      icon: <SearchIcon size={20} />
    },
    {
      number: "02",
      title: "Plan",
      subtitle: "Architecture & Schema",
      description: "Design relational database schemas, state hierarchies, API endpoint contracts, and folder structures.",
      icon: <LayoutIcon size={20} />
    },
    {
      number: "03",
      title: "Design",
      subtitle: "Tokens & Layout",
      description: "Define CSS design tokens, responsive layout grids, WCAG contrast standards, and glassmorphic micro-interactions.",
      icon: <SparklesIcon size={20} />
    },
    {
      number: "04",
      title: "Develop",
      subtitle: "Modular Code",
      description: "Write clean React components, custom hooks, Axios service abstractions, and robust backend endpoints.",
      icon: <CodeIcon size={20} />
    },
    {
      number: "05",
      title: "Refine",
      subtitle: "Test & Optimize",
      description: "Audit Lighthouse scores, verify cross-browser responsiveness, validate edge cases, and deploy cleanly.",
      icon: <CheckIcon size={20} />
    }
  ];

  return (
    <section id="process" className="section process-section">
      <div className="container">
        <SectionTitle
          label="Development Methodology"
          title="How I Build"
          subtitle="A structured 5-phase engineering workflow ensuring high code quality, predictability, and polished user experiences."
        />

        <div className="process-timeline-wrapper">
          <div className="process-connecting-line" aria-hidden="true" />
          
          <div className="process-steps-grid">
            {steps.map((step, idx) => (
              <div key={step.number} className="process-step-card">
                <div className="process-node-indicator">
                  <span className="process-node-dot" />
                  <span className="process-step-num">{step.number}</span>
                </div>

                <div className="process-card-content">
                  <div className="process-icon-box" aria-hidden="true">
                    {step.icon}
                  </div>
                  <h3 className="process-title">{step.title}</h3>
                  <span className="process-subtitle">{step.subtitle}</span>
                  <p className="process-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
