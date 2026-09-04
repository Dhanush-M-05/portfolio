import React, { useRef, useState } from 'react';
import { DownloadIcon, FileTextIcon, CheckIcon } from '../../Icons/Icons';

export const FileUploader = ({
  accept = "image/*,.pdf",
  label = "Upload file or image",
  helpText = "Supports PNG, JPG, WebP or PDF (Max 10MB)",
  onFileSelect,
  currentPreviewUrl,
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className="admin-uploader-wrapper">
      <div
        className={`admin-dropzone ${dragActive ? 'is-drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => {
          if (fileInputRef.current) fileInputRef.current.value = '';
          fileInputRef.current?.click();
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={handleChange}
        />
        <div className="admin-dropzone-icon">
          <DownloadIcon size={20} />
        </div>
        <span className="admin-dropzone-title">
          {selectedFile ? selectedFile.name : label}
        </span>
        <span className="admin-dropzone-subtitle">{helpText}</span>

        {selectedFile && (
          <span style={{ fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <CheckIcon size={14} /> Ready for upload ({(selectedFile.size / 1024).toFixed(1)} KB)
          </span>
        )}
      </div>

      {currentPreviewUrl && !selectedFile && (
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Current asset:</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-primary)' }}>{currentPreviewUrl}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
