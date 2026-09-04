import React from 'react';
import { Link } from 'react-router-dom';
import { GithubIcon, LinkedinIcon, MailIcon, ArrowUpRightIcon, DownloadIcon, SparklesIcon, ArrowRightIcon } from '../../components/Icons/Icons';
import Button from '../../components/Button/Button';
import HeroVisual from './HeroVisual';
import { useCMS } from '../../context/CMSContext';
import { getResumeDownloadUrl } from '../../services/resumeService';
import './Hero.css';

export const Hero = () => {
  const { profile, hero, socialLinks, resume } = useCMS();

  const getSocialIcon = (iconName) => {
    switch (iconName) {
      case 'GithubIcon':
        return <GithubIcon size={19} />;
      case 'LinkedinIcon':
        return <LinkedinIcon size={19} />;
      case 'MailIcon':
        return <MailIcon size={19} />;
      default:
        return <ArrowUpRightIcon size={19} />;
    }
  };

  const handleScrollTo = (id) => {
    const target = id.startsWith('#') ? id.slice(1) : id;
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const greeting = hero?.greeting || "HELLO, I'M";
  const roleTitle = hero?.roleTitle || profile?.title || profile?.role || 'Web Developer';
  const tagline = hero?.tagline || profile?.tagline || '';
  const description = hero?.description || profile?.heroDescription || '';
  const primaryBtnText = hero?.primaryBtnText || "View My Work";
  const primaryBtnLink = hero?.primaryBtnLink || "#projects";
  const resumeBtnText = hero?.resumeBtnText || "Download Resume";
  const secondaryBtnText = hero?.secondaryBtnText || "Let's Talk";
  const secondaryBtnLink = hero?.secondaryBtnLink || "#contact";
  const talkLinkText = hero?.talkLinkText || "Let's Talk";
  const resumeFile = getResumeDownloadUrl();

  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-grid-layout">
          {/* Left Hero Content Column */}
          <div className="hero-content-column">
            {/* Small Label Pill */}
            <div className="hero-greeting-pill">
              <span className="greeting-sparkle" aria-hidden="true">
                <SparklesIcon size={14} />
              </span>
              <span>{greeting}</span>
            </div>

            {/* Main Name Heading */}
            <h1 className="hero-main-name">
              {profile.name}
            </h1>

            {/* Professional Title with Gradient Accent */}
            <h2 className="hero-professional-title">
              <span className="gradient-text">{roleTitle}</span>
            </h2>

            {/* Secondary Positioning Tagline */}
            {tagline && (
              <p className="hero-positioning-tagline">
                {tagline}
              </p>
            )}

            {/* Short Professional Description */}
            {description && (
              <p className="hero-description-text">
                {description}
              </p>
            )}

            {/* Action CTA Buttons */}
            <div className="hero-cta-group">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRightIcon}
                onClick={() => handleScrollTo(primaryBtnLink)}
              >
                {primaryBtnText}
              </Button>

              <a
                href={resumeFile}
                download={`${profile.name.replace(/\s+/g, '_')}_Resume.pdf`}
                className="btn btn-secondary btn-lg"
              >
                <DownloadIcon size={18} />
                <span style={{ marginLeft: '8px' }}>{resumeBtnText}</span>
              </a>

              <Button
                variant="ghost"
                size="lg"
                onClick={() => handleScrollTo(secondaryBtnLink)}
              >
                {secondaryBtnText}
              </Button>
            </div>

            {/* Secondary Contact Link & Social Channels */}
            <div className="hero-footer-row">
              <button
                type="button"
                className="hero-talk-link"
                onClick={() => handleScrollTo(secondaryBtnLink)}
              >
                <span>{talkLinkText}</span>
                <ArrowUpRightIcon size={15} />
              </button>

              <div className="hero-divider-dot" aria-hidden="true" />

              <div className="hero-social-channels" aria-label="Social profiles">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-social-icon-btn"
                    aria-label={item.name}
                  >
                    {getSocialIcon(item.icon)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Hero Visual Column (Developer Workspace) */}
          <div className="hero-visual-column">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
