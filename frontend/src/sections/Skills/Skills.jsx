import React, { useState } from 'react';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import SkillCard from '../../components/SkillCard/SkillCard';
import { useCMS } from '../../context/CMSContext';
import './Skills.css';

export const Skills = () => {
  const { skills, skillCategories, getSection } = useCMS();
  const sectionConfig = getSection('skills');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = skillCategories || [
    { id: "all", name: "All Skills" },
    { id: "languages", name: "Programming Languages" },
    { id: "frontend", name: "Frontend" },
    { id: "backend", name: "Backend" },
    { id: "database", name: "Database" },
    { id: "tools", name: "Tools & Technologies" }
  ];

  const visibleSkills = (skills || []).filter((s) => s.isVisible !== false);

  const filteredSkills = selectedCategory === 'all'
    ? visibleSkills
    : visibleSkills.filter((skill) => skill.category === selectedCategory);

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <SectionTitle
          label={sectionConfig.label || "Skills & Stack"}
          title={sectionConfig.title || "Technical Skills"}
          subtitle={sectionConfig.subtitle || "Core competencies across programming languages, modern frontend libraries, backend architectures, databases, and version control tooling."}
        />

        {/* Category Tabs Filter Bar */}
        <div className="skills-filter-container">
          <div className="skills-tabs-pill" role="tablist" aria-label="Technology categories">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category.id}
                className={`category-tab-btn ${selectedCategory === category.id ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span>{category.name}</span>
                <span className="category-count">
                  {category.id === 'all' 
                    ? (skills || []).length 
                    : (skills || []).filter(s => s.category === category.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="skills-grid-layout">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
