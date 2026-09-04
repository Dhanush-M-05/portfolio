import React from 'react';
import { useCMS } from '../context/CMSContext';
import Hero from '../sections/Hero/Hero';
import About from '../sections/About/About';
import Services from '../sections/Services/Services';
import Skills from '../sections/Skills/Skills';
import ProjectsSection from '../sections/Projects/ProjectsSection';
import Experience from '../sections/Experience/Experience';
import Education from '../sections/Education/Education';
import Certifications from '../sections/Certifications/Certifications';
import Achievements from '../sections/Achievements/Achievements';
import ResumeSection from '../sections/ResumeSection/ResumeSection';
import ContactSection from '../sections/Contact/ContactSection';

export const Home = () => {
  const { sections } = useCMS();

  const componentMap = {
    hero: <Hero />,
    about: <About />,
    services: <Services />,
    skills: <Skills />,
    projects: <ProjectsSection />,
    experience: <Experience />,
    education: <Education />,
    certifications: <Certifications />,
    achievements: <Achievements />,
    resume: <ResumeSection />,
    contact: <ContactSection />,
  };

  const activeSections = (sections && sections.length > 0 ? [...sections] : [
    { id: 'hero', isVisible: true, order: 1 },
    { id: 'about', isVisible: true, order: 2 },
    { id: 'services', isVisible: true, order: 3 },
    { id: 'skills', isVisible: true, order: 4 },
    { id: 'projects', isVisible: true, order: 5 },
    { id: 'experience', isVisible: true, order: 6 },
    { id: 'education', isVisible: true, order: 7 },
    { id: 'certifications', isVisible: true, order: 8 },
    { id: 'achievements', isVisible: true, order: 9 },
    { id: 'resume', isVisible: true, order: 10 },
    { id: 'contact', isVisible: true, order: 11 },
  ])
    .filter((s) => s.isVisible !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  return (
    <main id="main-content">
      {activeSections.map((sec) => (
        <React.Fragment key={sec.id}>
          {componentMap[sec.id]}
        </React.Fragment>
      ))}
    </main>
  );
};

export default Home;
