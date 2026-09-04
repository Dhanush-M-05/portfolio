import React from 'react';
import { DownloadIcon, FileTextIcon, SparklesIcon } from '../../components/Icons/Icons';
import Button from '../../components/Button/Button';
import { useCMS } from '../../context/CMSContext';
import { useDocumentPreview } from '../../context/DocumentPreviewContext';
import { getResumeDownloadUrl, getResumeViewUrl } from '../../services/resumeService';
import './ResumeSection.css';

export const ResumeSection = () => {
  const { resume, profile, getSection } = useCMS();
  const { openPreview } = useDocumentPreview();
  const sectionConfig = getSection('resume');

  const badgeText = sectionConfig.label || "Comprehensive Resume";
  const titleText = sectionConfig.title || "Want to know more about my work?";
  const subtitleText = sectionConfig.subtitle || `Download my official resume (${resume?.fileName || 'PDF'}) or view the detailed interactive career matrix directly in your browser.`;
  const viewBtnText = sectionConfig.viewBtnText || "View Resume";
  const downloadBtnText = sectionConfig.downloadBtnText || "Download PDF";

  return (
    <section className="section resume-cta-section">
      <div className="container">
        <div className="resume-cta-glass-banner">
          <div className="resume-cta-content">
            <div className="resume-badge">
              <SparklesIcon size={14} />
              <span>{badgeText}</span>
            </div>

            <h2 className="resume-cta-title">
              {titleText}
            </h2>

            <p className="resume-cta-subtitle">
              {subtitleText}
            </p>
          </div>

          <div className="resume-cta-actions">
            <Button
              onClick={() =>
                openPreview({
                  title: 'Professional Resume',
                  subtitle: `${profile?.name || 'Dhanush M'} • ${resume?.fileName || 'Curriculum Vitae'}`,
                  badge: 'Official CV',
                  fileUrl: getResumeViewUrl(),
                  downloadUrl: getResumeDownloadUrl(),
                  fileName: resume?.fileName || 'Dhanush-M-Resume.pdf',
                  iconType: 'resume',
                  actionText: 'Open Full Interactive CV',
                  actionLink: '/resume',
                })
              }
              variant="primary"
              size="lg"
              icon={FileTextIcon}
              iconPosition="left"
            >
              {viewBtnText}
            </Button>

            <Button
              href={getResumeDownloadUrl()}
              download="Dhanush-M-Resume.pdf"
              variant="secondary"
              size="lg"
              icon={DownloadIcon}
              iconPosition="left"
            >
              {downloadBtnText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;
