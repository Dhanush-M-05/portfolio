import React, { createContext, useContext, useState, useCallback } from 'react';
import DocumentPreviewModal from '../components/DocumentPreviewModal/DocumentPreviewModal';

const DocumentPreviewContext = createContext(null);

export const DocumentPreviewProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewData, setPreviewData] = useState({});

  const openPreview = useCallback((data) => {
    if (!data || !data.fileUrl) return;
    setPreviewData(data);
    setIsOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <DocumentPreviewContext.Provider
      value={{
        isOpen,
        previewData,
        openPreview,
        closePreview,
      }}
    >
      {children}
      <DocumentPreviewModal
        isOpen={isOpen}
        onClose={closePreview}
        previewData={previewData}
      />
    </DocumentPreviewContext.Provider>
  );
};

export const useDocumentPreview = () => {
  const context = useContext(DocumentPreviewContext);
  if (!context) {
    throw new Error('useDocumentPreview must be used within a DocumentPreviewProvider');
  }
  return context;
};

export default DocumentPreviewContext;
