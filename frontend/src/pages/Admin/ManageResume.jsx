import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import FileUploader from '../../components/Admin/FileUploader/FileUploader';
import Toast from '../../components/Admin/Toast/Toast';
import {
  DownloadIcon,
  FileTextIcon,
  CheckIcon,
  ExternalLinkIcon,
  SparklesIcon,
} from '../../components/Icons/Icons';
import { getResumeDownloadUrl, getResumeViewUrl } from '../../services/resumeService';

export const ManageResume = () => {
  const { resume, updateResume } = useCMS();
  const [toastMessage, setToastMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewKey, setPreviewKey] = useState(Date.now());

  const handleFileSelect = async (file) => {
    setIsUploading(true);
    try {
      await updateResume(file);
      setPreviewKey(Date.now());
      setToastMessage(`Resume updated to "${file.name}"! Document preview refreshed.`);
    } catch (err) {
      setToastMessage('Upload error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRefreshPreview = () => {
    setPreviewKey(Date.now());
    setToastMessage('Preview refreshed.');
  };

  const currentViewUrl = `${getResumeViewUrl()}?t=${previewKey}`;

  return (
    <AdminLayout
      title="Resume & CV Management"
      subtitle="Upload or replace your curriculum vitae. Preview changes live and view in production."
      breadcrumb={[{ label: 'Resume' }]}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Upload Area */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Upload New Version</h2>
            <span className="admin-badge badge-featured">PDF / DOC / DOCX</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px', lineHeight: '1.6' }}>
            Uploading a new resume will automatically activate it in production. The live document preview below, public downloads, and portfolio links will immediately use the updated file.
          </p>

          <FileUploader
            accept=".pdf,.doc,.docx"
            label="Click or drag new CV / Resume here"
            helpText="PDF, DOC, DOCX files accepted (Max 10MB)"
            onFileSelect={handleFileSelect}
          />

          {isUploading && (
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#4F46E5', fontSize: '0.85rem' }}>
              <div className="admin-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
              <span>Processing document and updating production database...</span>
            </div>
          )}
        </div>

        {/* Current Active File Info */}
        <div>
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Active Document</h2>
              <span className="admin-badge badge-active">Active in Production</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                  File Name
                </span>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0F172A', marginTop: '2px', wordBreak: 'break-all' }}>
                  {resume?.fileName || 'Dhanush-M-Resume.pdf'}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                  File Size
                </span>
                <span style={{ display: 'block', fontSize: '0.875rem', color: '#475569', marginTop: '2px' }}>
                  {typeof resume?.fileSize === 'number'
                    ? `${Math.round(resume.fileSize / 1024)} KB`
                    : resume?.fileSize || '184 KB'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Last Modified
                </span>
                <span style={{ display: 'block', fontSize: '0.875rem', color: '#475569', marginTop: '2px' }}>
                  {resume?.lastUpdated ||
                    (resume?.uploadedAt ? new Date(resume.uploadedAt).toISOString().split('T')[0] : 'Active')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={currentViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn-primary"
                style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
              >
                <ExternalLinkIcon size={16} />
                <span>View / Preview PDF in New Tab</span>
              </a>

              <a
                href={getResumeDownloadUrl()}
                download={resume?.fileName || 'Dhanush-M-Resume.pdf'}
                className="admin-btn admin-btn-secondary"
                style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
              >
                <DownloadIcon size={16} />
                <span>Download Active PDF</span>
              </a>

              <a
                href="/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn-secondary"
                style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
              >
                <FileTextIcon size={16} />
                <span>Open Public Resume Page</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Live Document Preview */}
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SparklesIcon size={18} />
              <span>Live CV Document Preview</span>
            </h2>
            <p className="admin-card-subtitle" style={{ margin: '4px 0 0' }}>
              Direct browser rendering of your active resume document from the backend.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleRefreshPreview}
              className="admin-btn admin-btn-secondary"
              title="Reload preview document"
            >
              <span>↻ Reload Preview</span>
            </button>

            <a
              href={currentViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-primary"
              style={{ textDecoration: 'none' }}
            >
              <ExternalLinkIcon size={15} />
              <span>Open in New Window</span>
            </a>
          </div>
        </div>

        <div
          style={{
            width: '100%',
            height: '750px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            position: 'relative',
          }}
        >
          <iframe
            key={previewKey}
            src={`${currentViewUrl}#toolbar=1`}
            title="Resume Document Preview"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageResume;
