import React, { createContext, useContext, useState, useEffect } from 'react';

// Import service layers (Authoritative Backend APIs)
import * as profileService from '../services/profileService';
import * as projectService from '../services/projectService';
import * as skillService from '../services/skillService';
import * as serviceService from '../services/serviceService';
import * as experienceService from '../services/experienceService';
import * as achievementService from '../services/achievementService';
import * as socialService from '../services/socialService';
import * as contactService from '../services/contactService';
import * as resumeService from '../services/resumeService';
import * as settingsService from '../services/settingsService';
import * as aboutService from '../services/aboutService';
import * as sectionService from '../services/sectionService';
import * as navigationService from '../services/navigationService';
import * as heroService from '../services/heroService';
import * as footerService from '../services/footerService';

const CMSContext = createContext(null);

// Purge legacy cms_* keys from browser localStorage
const purgeLegacyLocalStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('cms_') || key === 'cms_about')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    }
  } catch (err) {
    console.warn('Failed to purge legacy CMS localStorage keys:', err);
  }
};

// Immediate cleanup on script evaluation
purgeLegacyLocalStorage();

export const CMSProvider = ({ children }) => {
  // Initial default structures (without hardcoded mock/dummy entries)
  const defaultProfile = {
    name: '',
    role: '',
    title: '',
    degree: '',
    department: '',
    college: '',
    email: '',
    phone: '',
    domain: '',
    location: '',
    tagline: '',
    heroDescription: '',
    aboutHeading: '',
    aboutSubheading: '',
    avatarUrl: '/dhanush-profile.jpg',
    image: '/dhanush-profile.jpg',
    resumePath: '/resume.pdf',
    resumeViewRoute: '/resume',
    stats: [],
  };

  const defaultSections = [
    { id: "hero", name: "Hero", isVisible: true, order: 1, greeting: "HELLO, I'M" },
    { id: "about", name: "About", isVisible: true, order: 2, label: "About Me", title: "Professional Summary", subtitle: "A dedicated developer focused on responsive web development, robust backend APIs, and clean software practices.", ctaText: "View Projects", ctaLink: "#projects" },
    { id: "services", name: "Services", isVisible: true, order: 3, label: "Services", title: "What I Do", subtitle: "Specialized web development capabilities focused on scalable code, performant user interfaces, and seamless API integrations.", cardActionText: "Discuss Requirements" },
    { id: "skills", name: "Skills", isVisible: true, order: 4, label: "Skills & Stack", title: "Technical Skills", subtitle: "Core competencies across programming languages, modern frontend libraries, backend architectures, databases, and version control tooling." },
    { id: "projects", name: "Projects", isVisible: true, order: 5, label: "Featured Work", title: "Projects", subtitle: "Real-world web platforms, database applications, and full-stack solutions built with modern technology stacks.", liveDemoBtnText: "Live Demo", githubBtnText: "GitHub", detailsBtnText: "View Project" },
    { id: "experience", name: "Experience", isVisible: true, order: 6, label: "Career Journey", title: "Work Experience", subtitle: "Professional internships and development roles focused on production web systems." },
    { id: "education", name: "Education", isVisible: true, order: 7, label: "Academic Background", title: "Education", subtitle: "Formal university degree and foundational coursework in computer science and engineering." },
    { id: "certifications", name: "Certifications", isVisible: true, order: 8, label: "Credentials", title: "Certificates & Training", subtitle: "Industry-recognized engineering certifications and technical continuous learning accomplishments.", verifyBtnText: "Verify Certificate" },
    { id: "achievements", name: "Achievements", isVisible: true, order: 9, label: "Recognition", title: "Honors & Achievements", subtitle: "Hackathons, technical competitions, and academic milestones." },
    { id: "resume", name: "Resume", isVisible: true, order: 10, label: "Curriculum Vitae", title: "Professional Resume", subtitle: "Preview or download the latest ATS-compliant developer resume.", downloadBtnText: "Download Resume", viewBtnText: "View Full Resume" },
    { id: "contact", name: "Contact", isVisible: true, order: 11, label: "Get In Touch", title: "Let's Connect", subtitle: "Have a project in mind, an internship opportunity, or want to discuss modern web development? Drop a message below.", formHeading: "Send a Direct Message", submitBtnText: "Send Message", successMessage: "Thank you! Your message has been sent successfully. I will get back to you shortly.", errorMessage: "Something went wrong. Please try again or email directly." }
  ];

  const defaultNavigation = {
    logoLetters: ["D", "M"],
    brandName: "Dhanush M",
    brandRole: "Web Developer",
    resumeBtnText: "Resume",
    talkBtnText: "Let's Talk",
    links: [
      { id: "home", label: "Home", target: "home", isVisible: true, order: 1 },
      { id: "about", label: "About", target: "about", isVisible: true, order: 2 },
      { id: "services", label: "Services", target: "services", isVisible: true, order: 3 },
      { id: "skills", label: "Skills", target: "skills", isVisible: true, order: 4 },
      { id: "projects", label: "Projects", target: "projects", isVisible: true, order: 5 },
      { id: "experience", label: "Experience", target: "experience", isVisible: true, order: 6 },
      { id: "education", label: "Education", target: "education", isVisible: true, order: 7 },
      { id: "certifications", label: "Certifications", target: "certifications", isVisible: true, order: 8 },
      { id: "contact", label: "Contact", target: "contact", isVisible: true, order: 9 }
    ]
  };

  const defaultHero = {
    greeting: "HELLO, I'M",
    primaryBtnText: "View My Work",
    primaryBtnLink: "#projects",
    resumeBtnText: "Download Resume",
    secondaryBtnText: "Let's Talk",
    secondaryBtnLink: "#contact",
    talkLinkText: "Let's Talk"
  };

  const defaultFooter = {
    tagline: "Motivated Computer Science graduate seeking opportunities in Web Development / Full Stack Development.",
    quickLinksHeading: "Navigation",
    deepLinksHeading: "Portfolio",
    contactHeading: "Direct Inquiries",
    contactDesc: "Available for web development projects, freelance collaborations, and full-time opportunities.",
    copyrightText: "Designed & Built with React and Pure CSS."
  };

  // Pure React states - Strictly driven by backend API
  const [profile, setProfile] = useState(defaultProfile);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillCategories, setSkillCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [resume, setResume] = useState(null);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState({});
  const [sections, setSections] = useState(defaultSections);
  const [navigation, setNavigation] = useState(defaultNavigation);
  const [hero, setHero] = useState(defaultHero);
  const [footer, setFooter] = useState(defaultFooter);
  const [about, setAbout] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Synchronize browser tab title dynamically with siteTitle setting
  useEffect(() => {
    if (settings?.siteTitle) {
      document.title = settings.siteTitle;
    }
  }, [settings?.siteTitle]);

  // Initial load strictly from Backend API
  useEffect(() => {
    purgeLegacyLocalStorage();

    const loadAll = async () => {
      try {
        const [
          profData,
          projData,
          skData,
          srvData,
          expData,
          eduData,
          certData,
          achData,
          socData,
          resData,
          msgData,
          setData,
          aboutData,
          secData,
          navData,
          heroData,
          footData,
        ] = await Promise.all([
          profileService.getProfile(),
          projectService.getProjects(),
          skillService.getSkills(),
          serviceService.getServices(),
          experienceService.getExperience(),
          experienceService.getEducation(),
          experienceService.getCertifications(),
          achievementService.getAchievements(),
          socialService.getSocialLinks(),
          resumeService.getResumeInfo(),
          contactService.getMessages(),
          settingsService.getSettings(),
          aboutService.getAbout(),
          sectionService.getSections(),
          navigationService.getNavigation(),
          heroService.getHero(),
          footerService.getFooter(),
        ]);

        if (profData) {
          const avatar = profData.image || profData.avatarUrl || profData.profileImageUrl || '/dhanush-profile.jpg';
          setProfile((prev) => ({
            ...prev,
            ...profData,
            degree: profData.degree || prev.degree || 'B.E.',
            department: profData.department || prev.department || 'Computer Science and Engineering',
            college: profData.college || prev.college || 'J.N.N Institute',
            avatarUrl: avatar,
            image: avatar,
          }));
        }

        if (Array.isArray(projData)) {
          setProjects(projData);
        } else if (projData?.projects && Array.isArray(projData.projects)) {
          setProjects(projData.projects);
        }

        if (skData) {
          if (Array.isArray(skData)) {
            setSkills(skData);
          } else if (skData.skills && Array.isArray(skData.skills)) {
            setSkills(skData.skills);
            if (skData.categories) setSkillCategories(skData.categories);
          }
        }

        if (Array.isArray(srvData)) setServices(srvData);
        if (Array.isArray(expData)) setExperience(expData);
        if (Array.isArray(eduData)) setEducation(eduData);
        if (Array.isArray(certData)) setCertifications(certData);
        if (Array.isArray(achData)) setAchievements(achData);
        if (Array.isArray(socData)) setSocialLinks(socData);
        if (resData) setResume(resData);
        if (Array.isArray(msgData)) setMessages(msgData);

        if (setData) {
          setSettings(setData);
          if (setData.siteTitle) {
            document.title = setData.siteTitle;
          }
        }

        if (aboutData) setAbout(aboutData);
        if (Array.isArray(secData)) setSections(secData);

        if (navData) {
          const links = Array.isArray(navData) ? navData : (navData.links || []);
          const mergedNav = {
            ...defaultNavigation,
            ...(typeof navData === 'object' && !Array.isArray(navData) ? navData : {}),
            brandName: navData.brandName || setData?.brandName || defaultNavigation.brandName,
            brandRole: navData.brandRole || setData?.brandRole || defaultNavigation.brandRole,
            logoLetters: navData.logoLetters || (setData?.logoLetters ? setData.logoLetters.split('') : defaultNavigation.logoLetters),
            resumeBtnText: navData.resumeBtnText || setData?.resumeBtnText || defaultNavigation.resumeBtnText,
            talkBtnText: navData.talkBtnText || setData?.talkBtnText || defaultNavigation.talkBtnText,
            links: links.map((l, idx) => ({
              id: l.id,
              label: l.label,
              target: (l.url || l.target || '').replace(/^#/, ''),
              url: l.url || `#${l.target}`,
              order: Number(l.order) || idx + 1,
              isVisible: l.isActive !== false && l.isVisible !== false,
              isActive: l.isActive !== false && l.isVisible !== false,
              openInNewTab: Boolean(l.openInNewTab),
            })).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)),
          };
          setNavigation(mergedNav);
        }

        if (heroData) setHero(heroData);
        if (footData) setFooter(footData);
      } catch (err) {
        console.warn('CMS Context initialized from backend with notice:', err.message);
      } finally {
        setIsLoaded(true);
      }
    };

    loadAll();
  }, []);

  // Profile actions
  const updateProfileData = async (data) => {
    const avatar = data.image || data.avatarUrl || profile.avatarUrl || '/dhanush-profile.jpg';
    const merged = {
      ...profile,
      ...data,
      avatarUrl: avatar,
      image: avatar,
    };
    const updated = await profileService.updateProfile(merged);
    setProfile(merged);
    return updated;
  };

  // Projects actions
  const addProject = async (newProj) => {
    const created = await projectService.createProject(newProj);
    setProjects((prev) => [created, ...prev]);
    return created;
  };

  const updateProject = async (id, updatedProj) => {
    const updated = await projectService.updateProject(id, updatedProj);
    setProjects((prev) => prev.map((p) => (p.id === id || p.slug === id ? { ...p, ...updated } : p)));
    return updated;
  };

  const deleteProject = async (id) => {
    await projectService.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id && p.slug !== id));
  };

  // Skills actions
  const addSkill = async (newSkill) => {
    const created = await skillService.createSkill(newSkill);
    setSkills((prev) => [...prev, created]);
    return created;
  };

  const updateSkill = async (name, updatedSkill) => {
    const updated = await skillService.updateSkill(name, updatedSkill);
    setSkills((prev) => prev.map((s) => (s.name === name ? { ...s, ...updated } : s)));
    return updated;
  };

  const deleteSkill = async (name) => {
    await skillService.deleteSkill(name);
    setSkills((prev) => prev.filter((s) => s.name !== name));
  };

  // Services actions
  const addService = async (newSrv) => {
    const created = await serviceService.createService(newSrv);
    setServices((prev) => [...prev, created]);
    return created;
  };

  const updateService = async (id, updatedSrv) => {
    const updated = await serviceService.updateService(id, updatedSrv);
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    return updated;
  };

  const deleteService = async (id) => {
    await serviceService.deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Experience actions
  const addExperience = async (newExp) => {
    const created = await experienceService.createExperience(newExp);
    setExperience((prev) => [created, ...prev]);
    return created;
  };

  const updateExperience = async (id, updatedExp) => {
    const updated = await experienceService.updateExperience(id, updatedExp);
    setExperience((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    return updated;
  };

  const deleteExperience = async (id) => {
    await experienceService.deleteExperience(id);
    setExperience((prev) => prev.filter((e) => e.id !== id));
    return true;
  };

  // Education actions
  const addEducation = async (newEdu) => {
    const created = await experienceService.createEducation(newEdu);
    setEducation((prev) => [created, ...prev]);
    return created;
  };

  const updateEducation = async (id, updatedEdu) => {
    const updated = await experienceService.updateEducation(id, updatedEdu);
    setEducation((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    return updated;
  };

  const deleteEducation = async (id) => {
    await experienceService.deleteEducation(id);
    setEducation((prev) => prev.filter((e) => e.id !== id));
    return true;
  };

  // Certifications actions
  const addCertification = async (newCert) => {
    const created = await experienceService.createCertification(newCert);
    setCertifications((prev) => [created, ...prev]);
    return created;
  };

  const updateCertification = async (id, updatedCert) => {
    const updated = await experienceService.updateCertifications(id, updatedCert);
    setCertifications((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    return updated;
  };

  const deleteCertification = async (id) => {
    await experienceService.deleteCertification(id);
    setCertifications((prev) => prev.filter((c) => c.id !== id));
    return true;
  };

  // Achievements actions
  const addAchievement = async (newAch) => {
    const created = await achievementService.createAchievement(newAch);
    setAchievements((prev) => [created, ...prev]);
    return created;
  };

  const updateAchievement = async (id, updatedAch) => {
    const updated = await achievementService.updateAchievement(id, updatedAch);
    setAchievements((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
    return updated;
  };

  const deleteAchievement = async (id) => {
    await achievementService.deleteAchievement(id);
    setAchievements((prev) => prev.filter((a) => a.id !== id));
    return true;
  };

  // Social Links actions
  const updateSocialLinksList = async (newList) => {
    const updated = await socialService.updateSocialLinks(newList);
    setSocialLinks(updated || newList);
    return updated || newList;
  };

  // Resume actions
  const updateResumeData = async (resumeData) => {
    const updated = await resumeService.updateResume(resumeData);
    const resumeObj = updated || resumeData;
    setResume(resumeObj);
    return resumeObj;
  };

  // Contact Messages actions
  const fetchMessages = async () => {
    try {
      const msgs = await contactService.getMessages();
      setMessages(Array.isArray(msgs) ? msgs : []);
    } catch (err) {
      console.error("Failed to fetch contact messages", err);
    }
  };

  const markMessageRead = async (id) => {
    await (contactService.markMessageAsRead || contactService.markMessageRead)(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
  };

  const deleteMessage = async (id) => {
    await contactService.deleteMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  // Settings actions
  const updateSettingsData = async (newSettings) => {
    const res = await settingsService.updateSettings(newSettings);
    const updated = res?.data || res || newSettings;
    const merged = { ...settings, ...newSettings, ...updated };
    setSettings(merged);
    if (merged.siteTitle) {
      document.title = merged.siteTitle;
    }
    setNavigation((prev) => ({
      ...prev,
      ...(merged.brandName && { brandName: merged.brandName }),
      ...(merged.brandRole && { brandRole: merged.brandRole }),
      ...(merged.logoLetters && {
        logoLetters: Array.isArray(merged.logoLetters)
          ? merged.logoLetters
          : merged.logoLetters.split(''),
      }),
      ...(merged.resumeBtnText && { resumeBtnText: merged.resumeBtnText }),
      ...(merged.talkBtnText && { talkBtnText: merged.talkBtnText }),
    }));
    return merged;
  };

  // About actions (Single Source of Truth: Backend Database -> React State, No localStorage)
  const updateAboutData = async (data) => {
    const updated = await aboutService.updateAbout(data);
    const freshRecord = updated || data;
    setAbout(freshRecord);
    if (freshRecord.image_url) {
      setProfile((prev) => ({ ...prev, avatarUrl: freshRecord.image_url }));
    }
    return freshRecord;
  };

  const refreshAbout = async () => {
    try {
      const fresh = await aboutService.getAbout();
      setAbout(fresh);
      return fresh;
    } catch (err) {
      console.warn('Failed to refresh about data:', err);
    }
  };

  // Sections actions
  const updateSectionsData = async (newSections) => {
    const res = await sectionService.updateSections(newSections);
    setSections(newSections);
    return res;
  };

  // Navigation actions
  const updateNavigationData = async (newNav) => {
    const res = await navigationService.updateNavigation(newNav);
    const updated = res?.data || res || newNav;
    const links = Array.isArray(updated.links)
      ? updated.links
      : Array.isArray(updated)
        ? updated
        : newNav.links || [];

    const mergedNav = {
      ...defaultNavigation,
      ...newNav,
      ...(typeof updated === 'object' && !Array.isArray(updated) ? updated : {}),
      links: links.map((l, idx) => ({
        id: l.id,
        label: l.label,
        target: (l.url || l.target || '').replace(/^#/, ''),
        url: l.url || `#${l.target}`,
        order: Number(l.order) || idx + 1,
        isVisible: l.isActive !== false && l.isVisible !== false,
        isActive: l.isActive !== false && l.isVisible !== false,
        openInNewTab: Boolean(l.openInNewTab),
      })).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)),
    };

    setNavigation(mergedNav);

    if (newNav.siteTitle) {
      setSettings((prev) => ({ ...prev, siteTitle: newNav.siteTitle }));
      document.title = newNav.siteTitle;
    }

    return mergedNav;
  };

  // Hero actions
  const updateHeroData = async (newHero) => {
    const res = await heroService.updateHero(newHero);
    setHero(newHero);
    return res;
  };

  // Footer actions
  const updateFooterData = async (newFooter) => {
    const res = await footerService.updateFooter(newFooter);
    setFooter(newFooter);
    return res;
  };

  const getSection = (id) => {
    return (sections || []).find((s) => s.id === id) || {};
  };

  const value = {
    isLoaded,
    profile,
    updateProfile: updateProfileData,
    about,
    updateAbout: updateAboutData,
    refreshAbout,
    projects,
    addProject,
    updateProject,
    deleteProject,
    skills,
    skillCategories,
    addSkill,
    updateSkill,
    deleteSkill,
    services,
    addService,
    updateService,
    deleteService,
    experience,
    addExperience,
    updateExperience,
    deleteExperience,
    education,
    addEducation,
    updateEducation,
    deleteEducation,
    certifications,
    addCertification,
    updateCertification,
    deleteCertification,
    achievements,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    socialLinks,
    updateSocialLinks: updateSocialLinksList,
    resume,
    updateResume: updateResumeData,
    messages,
    fetchMessages,
    markMessageRead,
    deleteMessage,
    settings,
    updateSettings: updateSettingsData,
    sections,
    updateSections: updateSectionsData,
    getSection,
    navigation,
    updateNavigation: updateNavigationData,
    hero,
    updateHero: updateHeroData,
    footer,
    updateFooter: updateFooterData,
  };

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};

export default CMSContext;
