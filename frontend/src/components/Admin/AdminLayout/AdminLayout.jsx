import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCMS } from '../../../context/CMSContext';
import {
  LayoutIcon,
  CodeIcon,
  LayersIcon,
  ServerIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  AwardIcon,
  SparklesIcon,
  MailIcon,
  DownloadIcon,
  ExternalLinkIcon,
  MenuIcon,
  CloseIcon,
  FileTextIcon
} from '../../Icons/Icons';

export const AdminLayout = ({ children, title, subtitle, breadcrumb = [] }) => {
  const { admin, logout } = useAuth();
  const { messages } = useCMS();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navGroups = [
    {
      category: "Main",
      items: [
        { path: "/admin/dashboard", label: "Dashboard", icon: LayoutIcon },
        { path: "/admin/profile", label: "Profile", icon: SparklesIcon },
        { path: "/admin/hero", label: "Hero Section", icon: SparklesIcon },
        { path: "/admin/about", label: "About Me", icon: FileTextIcon },
      ]
    },
    {
      category: "Content Management",
      items: [
        { path: "/admin/projects", label: "Projects", icon: CodeIcon },
        { path: "/admin/skills", label: "Skills", icon: LayersIcon },
        { path: "/admin/services", label: "Services", icon: ServerIcon },
        { path: "/admin/experience", label: "Experience", icon: BriefcaseIcon },
        { path: "/admin/education", label: "Education", icon: GraduationCapIcon },
        { path: "/admin/certifications", label: "Certifications", icon: AwardIcon },
        { path: "/admin/achievements", label: "Achievements", icon: SparklesIcon },
      ]
    },
    {
      category: "Structure & Layout",
      items: [
        { path: "/admin/sections", label: "Section Order & Visibility", icon: LayersIcon },
        { path: "/admin/navigation", label: "Navigation & Header", icon: LayoutIcon },
        { path: "/admin/footer", label: "Footer", icon: FileTextIcon },
      ]
    },
    {
      category: "Assets & Channels",
      items: [
        { path: "/admin/resume", label: "Resume CV", icon: DownloadIcon },
        { 
          path: "/admin/messages", 
          label: "Messages", 
          icon: MailIcon, 
          badge: unreadMessagesCount > 0 ? unreadMessagesCount : null 
        },
        { path: "/admin/social-links", label: "Social Links", icon: ExternalLinkIcon },
        { path: "/admin/settings", label: "Website Settings", icon: FileTextIcon },
      ]
    }
  ];

  return (
    <div className="admin-app-container">
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="admin-modal-backdrop"
          style={{ zIndex: 99 }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'is-mobile-open' : ''}`}>
        <div className="admin-sidebar-brand">
          <Link to="/admin/dashboard" className="admin-brand-link">
            <div className="admin-brand-badge">DM</div>
            <div>
              <div className="admin-brand-title">Dhanush M</div>
              <div className="admin-brand-subtitle">CMS ADMIN PANEL</div>
            </div>
          </Link>
          {mobileSidebarOpen && (
            <button
              type="button"
              className="admin-modal-close"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <CloseIcon size={20} />
            </button>
          )}
        </div>

        <nav className="admin-sidebar-nav">
          {navGroups.map((group) => (
            <React.Fragment key={group.category}>
              <div className="admin-nav-category-header">{group.category}</div>
              {group.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `admin-nav-item ${isActive ? 'is-active' : ''}`
                    }
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <IconComponent size={18} />
                    <span>{item.label}</span>
                    {item.badge && <span className="admin-nav-badge">{item.badge}</span>}
                  </NavLink>
                );
              })}
            </React.Fragment>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        {/* Top Header */}
        <header className="admin-top-header">
          <div className="admin-header-left">
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open navigation sidebar"
            >
              <MenuIcon size={20} />
            </button>

            <div className="admin-header-breadcrumbs">
              <Link to="/admin/dashboard">Admin</Link>
              <span>/</span>
              {breadcrumb.map((b, idx) => (
                <React.Fragment key={idx}>
                  {b.link ? <Link to={b.link}>{b.label}</Link> : <span>{b.label}</span>}
                  {idx < breadcrumb.length - 1 && <span>/</span>}
                </React.Fragment>
              ))}
              {breadcrumb.length === 0 && <span>{title || 'Dashboard'}</span>}
            </div>
          </div>

          <div className="admin-header-right">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-view-site-link"
              title="Open public portfolio website in new tab"
            >
              <span>View Public Site</span>
              <ExternalLinkIcon size={14} />
            </a>

            <div className="admin-user-profile-badge">
              <div className="admin-avatar-circle">
                {admin?.name ? admin.name.charAt(0) : 'D'}
              </div>
              <div className="admin-user-details">
                <span className="admin-user-name">{admin?.name || 'Dhanush M'}</span>
                <span className="admin-user-role">{admin?.role || 'Administrator'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-page-content">
          {(title || subtitle) && (
            <div className="admin-page-header">
              <div>
                {title && <h1 className="admin-page-title">{title}</h1>}
                {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
