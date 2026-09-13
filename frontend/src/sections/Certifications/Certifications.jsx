import React from 'react';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import { AwardIcon, ExternalLinkIcon, CalendarIcon, FileTextIcon } from '../../components/Icons/Icons';
import { useCMS } from '../../context/CMSContext';
import { useDocumentPreview } from '../../context/DocumentPreviewContext';
import { getCertificateViewUrl } from '../../services/experienceService';
import './Certifications.css';

export const Certifications = () => {
  const { certifications, getSection } = useCMS();
  const { openPreview } = useDocumentPreview();
  const sectionConfig = getSection('certifications');

  const activeCertifications = (certifications || [])
    .filter((cert) => cert.isVisible !== false && cert.isActive !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  if (!activeCertifications || activeCertifications.length === 0) {
    return null;
  }

  return (
    <section id="certifications" className="section certifications-section">
      <div className="container">
        <SectionTitle
          label={sectionConfig.label || "Credentials"}
          title={sectionConfig.title || "Certifications"}
          subtitle={sectionConfig.subtitle || "Specialized coursework and verified technical credentials in Artificial Intelligence, Industrial IoT, and Enterprise Java."}
        />

        <div className="certifications-grid">
          {activeCertifications.map((cert) => {
            const documentUrl = cert.fileUrl || (cert.id ? getCertificateViewUrl(cert.id) : null) || cert.credentialUrl;
            const skills = Array.isArray(cert.skillsCovered)
              ? cert.skillsCovered
              : typeof cert.skillsCovered === 'string' && cert.skillsCovered.trim()
                ? cert.skillsCovered.split(',').map((s) => s.trim()).filter(Boolean)
                : [];

            return (
              <div key={cert.id || cert.title || cert.name} className="cert-glass-card">
                <div className="cert-card-header">
                  <div className="cert-icon-box" aria-hidden="true">
                    <AwardIcon size={22} />
                  </div>
                  <div className="cert-header-meta">
                    <span className="cert-date">
                      <CalendarIcon size={12} />
                      <span>{cert.issueDate || cert.year || cert.date || 'Verified'}</span>
                    </span>
                  </div>
                </div>

                <h3 className="cert-name">{cert.title || cert.name}</h3>
                <h4 className="cert-issuer">{cert.issuer}</h4>

                {cert.description && (
                  <p className="cert-desc-text">{cert.description}</p>
                )}

                {skills.length > 0 && (
                  <div className="cert-skills-tags">
                    {skills.map((skill, sIdx) => (
                      <span key={sIdx} className="cert-skill-tag">{skill}</span>
                    ))}
                  </div>
                )}

                <div className="cert-card-actions">
                  {documentUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        openPreview({
                          title: cert.title || cert.name,
                          subtitle: cert.issuer,
                          badge: 'Verified Certificate',
                          fileUrl: documentUrl,
                          iconType: 'certificate',
                          allowDownload: false,
                        })
                      }
                      className="cert-verify-link cert-primary-btn"
                      aria-label={`View certificate for ${cert.title || cert.name}`}
                    >
                      <FileTextIcon size={15} />
                      <span>{cert.verifyBtnText || sectionConfig.verifyBtnText || "View Certificate"}</span>
                    </button>
                  )}

                  {cert.credentialUrl && cert.credentialUrl.trim() !== '' && cert.credentialUrl !== documentUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cert-secondary-link"
                      aria-label={`Verify credential online for ${cert.title || cert.name}`}
                    >
                      <span>Verify Online</span>
                      <ExternalLinkIcon size={12} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
