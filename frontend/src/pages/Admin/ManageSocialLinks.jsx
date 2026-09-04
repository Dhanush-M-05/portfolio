import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import Toast from '../../components/Admin/Toast/Toast';
import { CloseIcon } from '../../components/Icons/Icons';

export const ManageSocialLinks = () => {
  const { socialLinks, updateSocialLinks } = useCMS();

  const [links, setLinks] = useState(socialLinks);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleLinkChange = (index, field, value) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    setLinks(updated);
  };

  const handleAddLink = () => {
    setLinks([
      ...links,
      {
        name: 'New Platform',
        url: 'https://',
        username: '@handle',
        icon: 'ExternalLinkIcon',
        isPrimary: false,
      },
    ]);
  };

  const handleRemoveLink = (index) => {
    const updated = links.filter((_, idx) => idx !== index);
    setLinks(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSocialLinks(links);
      setToastMessage('Social media channels updated successfully!');
    } catch (err) {
      setToastMessage('Failed to save links: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Social Links Management"
      subtitle="Configure external channels (GitHub, LinkedIn, Email, etc.) linked across the public portfolio and footer."
      breadcrumb={[{ label: 'Social Links' }]}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Professional Profiles</h2>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={handleAddLink}
            >
              + Add Custom Channel
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {links.map((link, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 2fr 1.5fr auto',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <div>
                  <label className="admin-form-label" style={{ fontSize: '0.75rem' }}>Platform Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={link.name}
                    onChange={(e) => handleLinkChange(idx, 'name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="admin-form-label" style={{ fontSize: '0.75rem' }}>Destination URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={link.url}
                    onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="admin-form-label" style={{ fontSize: '0.75rem' }}>Display Username / Tag</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={link.username}
                    onChange={(e) => handleLinkChange(idx, 'username', e.target.value)}
                  />
                </div>

                <div style={{ paddingTop: '18px' }}>
                  <button
                    type="button"
                    className="admin-action-icon-btn btn-delete"
                    onClick={() => handleRemoveLink(idx)}
                    title="Remove channel"
                  >
                    <CloseIcon size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving Changes...' : 'Save Social Links'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default ManageSocialLinks;
