import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { SaveIcon, CheckIcon, LayersIcon } from '../../components/Icons/Icons';

export const ManageSections = () => {
  const { sections, updateSections } = useCMS();

  const [sectionsList, setSectionsList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    if (sections && sections.length > 0) {
      const sorted = [...sections].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      setSectionsList(sorted);
    }
  }, [sections]);

  const toggleVisibility = (id) => {
    setSectionsList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isVisible: item.isVisible === false ? true : false } : item
      )
    );
  };

  const moveSection = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sectionsList.length) return;

    const newList = [...sectionsList];
    const [moved] = newList.splice(index, 1);
    newList.splice(targetIndex, 0, moved);

    const reordered = newList.map((item, idx) => ({ ...item, order: idx + 1 }));
    setSectionsList(reordered);
  };

  const handleFieldChange = (id, field, value) => {
    setSectionsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const ordered = sectionsList.map((sec, idx) => ({
        ...sec,
        order: idx + 1
      }));
      await updateSections(ordered);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save sections order & visibility:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Section Order & Visibility CMS"
      subtitle="Control the exact display order, visibility, headings, and labels of every section on the public website"
      breadcrumb={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Section Manager' }]}
    >
      <div className="admin-content-card">
        {saveSuccess && (
          <div className="admin-alert admin-alert-success" style={{ marginBottom: '1.5rem' }}>
            <CheckIcon size={18} />
            <span>Section order, visibility, and headings updated successfully! Public website updated immediately.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 className="admin-section-title" style={{ margin: 0 }}>Homepage Sections Matrix</h3>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Use Move Up / Down buttons to rearrange sections on your homepage. Toggle Show / Hide to instantly enable or disable any section.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="admin-btn admin-btn-primary"
              style={{ padding: '0.6rem 1.2rem' }}
            >
              <SaveIcon size={16} />
              <span>{isSaving ? 'Saving...' : 'Save Order & Labels'}</span>
            </button>
          </div>

          <div className="admin-sections-reorder-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sectionsList.map((sec, index) => {
              const isExpanded = expandedSection === sec.id;
              const isVisible = sec.isVisible !== false;

              return (
                <div
                  key={sec.id}
                  className="admin-glass-card"
                  style={{
                    padding: '1rem 1.25rem',
                    border: '1.5px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '16px',
                    background: isVisible ? 'rgba(255, 255, 255, 0.95)' : 'rgba(241, 245, 249, 0.65)',
                    opacity: isVisible ? 1 : 0.65,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
                      <span
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'rgba(99, 102, 241, 0.1)',
                          color: '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}
                      >
                        #{index + 1}
                      </span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {sec.name} Section
                        </h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Anchor ID: #{sec.id}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => toggleVisibility(sec.id)}
                        className={`admin-status-badge ${isVisible ? 'status-active' : 'status-draft'}`}
                        style={{
                          cursor: 'pointer',
                          border: 'none',
                          padding: '0.35rem 0.8rem',
                          borderRadius: '20px',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          background: isVisible ? 'rgba(34, 197, 94, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                          color: isVisible ? '#16a34a' : '#64748b'
                        }}
                      >
                        {isVisible ? 'Visible (Shown)' : 'Hidden (Disabled)'}
                      </button>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveSection(index, -1)}
                          className="admin-btn admin-btn-ghost"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.9rem' }}
                          title="Move section up"
                        >
                          ↑ Up
                        </button>
                        <button
                          type="button"
                          disabled={index === sectionsList.length - 1}
                          onClick={() => moveSection(index, 1)}
                          className="admin-btn admin-btn-ghost"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.9rem' }}
                          title="Move section down"
                        >
                          ↓ Down
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedSection(isExpanded ? null : sec.id)}
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                      >
                        {isExpanded ? 'Hide Headings' : 'Edit Headings & Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Inline Headings & Labels Editor */}
                  {isExpanded && (
                    <div
                      style={{
                        marginTop: '1.25rem',
                        paddingTop: '1.25rem',
                        borderTop: '1px dashed rgba(203, 213, 225, 0.8)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1rem'
                      }}
                    >
                      <div className="admin-form-group">
                        <label className="admin-label">Eyebrow Label</label>
                        <input
                          type="text"
                          value={sec.label || ''}
                          onChange={(e) => handleFieldChange(sec.id, 'label', e.target.value)}
                          placeholder="Section Label (e.g. WHAT I DO)"
                          className="admin-input"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Main Heading / Title</label>
                        <input
                          type="text"
                          value={sec.title || ''}
                          onChange={(e) => handleFieldChange(sec.id, 'title', e.target.value)}
                          placeholder="Section Title (e.g. Services)"
                          className="admin-input"
                        />
                      </div>

                      <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="admin-label">Subtitle / Description</label>
                        <textarea
                          rows={2}
                          value={sec.subtitle || ''}
                          onChange={(e) => handleFieldChange(sec.id, 'subtitle', e.target.value)}
                          placeholder="Brief section introductory description..."
                          className="admin-textarea"
                        />
                      </div>

                      {sec.id === 'services' && (
                        <div className="admin-form-group">
                          <label className="admin-label">Card Action Button Label</label>
                          <input
                            type="text"
                            value={sec.cardActionText || ''}
                            onChange={(e) => handleFieldChange(sec.id, 'cardActionText', e.target.value)}
                            placeholder="Discuss Requirements"
                            className="admin-input"
                          />
                        </div>
                      )}

                      {sec.id === 'certifications' && (
                        <div className="admin-form-group">
                          <label className="admin-label">Verify Certificate Button Label</label>
                          <input
                            type="text"
                            value={sec.verifyBtnText || ''}
                            onChange={(e) => handleFieldChange(sec.id, 'verifyBtnText', e.target.value)}
                            placeholder="View Certificate"
                            className="admin-input"
                          />
                        </div>
                      )}

                      {sec.id === 'contact' && (
                        <>
                          <div className="admin-form-group">
                            <label className="admin-label">Submit Button Label</label>
                            <input
                              type="text"
                              value={sec.submitBtnText || ''}
                              onChange={(e) => handleFieldChange(sec.id, 'submitBtnText', e.target.value)}
                              placeholder="Send Message"
                              className="admin-input"
                            />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-label">Success Message</label>
                            <input
                              type="text"
                              value={sec.successMessage || ''}
                              onChange={(e) => handleFieldChange(sec.id, 'successMessage', e.target.value)}
                              placeholder="Thank you! Message sent."
                              className="admin-input"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="admin-actions-bar" style={{ marginTop: '2rem' }}>
            <button
              type="submit"
              disabled={isSaving}
              className="admin-btn admin-btn-primary"
            >
              <SaveIcon size={16} />
              <span>{isSaving ? 'Saving Changes...' : 'Save Section Order & Headings'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ManageSections;
