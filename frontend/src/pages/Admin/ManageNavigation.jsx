import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { SaveIcon, PlusIcon, TrashIcon, CheckIcon } from '../../components/Icons/Icons';

export const ManageNavigation = () => {
  const { navigation, updateNavigation } = useCMS();

  const [headerConfig, setHeaderConfig] = useState({
    logoInitials: "DM",
    brandName: "Dhanush M",
    brandRole: "Web Developer",
    resumeBtnText: "Resume",
    talkBtnText: "Let's Talk"
  });

  const [links, setLinks] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (navigation) {
      setHeaderConfig({
        logoInitials: (navigation.logoLetters || ['D', 'M']).join(''),
        brandName: navigation.brandName || "Dhanush M",
        brandRole: navigation.brandRole || "Web Developer",
        resumeBtnText: navigation.resumeBtnText || "Resume",
        talkBtnText: navigation.talkBtnText || "Let's Talk"
      });

      setLinks(
        (navigation.links && navigation.links.length > 0 ? navigation.links : [
          { id: "home", label: "Home", target: "home", isVisible: true, order: 1 },
          { id: "about", label: "About", target: "about", isVisible: true, order: 2 },
          { id: "services", label: "Services", target: "services", isVisible: true, order: 3 },
          { id: "skills", label: "Skills", target: "skills", isVisible: true, order: 4 },
          { id: "projects", label: "Projects", target: "projects", isVisible: true, order: 5 },
          { id: "experience", label: "Experience", target: "experience", isVisible: true, order: 6 },
          { id: "education", label: "Education", target: "education", isVisible: true, order: 7 },
          { id: "certifications", label: "Certifications", target: "certifications", isVisible: true, order: 8 },
          { id: "contact", label: "Contact", target: "contact", isVisible: true, order: 9 }
        ]).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
      );
    }
  }, [navigation]);

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeaderConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (id, field, value) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const toggleVisibility = (id) => {
    setLinks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isVisible: item.isVisible === false ? true : false } : item
      )
    );
  };

  const moveLink = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const newLinks = [...links];
    const [moved] = newLinks.splice(index, 1);
    newLinks.splice(targetIndex, 0, moved);

    const reordered = newLinks.map((item, idx) => ({ ...item, order: idx + 1 }));
    setLinks(reordered);
  };

  const addLink = () => {
    const newId = `nav-${Date.now()}`;
    const newItem = {
      id: newId,
      label: 'New Link',
      target: 'custom',
      isVisible: true,
      order: links.length + 1
    };
    setLinks([...links, newItem]);
  };

  const deleteLink = (id) => {
    if (window.confirm('Are you sure you want to delete this navigation item?')) {
      setLinks(links.filter((l) => l.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const logoLetters = headerConfig.logoInitials
        ? headerConfig.logoInitials.trim().split('').slice(0, 3)
        : ['D', 'M'];

      await updateNavigation({
        logoLetters,
        brandName: headerConfig.brandName,
        brandRole: headerConfig.brandRole,
        resumeBtnText: headerConfig.resumeBtnText,
        talkBtnText: headerConfig.talkBtnText,
        links: links.map((l, idx) => ({ ...l, order: idx + 1 }))
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save navigation:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Navigation & Header CMS"
      subtitle="Manage your brand logo initials, title, CTA buttons, and top navigation bar links"
      breadcrumb={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Navigation' }]}
    >
      <div className="admin-content-card">
        {saveSuccess && (
          <div className="admin-alert admin-alert-success" style={{ marginBottom: '1.5rem' }}>
            <CheckIcon size={18} />
            <span>Navigation settings updated successfully! Public website updated immediately.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-section">
            <h3 className="admin-section-title">Brand & Header Settings</h3>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-label">Logo Initials (Monogram)</label>
                <input
                  type="text"
                  name="logoInitials"
                  maxLength={3}
                  value={headerConfig.logoInitials}
                  onChange={handleHeaderChange}
                  placeholder="DM"
                  className="admin-input"
                  style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}
                />
                <span className="admin-help-text">1-3 letters displayed inside the header badge (e.g. DM).</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Brand Name</label>
                <input
                  type="text"
                  name="brandName"
                  value={headerConfig.brandName}
                  onChange={handleHeaderChange}
                  placeholder="Dhanush M"
                  className="admin-input"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Brand Role / Subtitle</label>
                <input
                  type="text"
                  name="brandRole"
                  value={headerConfig.brandRole}
                  onChange={handleHeaderChange}
                  placeholder="Web Developer"
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-label">Header Resume Button Text</label>
                <input
                  type="text"
                  name="resumeBtnText"
                  value={headerConfig.resumeBtnText}
                  onChange={handleHeaderChange}
                  placeholder="Resume"
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Header 'Let's Talk' Button Text</label>
                <input
                  type="text"
                  name="talkBtnText"
                  value={headerConfig.talkBtnText}
                  onChange={handleHeaderChange}
                  placeholder="Let's Talk"
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          <div className="admin-form-section" style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="admin-section-title" style={{ margin: 0 }}>Navigation Menu Items (Reorder & Visibility)</h3>
              <button
                type="button"
                onClick={addLink}
                className="admin-btn admin-btn-secondary"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              >
                <PlusIcon size={14} /> Add Menu Item
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Order</th>
                    <th>Menu Label</th>
                    <th>Target Section ID</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Status</th>
                    <th style={{ width: '140px', textAlign: 'center' }}>Move</th>
                    <th style={{ width: '60px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link, index) => (
                    <tr key={link.id} style={{ opacity: link.isVisible === false ? 0.5 : 1 }}>
                      <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => handleLinkChange(link.id, 'label', e.target.value)}
                          className="admin-input"
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem' }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={link.target || link.id}
                          onChange={(e) => handleLinkChange(link.id, 'target', e.target.value)}
                          className="admin-input"
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', fontFamily: 'monospace' }}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => toggleVisibility(link.id)}
                          className={`admin-status-badge ${link.isVisible !== false ? 'status-active' : 'status-draft'}`}
                          style={{ cursor: 'pointer', border: 'none', background: link.isVisible !== false ? 'rgba(34, 197, 94, 0.15)' : 'rgba(100, 116, 139, 0.15)', color: link.isVisible !== false ? '#16a34a' : '#64748b' }}
                        >
                          {link.isVisible !== false ? 'Visible' : 'Hidden'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveLink(index, -1)}
                          className="admin-btn admin-btn-ghost"
                          style={{ padding: '0.2rem 0.5rem', marginRight: '4px' }}
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={index === links.length - 1}
                          onClick={() => moveLink(index, 1)}
                          className="admin-btn admin-btn-ghost"
                          style={{ padding: '0.2rem 0.5rem' }}
                          title="Move Down"
                        >
                          ↓
                        </button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => deleteLink(link.id)}
                          className="admin-action-btn delete"
                          title="Delete link"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-actions-bar" style={{ marginTop: '2rem' }}>
            <button
              type="submit"
              disabled={isSaving}
              className="admin-btn admin-btn-primary"
            >
              <SaveIcon size={16} />
              <span>{isSaving ? 'Saving Changes...' : 'Save Navigation Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ManageNavigation;
