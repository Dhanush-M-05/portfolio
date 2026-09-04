import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  CloseIcon,
  DownloadIcon,
  ExternalLinkIcon,
  AwardIcon,
  FileTextIcon,
  SparklesIcon,
  ArrowUpRightIcon,
} from '../Icons/Icons';
import './DocumentPreviewModal.css';

/**
 * Checks if a given file URL or name points to a supported image format.
 */
const isImageFile = (url = '', fileName = '') => {
  const target = `${url} ${fileName}`.toLowerCase();
  return (
    target.includes('.jpg') ||
    target.includes('.jpeg') ||
    target.includes('.png') ||
    target.includes('.webp') ||
    target.includes('.gif') ||
    target.includes('.svg') ||
    target.startsWith('data:image')
  );
};

export const DocumentPreviewModal = ({
  isOpen,
  onClose,
  previewData = {},
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const cardRef = useRef(null);

  const {
    title = 'Document Preview',
    subtitle = '',
    badge = 'Verified Document',
    fileUrl = '',
    downloadUrl = '',
    fileName = 'document.pdf',
    iconType = 'document',
    actionText = '',
    actionLink = '',
    allowDownload = iconType === 'resume',
  } = previewData;

  const isImage = isImageFile(fileUrl, fileName);

  // Reset loading state when fileUrl changes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [isOpen, fileUrl]);

  // Handle ESC key to close and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !fileUrl) return null;

  return (
    <div
      className="doc-preview-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="doc-preview-card"
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="doc-preview-header">
          <div className="doc-preview-header-left">
            <div className={`doc-icon-badge icon-${iconType}`} aria-hidden="true">
              {iconType === 'certificate' ? (
                <AwardIcon size={20} />
              ) : (
                <FileTextIcon size={20} />
              )}
            </div>
            <div className="doc-meta-info">
              <div className="doc-tag-row">
                <span className="doc-badge-pill">
                  <span className="doc-badge-dot" />
                  <span>{badge}</span>
                </span>
                {subtitle && <span className="doc-subtitle-text">• {subtitle}</span>}
              </div>
              <h3 className="doc-preview-title" title={title}>
                {title}
              </h3>
            </div>
          </div>

          <div className="doc-preview-header-actions">
            {/* Direct Download Button (Resume only) */}
            {allowDownload && (downloadUrl || fileUrl) && (
              <a
                href={downloadUrl || fileUrl}
                download={fileName}
                className="doc-action-btn download-btn"
                title={`Download ${fileName}`}
              >
                <DownloadIcon size={16} />
                <span className="doc-btn-label">Download PDF</span>
              </a>
            )}

            {/* Close Button */}
            <button
              type="button"
              className="doc-preview-close-btn"
              onClick={onClose}
              aria-label="Close document preview"
              title="Close (Esc)"
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer Viewport */}
        <div className="doc-preview-body">
          {isLoading && (
            <div className="doc-preview-loader" aria-live="polite">
              <div className="doc-spinner" />
              <span>Loading document preview...</span>
            </div>
          )}

          {hasError ? (
            <div className="doc-preview-fallback">
              <div className="doc-fallback-icon">
                {iconType === 'certificate' ? <AwardIcon size={44} /> : <FileTextIcon size={44} />}
              </div>
              <h4>Unable to preview document inline</h4>
              <p>
                {allowDownload
                  ? 'Your browser blocked the inline preview or this file requires download.'
                  : 'Your browser was unable to render this certificate document inline.'}
              </p>
              {allowDownload && (
                <div className="doc-fallback-actions">
                  <a
                    href={downloadUrl || fileUrl}
                    download={fileName}
                    className="doc-fallback-primary-btn"
                  >
                    <DownloadIcon size={16} />
                    <span>Download Document ({fileName})</span>
                  </a>
                </div>
              )}
            </div>
          ) : isImage ? (
            <div className="doc-preview-image-container">
              <img
                src={fileUrl}
                alt={title}
                className="doc-preview-image"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
              />
            </div>
          ) : (
            <div className="doc-preview-iframe-container">
              <iframe
                src={`${fileUrl}#toolbar=1&navpanes=0`}
                title={title}
                className="doc-preview-iframe"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
              />
            </div>
          )}
        </div>

        {/* Modal Footer / Navigation Row */}
        <div className="doc-preview-footer">
          <div className="doc-footer-hint">
            <span>Press <kbd>Esc</kbd> or click outside to close preview</span>
          </div>

          <div className="doc-footer-actions">
            {actionLink && actionText && (
              <Link
                to={actionLink}
                onClick={onClose}
                className="doc-footer-link-btn"
              >
                <SparklesIcon size={14} />
                <span>{actionText}</span>
                <ArrowUpRightIcon size={14} />
              </Link>
            )}

            <button
              type="button"
              className="doc-footer-done-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
