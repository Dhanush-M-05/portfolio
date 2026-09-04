import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import {
  CodeIcon,
  LayersIcon,
  AwardIcon,
  BriefcaseIcon,
  ServerIcon,
  MailIcon,
  ArrowRightIcon,
  CheckIcon,
  SparklesIcon
} from '../../components/Icons/Icons';

export const Dashboard = () => {
  const {
    projects,
    skills,
    certifications,
    experience,
    services,
    messages,
    profile,
    resume
  } = useCMS();

  const unreadMessages = messages.filter((m) => !m.isRead);

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      icon: CodeIcon,
      colorClass: "icon-indigo",
      link: "/admin/projects",
      badge: `${projects.filter(p => p.featured).length} Featured`,
    },
    {
      title: "Skills & Tech",
      value: skills.length,
      icon: LayersIcon,
      colorClass: "icon-blue",
      link: "/admin/skills",
      badge: "Across 4 Categories",
    },
    {
      title: "Certifications",
      value: certifications.length,
      icon: AwardIcon,
      colorClass: "icon-purple",
      link: "/admin/certifications",
      badge: "Verified",
    },
    {
      title: "Experience Entries",
      value: experience.length,
      icon: BriefcaseIcon,
      colorClass: "icon-emerald",
      link: "/admin/experience",
      badge: "Active Timeline",
    },
    {
      title: "Core Services",
      value: services.length,
      icon: ServerIcon,
      colorClass: "icon-amber",
      link: "/admin/services",
      badge: "Public Deliverables",
    },
    {
      title: "Contact Inquiries",
      value: messages.length,
      icon: MailIcon,
      colorClass: "icon-rose",
      link: "/admin/messages",
      badge: `${unreadMessages.length} Unread`,
    },
  ];

  return (
    <AdminLayout
      title="Content Management Dashboard"
      subtitle={`Welcome back, ${profile.name}. Manage all sections, case studies, and assets for your public portfolio.`}
    >
      {/* Overview Statistics Grid */}
      <div className="admin-stats-grid">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Link
              key={stat.title}
              to={stat.link}
              className="admin-stat-card"
              style={{ textDecoration: 'none' }}
            >
              <div className={`admin-stat-icon-wrapper ${stat.colorClass}`}>
                <IconComponent size={24} />
              </div>
              <div className="admin-stat-info">
                <span className="admin-stat-value">{stat.value}</span>
                <span className="admin-stat-label">{stat.title}</span>
                <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px', fontWeight: 600 }}>
                  {stat.badge}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Grid: Quick Actions & Recent Messages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Quick Action Shortcuts */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Quick Actions</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', fontWeight: 600 }}>FAST CRUD</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            <Link to="/admin/projects" className="admin-btn admin-btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <CodeIcon size={16} />
              <span>Projects</span>
            </Link>
            <Link to="/admin/hero" className="admin-btn admin-btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <SparklesIcon size={16} />
              <span>Hero Section</span>
            </Link>
            <Link to="/admin/sections" className="admin-btn admin-btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <LayersIcon size={16} />
              <span>Section Order</span>
            </Link>
            <Link to="/admin/navigation" className="admin-btn admin-btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <span>Header / Nav</span>
            </Link>
            <Link to="/admin/footer" className="admin-btn admin-btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <span>Footer</span>
            </Link>
            <Link to="/admin/skills" className="admin-btn admin-btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <LayersIcon size={16} />
              <span>Skills</span>
            </Link>
            <Link to="/admin/resume" className="admin-btn admin-btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <span>Upload Resume</span>
            </Link>
            <Link to="/admin/profile" className="admin-btn admin-btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <span>Edit Profile</span>
            </Link>
            <Link to="/admin/settings" className="admin-btn admin-btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <span>Site Settings</span>
            </Link>
          </div>

          <div style={{ marginTop: '20px', padding: '14px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
              <strong style={{ fontSize: '0.8125rem', color: '#0F172A' }}>Active Resume Asset</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
              File: <strong>{resume?.fileName || 'Dhanush-M-Resume.pdf'}</strong> ({resume?.fileSize || '184 KB'}) — Last updated {resume?.lastUpdated || 'Active'}
            </p>
          </div>
        </div>

        {/* Recent Inquiries Inbox */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="admin-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 className="admin-card-title">Recent Inquiries</h2>
              {unreadMessages.length > 0 && (
                <span className="admin-badge badge-featured">
                  {unreadMessages.length} new
                </span>
              )}
            </div>
            <Link to="/admin/messages" style={{ fontSize: '0.8rem', color: '#4F46E5', textDecoration: 'none', fontWeight: 600 }}>
              View All →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: msg.isRead ? '#FFFFFF' : '#F0FDF4',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>{msg.name}</strong>
                    {!msg.isRead && (
                      <span style={{ fontSize: '0.68rem', backgroundColor: '#10B981', color: '#FFF', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        UNREAD
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#4F46E5', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                    {msg.subject}
                  </span>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                    {msg.message}
                  </p>
                </div>

                <span style={{ fontSize: '0.7rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                  {new Date(msg.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
