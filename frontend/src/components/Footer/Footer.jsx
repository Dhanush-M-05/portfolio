import React from 'react';
import { Link } from 'react-router-dom';
import { GithubIcon, LinkedinIcon, MailIcon, ArrowUpRightIcon } from '../Icons/Icons';
import { useCMS } from '../../context/CMSContext';
import './Footer.css';

export const Footer = () => {
  const { profile, socialLinks, settings, footer, navigation } = useCMS();
  const currentYear = new Date().getFullYear();

  const getSocialIcon = (iconName) => {
    switch (iconName) {
      case 'GithubIcon':
        return <GithubIcon size={18} />;
      case 'LinkedinIcon':
        return <LinkedinIcon size={18} />;
      case 'MailIcon':
        return <MailIcon size={18} />;
      default:
        return <ArrowUpRightIcon size={18} />;
    }
  };

  const logoLetters = (navigation?.logoLetters && navigation.logoLetters.length > 0)
    ? navigation.logoLetters
    : ['D', 'M'];

  const brandName = footer?.brandName || profile?.name || 'Dhanush M';
  const brandRole = footer?.brandRole || profile?.role || 'Web Developer';
  const tagline = footer?.tagline || profile?.tagline || '';
  const quickLinksHeading = footer?.quickLinksHeading || 'Navigation';
  const deepLinksHeading = footer?.deepLinksHeading || 'Portfolio';
  const contactHeading = footer?.contactHeading || 'Direct Inquiries';
  const contactDesc = footer?.contactDesc || 'Available for web development projects, freelance collaborations, and full-time opportunities.';
  const copyrightText = footer?.copyrightText || settings?.footerText || 'Designed & Built with React and Pure CSS.';

  const navItems = (navigation?.links && navigation.links.length > 0)
    ? navigation.links.filter(l => l.isVisible !== false)
    : [
        { label: 'Home', target: 'home' },
        { label: 'About', target: 'about' },
        { label: 'Skills', target: 'skills' },
        { label: 'Services', target: 'services' },
        { label: 'Projects', target: 'projects' },
        { label: 'Experience', target: 'experience' },
        { label: 'Contact', target: 'contact' },
        { label: 'Resume', target: 'resume' },
      ];

  const quickLinks = navItems.slice(0, 4);
  const deepLinks = navItems.slice(4);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-glass-container">
          <div className="footer-top-grid">
            {/* Brand Block */}
            <div className="footer-brand-column">
              <div className="footer-brand-header">
                <div className="brand-logo-mark" aria-hidden="true">
                  {logoLetters.map((char, index) => (
                    <span key={index} className={`logo-letter-${char.toLowerCase()}`}>{char}</span>
                  ))}
                </div>
                <div>
                  <h3 className="footer-brand-name">{brandName}</h3>
                  <span className="footer-brand-title">{brandRole}</span>
                </div>
              </div>
              {tagline && (
                <p className="footer-brand-tagline">
                  {tagline}
                </p>
              )}
              <div className="footer-socials-row">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn"
                    aria-label={item.name}
                  >
                    {getSocialIcon(item.icon)}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="footer-nav-column">
              <h4 className="footer-column-heading">{quickLinksHeading}</h4>
              <ul className="footer-nav-list">
                {quickLinks.map((link) => (
                  <li key={link.label || link.id}>
                    <a href={`/#${link.target || link.id}`} className="footer-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deep Links Column */}
            <div className="footer-nav-column">
              <h4 className="footer-column-heading">{deepLinksHeading}</h4>
              <ul className="footer-nav-list">
                {deepLinks.map((link) => (
                  <li key={link.label || link.id}>
                    <a href={`/#${link.target || link.id}`} className="footer-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct Contact Column */}
            <div className="footer-contact-column">
              <h4 className="footer-column-heading">{contactHeading}</h4>
              <p className="footer-contact-desc">
                {contactDesc}
              </p>
              <a href={`mailto:${profile.email}`} className="footer-email-link">
                <MailIcon size={16} />
                <span>{profile.email}</span>
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom-bar">
            <p className="footer-copyright">
              © {currentYear} {brandName}. {copyrightText}
            </p>
            <Link to="/admin/login" className="footer-bottom-tags" title="Open Admin CMS Console">
              <span className="footer-status-dot" />
              <span>CMS Connected</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
