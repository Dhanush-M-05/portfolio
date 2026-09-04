import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import DataTable from '../../components/Admin/DataTable/DataTable';
import Modal from '../../components/Admin/Modal/Modal';
import ConfirmDialog from '../../components/Admin/ConfirmDialog/ConfirmDialog';
import FileUploader from '../../components/Admin/FileUploader/FileUploader';
import Toast from '../../components/Admin/Toast/Toast';
import { FileTextIcon, ExternalLinkIcon } from '../../components/Icons/Icons';
import { getCertificateViewUrl } from '../../services/experienceService';

export const ManageCertifications = () => {
  const { certifications, addCertification, updateCertification, deleteCertification } = useCMS();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [deletingCert, setDeletingCert] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const initialFormState = {
    name: '',
    issuer: '',
    issueDate: '2024',
    credentialId: '',
    credentialUrl: '',
    skillsCovered: 'React.js, Modern JavaScript, Web Architecture',
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setEditingCert(null);
    setFormData(initialFormState);
    setSelectedFile(null);
    setFileError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert) => {
    setEditingCert(cert);
    setFormData({
      name: cert.title || cert.name || '',
      issuer: cert.issuer || '',
      issueDate: cert.issueDate || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      skillsCovered: Array.isArray(cert.skillsCovered) ? cert.skillsCovered.join(', ') : cert.skillsCovered || '',
    });
    setSelectedFile(null);
    setFileError('');
    setIsModalOpen(true);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setFileError('');
  };

  const handleOpenDelete = (cert) => {
    setDeletingCert(cert);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCert) return;
    setIsSaving(true);
    try {
      await deleteCertification(deletingCert.id);
      setToastMessage(`Certificate "${deletingCert.title || deletingCert.name}" removed from portfolio.`);
      setIsConfirmOpen(false);
    } catch (err) {
      setToastMessage('Error deleting certification: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFileError('');

    // Rule: Creating a certificate MUST have a file uploaded
    if (!editingCert && !selectedFile) {
      setFileError('Certificate file is required');
      setToastMessage('Certificate file is required');
      return;
    }

    // Rule: If editing and no existing fileUrl, a file must be provided
    if (editingCert && !editingCert.fileUrl && !selectedFile) {
      setFileError('Certificate file is required');
      setToastMessage('Certificate file is required');
      return;
    }

    setIsSaving(true);

    const payload = new FormData();
    payload.append('title', formData.name.trim());
    payload.append('name', formData.name.trim());
    payload.append('issuer', formData.issuer.trim());
    if (formData.issueDate) payload.append('issueDate', formData.issueDate.trim());
    if (formData.credentialId) payload.append('credentialId', formData.credentialId.trim());
    if (formData.credentialUrl) payload.append('credentialUrl', formData.credentialUrl.trim());
    if (formData.skillsCovered) payload.append('skillsCovered', formData.skillsCovered);

    if (selectedFile) {
      payload.append('certificate', selectedFile);
    }

    try {
      if (editingCert) {
        await updateCertification(editingCert.id, payload);
        setToastMessage(`Certificate "${formData.name}" updated successfully.`);
      } else {
        await addCertification(payload);
        setToastMessage(`Certificate "${formData.name}" added to portfolio with verified document!`);
      }
      setIsModalOpen(false);
      setSelectedFile(null);
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message;
      if (typeof serverMsg === 'string' && serverMsg.toLowerCase().includes('certificate file is required')) {
        setFileError('Certificate file is required');
      }
      setToastMessage('Error: ' + serverMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      header: 'Certificate & Issuer',
      key: 'name',
      render: (val, row) => (
        <div>
          <strong style={{ color: '#0F172A' }}>{row.title || val}</strong>
          <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748B' }}>
            {row.issuer}
          </span>
        </div>
      ),
    },
    {
      header: 'Certificate Document',
      key: 'fileUrl',
      render: (val, row) => {
        const viewUrl = row.id ? getCertificateViewUrl(row.id) : (row.fileUrl || val);
        const hasFile = Boolean(row.fileUrl || row.fileName);
        return (
          <div>
            {hasFile ? (
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#4F46E5',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  background: '#EEF2FF',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #E0E7FF',
                }}
                title="Open uploaded certificate document in new tab"
              >
                <FileTextIcon size={14} />
                <span>View Certificate</span>
                <ExternalLinkIcon size={12} />
              </a>
            ) : (
              <span style={{ color: '#EF4444', fontSize: '0.78rem', fontWeight: 600, background: '#FEF2F2', padding: '3px 8px', borderRadius: '4px' }}>
                Missing File
              </span>
            )}
            {row.fileName && (
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '3px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {row.fileName}
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: 'Issue Date',
      key: 'issueDate',
      render: (val) => <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{val || 'N/A'}</span>,
    },
    {
      header: 'Credential ID',
      key: 'credentialId',
      render: (val) => (
        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#4F46E5', background: '#EEF2FF', padding: '2px 6px', borderRadius: '4px' }}>
          {val || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Skills Covered',
      key: 'skillsCovered',
      render: (val) => (
        <span style={{ fontSize: '0.8rem', color: '#475569' }}>
          {Array.isArray(val) ? val.join(', ') : val || '—'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Certifications Management"
      subtitle="Manage your certified credentials. Certificate file upload is required for every credential."
      breadcrumb={[{ label: 'Certifications' }]}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          type="button"
          id="btn-add-cert"
          className="admin-btn admin-btn-primary"
          onClick={handleOpenAdd}
        >
          + Add New Certificate
        </button>
      </div>

      <DataTable
        columns={columns}
        data={certifications}
        searchKey="name"
        searchPlaceholder="Search certificates by title or issuer..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCert ? 'Edit Certificate' : 'Add New Certificate'}
      >
        <form onSubmit={handleSubmit} id="cert-form">
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="cert-name">Certificate Name *</label>
            <input
              type="text"
              id="cert-name"
              className="admin-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. AWS Certified Cloud Practitioner"
              required
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="cert-issuer">Issuing Organization *</label>
              <input
                type="text"
                id="cert-issuer"
                className="admin-input"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                placeholder="e.g. Coursera / Meta"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="cert-date">Issue Year / Date</label>
              <input
                type="text"
                id="cert-date"
                className="admin-input"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                placeholder="e.g. 2024"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="cert-id">Credential ID</label>
              <input
                type="text"
                id="cert-id"
                className="admin-input"
                value={formData.credentialId}
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                placeholder="e.g. UC-889922"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="cert-url">Verification URL</label>
              <input
                type="url"
                id="cert-url"
                className="admin-input"
                value={formData.credentialUrl}
                onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                placeholder="https://coursera.org/verify/..."
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="cert-skills">Skills Covered (Comma separated)</label>
            <input
              type="text"
              id="cert-skills"
              className="admin-input"
              value={formData.skillsCovered}
              onChange={(e) => setFormData({ ...formData, skillsCovered: e.target.value })}
              placeholder="React.js, JavaScript, REST API"
            />
          </div>

          {/* Certificate File Upload - Compulsory */}
          <div className="admin-form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="admin-form-label" style={{ marginBottom: 0 }}>
                Certificate File {!editingCert ? <span style={{ color: '#EF4444', fontWeight: 'bold' }}>* (Required)</span> : <span style={{ color: '#64748B' }}>(Required to keep active file)</span>}
              </label>
              {editingCert && editingCert.fileUrl && (
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                  ✓ Active Document On File
                </span>
              )}
            </div>

            {editingCert && editingCert.fileUrl && (
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <FileTextIcon size={16} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#334155', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {editingCert.fileName || 'Current Certificate File'}
                  </span>
                  {editingCert.fileSize && (
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      ({(editingCert.fileSize / 1024).toFixed(1)} KB)
                    </span>
                  )}
                </div>
                <a
                  href={getCertificateViewUrl(editingCert.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn admin-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  Preview <ExternalLinkIcon size={12} />
                </a>
              </div>
            )}

            <FileUploader
              key={editingCert ? `edit-${editingCert.id}` : 'add-new-cert'}
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              label={editingCert ? "Choose New File to Replace Current Certificate" : "Upload Certificate File (PDF, JPG, PNG) *"}
              helpText="PDF, JPG, JPEG, PNG (Max 15MB) — Required to create certificate"
              onFileSelect={handleFileSelect}
            />

            {fileError && (
              <div
                id="cert-file-error"
                style={{
                  color: '#B91C1C',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  marginTop: '8px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>⚠️</span>
                <span>{fileError}</span>
              </div>
            )}
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-cert"
              className="admin-btn admin-btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : editingCert ? 'Update Certificate' : 'Save & Publish Certificate'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Certificate"
        message={`Are you sure you want to remove "${deletingCert?.title || deletingCert?.name}"? It will no longer appear on your public website.`}
        confirmLabel="Delete"
        isLoading={isSaving}
      />
    </AdminLayout>
  );
};

export default ManageCertifications;
