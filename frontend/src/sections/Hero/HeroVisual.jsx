import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

export const HeroVisual = () => {
  const { profile } = useCMS();
  const [imageError, setImageError] = useState(false);

  const photoSrc = (!imageError && (profile?.image || profile?.avatarUrl)) ? (profile.image || profile.avatarUrl) : '/dhanush-profile.jpg';

  const name = profile?.name || 'Dhanush M';
  const degree = profile?.degree || 'B.E.';
  const department = profile?.department || 'Computer Science and Engineering';
  const college = profile?.college || 'J.N.N Institute';

  const eduParts = [];
  if (degree && department) {
    eduParts.push(`${degree} ${department}`);
  } else if (degree || department) {
    eduParts.push(degree || department);
  }
  if (college) {
    eduParts.push(college);
  }
  const fullEduText = eduParts.join(' • ');

  const isComputerScience = /computer\s*science/i.test(department);
  const shortDept = isComputerScience ? 'CSE' : department;
  const shortEduParts = [];
  if (degree && shortDept) {
    shortEduParts.push(`${degree} ${shortDept}`);
  } else if (degree || shortDept) {
    shortEduParts.push(degree || shortDept);
  }
  if (college) {
    shortEduParts.push(college);
  }
  const shortEduText = shortEduParts.join(' • ');

  return (
    <div className="hero-visual-column">
      <div className="hero-portrait-composition" aria-label={`Portrait of ${name}`}>
        {/* Ambient background glow ring */}
        <div className="hero-portrait-glow-backdrop" />

        {/* Main Glass Portrait Frame */}
        <div className="hero-portrait-glass-card">
          {/* Profile Image Container */}
          <div className="hero-portrait-image-wrapper">
            <img
              src={photoSrc}
              alt={name}
              className="hero-portrait-image"
              onError={() => setImageError(true)}
              loading="eager"
            />

            {/* Bottom Gradient Overlay with Name, Degree, Department & College */}
            <div className="hero-portrait-overlay">
              <h3 className="portrait-overlay-name">{name}</h3>
              <p className="portrait-overlay-education">
                <span className="portrait-education-full">{fullEduText}</span>
                <span className="portrait-education-short">{shortEduText}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVisual;
