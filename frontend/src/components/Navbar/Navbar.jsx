import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MenuIcon, CloseIcon, ArrowUpRightIcon, DownloadIcon } from '../Icons/Icons';
import { useCMS } from '../../context/CMSContext';
import './Navbar.css';

export const Navbar = () => {
  const { profile, navigation, sections } = useCMS();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  // Extract CMS driven navigation values
  const logoLetters = Array.isArray(navigation?.logoLetters) && navigation.logoLetters.length > 0
    ? navigation.logoLetters
    : typeof navigation?.logoLetters === 'string' && navigation.logoLetters.trim()
      ? navigation.logoLetters.trim().split('')
      : ['D', 'M'];
  const brandName = navigation?.brandName || profile?.name || 'Dhanush M';
  const brandRole = navigation?.brandRole || profile?.role || 'Web Developer';
  const resumeBtnText = navigation?.resumeBtnText || 'Resume';
  const talkBtnText = navigation?.talkBtnText || "Let's Talk";

  // Filter out hidden sections and sort by order
  const hiddenSectionIds = new Set((sections || []).filter(s => s.isVisible === false).map(s => s.id));
  const rawLinks = navigation?.links && navigation.links.length > 0 ? navigation.links : [
    { id: 'home', label: 'Home', isVisible: true, order: 1 },
    { id: 'about', label: 'About', isVisible: true, order: 2 },
    { id: 'services', label: 'Services', isVisible: true, order: 3 },
    { id: 'skills', label: 'Skills', isVisible: true, order: 4 },
    { id: 'projects', label: 'Projects', isVisible: true, order: 5 },
    { id: 'experience', label: 'Experience', isVisible: true, order: 6 },
    { id: 'education', label: 'Education', isVisible: true, order: 7 },
    { id: 'certifications', label: 'Certifications', isVisible: true, order: 8 },
    { id: 'contact', label: 'Contact', isVisible: true, order: 9 },
  ];

  const navLinks = rawLinks
    .filter(item => item.isVisible !== false && !hiddenSectionIds.has(item.id))
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  // Monitor scroll for glass navbar state and scroll spy
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (!isHomePage) return;

      const activeIds = navLinks.map(l => l.id).reverse();
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of activeIds) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage, navLinks]);

  // Handle mobile drawer close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Handle section click or navigation
  const handleNavClick = (target, openInNewTab = false) => {
    setMobileMenuOpen(false);
    if (!target) return;

    if (target.startsWith('http://') || target.startsWith('https://')) {
      if (openInNewTab) {
        window.open(target, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = target;
      }
      return;
    }

    const sectionId = target.startsWith('#')
      ? target.slice(1)
      : target.startsWith('/')
        ? null
        : target;

    if (sectionId) {
      if (isHomePage) {
        if (sectionId === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else {
        navigate(`/#${sectionId}`);
      }
    } else {
      navigate(target);
    }
  };

  return (
    <>
      <header className={`navbar-wrapper ${isScrolled ? 'is-scrolled' : ''}`}>
        <nav className="navbar-container" aria-label="Main Navigation">
          {/* Brand Monogram & Name */}
          <Link to="/" className="navbar-brand" onClick={() => handleNavClick('home')}>
            <div className="brand-logo-mark" aria-hidden="true">
              {logoLetters.map((char, index) => (
                <span key={index} className={`logo-letter-${char.toLowerCase()}`}>{char}</span>
              ))}
              <span className="logo-glow-dot" />
            </div>
            <div className="brand-text-block">
              <span className="brand-name">{brandName}</span>
              <span className="brand-subtext">{brandRole}</span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <div className="navbar-center-menu">
            <ul className="nav-links-list">
              {navLinks.map((item) => {
                const isActive = isHomePage && activeSection === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`nav-link-btn ${isActive ? 'is-active' : ''}`}
                      onClick={() => handleNavClick(item.target || (item.url || '').replace(/^#/, '') || item.id, item.openInNewTab)}
                    >
                      {item.label}
                      {isActive && <span className="active-indicator" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Action Buttons (Desktop) */}
          <div className="navbar-right-actions">
            <Link to="/resume" className="nav-resume-btn">
              <span>{resumeBtnText}</span>
            </Link>
            <button
              type="button"
              className="nav-talk-btn"
              onClick={() => handleNavClick('contact')}
            >
              <span>{talkBtnText}</span>
              <ArrowUpRightIcon size={14} />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      <div 
        className={`mobile-drawer-overlay ${mobileMenuOpen ? 'is-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <div className={`mobile-drawer-menu ${mobileMenuOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <div className="mobile-drawer-header">
          <div className="brand-logo-mark" aria-hidden="true">
            {logoLetters.map((char, index) => (
              <span key={index} className={`logo-letter-${char.toLowerCase()}`}>{char}</span>
            ))}
          </div>
          <span className="mobile-drawer-title">{brandName}</span>
          <button
            type="button"
            className="mobile-close-btn mobile-drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        <ul className="mobile-nav-list mobile-drawer-nav">
          {navLinks.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`mobile-nav-link-btn mobile-nav-link ${isHomePage && activeSection === item.id ? 'is-active' : ''}`}
                onClick={() => handleNavClick(item.target || (item.url || '').replace(/^#/, '') || item.id, item.openInNewTab)}
              >
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mobile-drawer-actions">
          <Link
            to="/resume"
            className="mobile-drawer-resume-btn mobile-action-resume"
            onClick={() => setMobileMenuOpen(false)}
          >
            <DownloadIcon size={18} />
            <span>{resumeBtnText}</span>
          </Link>
          <button
            type="button"
            className="mobile-drawer-talk-btn mobile-action-talk"
            onClick={() => handleNavClick('contact')}
          >
            <span>{talkBtnText}</span>
            <ArrowUpRightIcon size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
