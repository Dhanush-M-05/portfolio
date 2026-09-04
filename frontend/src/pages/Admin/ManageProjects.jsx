import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import DataTable from '../../components/Admin/DataTable/DataTable';
import Modal from '../../components/Admin/Modal/Modal';
import ConfirmDialog from '../../components/Admin/ConfirmDialog/ConfirmDialog';
import FileUploader from '../../components/Admin/FileUploader/FileUploader';
import Toast from '../../components/Admin/Toast/Toast';
import { TrashIcon, ExternalLinkIcon } from '../../components/Icons/Icons';
import { addProjectImage, deleteProjectImage } from '../../services/projectsApi';

export const ManageProjects = () => {
  const { projects, addProject, updateProject, deleteProject } = useCMS();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [projectImages, setProjectImages] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const initialFormState = {
    title: '',
    slug: '',
    category: 'Full Stack Web Application',
    tagline: '',
    shortDescription: '',
    overview: '',
    problem: '',
    solution: '',
    technologies: 'React.js, JavaScript, Python, Django, MySQL, CSS3',
    features: 'Role-Based Access, Dynamic Form Validation, Real-Time Updates',
    githubUrl: 'https://github.com/Dhanush-M-05/',
    liveUrl: '',
    featured: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormData(initialFormState);
    setSelectedFile(null);
    setProjectImages([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title || '',
      slug: proj.slug || '',
      category: proj.category || 'Full Stack Web Application',
      tagline: proj.tagline || '',
      shortDescription: proj.shortDescription || '',
      overview: proj.overview || '',
      problem: proj.problem || '',
      solution: proj.solution || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || '',
      features: Array.isArray(proj.features) ? proj.features.join('\n') : proj.features || '',
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      featured: Boolean(proj.featured),
    });
    setSelectedFile(null);
    setProjectImages(proj.images || []);
    setIsModalOpen(true);
  };

  const handleOpenDeleteDialog = (proj) => {
    setDeletingProject(proj);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    setIsSaving(true);
    try {
      await deleteProject(deletingProject.id || deletingProject.slug);
      setToastMessage(`Project "${deletingProject.title}" deleted successfully.`);
      setIsConfirmOpen(false);
      setDeletingProject(null);
    } catch (err) {
      setToastMessage('Error deleting project: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadProjectImage = async (file) => {
    if (!file) return;
    if (editingProject) {
      setIsUploadingImage(true);
      setToastMessage('Uploading project screenshot to Cloudinary...');
      try {
        const newImg = await addProjectImage(editingProject.id, file);
        setProjectImages((prev) => [...prev, newImg]);
        setToastMessage('Image uploaded to Cloudinary and added to project!');
      } catch (err) {
        setToastMessage('Failed to upload image: ' + (err.response?.data?.message || err.message));
      } finally {
        setIsUploadingImage(false);
      }
    } else {
      setSelectedFile(file);
      setToastMessage(`Selected "${file.name}" for upload upon publishing.`);
    }
  };

  const handleDeleteProjectImage = async (imageId) => {
    if (!editingProject) return;
    try {
      await deleteProjectImage(editingProject.id, imageId);
      setProjectImages((prev) => prev.filter((img) => img.id !== imageId));
      setToastMessage('Project image deleted from Cloudinary.');
    } catch (err) {
      setToastMessage('Failed to delete image: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const projectPayload = {
      ...formData,
      slug: formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      features: formData.features.split('\n').map((f) => f.trim()).filter(Boolean),
    };

    try {
      if (editingProject) {
        await updateProject(editingProject.id || editingProject.slug, projectPayload);
        setToastMessage(`Project "${formData.title}" updated successfully.`);
      } else {
        const created = await addProject(projectPayload);
        if (selectedFile && created?.id) {
          try {
            await addProjectImage(created.id, selectedFile);
          } catch (uploadErr) {
            console.warn('Could not upload initial project cover image:', uploadErr.message);
          }
        }
        setToastMessage(`Project "${formData.title}" created with Cloudinary storage!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      setToastMessage('Failed to save project: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      header: 'Project Title',
      key: 'title',
      render: (val, row) => (
        <div>
          <strong style={{ color: '#0F172A', display: 'block' }}>{val}</strong>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace' }}>
            /{row.slug}
          </span>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (val) => <span className="admin-badge badge-category">{val}</span>,
    },
    {
      header: 'Featured',
      key: 'featured',
      render: (val, row) => (
        <button
          type="button"
          onClick={() => updateProject(row.id || row.slug, { ...row, featured: !val })}
          className={`admin-badge ${val ? 'badge-featured' : 'badge-inactive'}`}
          style={{ cursor: 'pointer', border: 'none' }}
          title="Click to toggle featured on homepage"
        >
          {val ? 'Featured' : 'Standard'}
        </button>
      ),
    },
    {
      header: 'Technologies',
      key: 'technologies',
      render: (val) => (
        <span style={{ fontSize: '0.8rem', color: '#475569' }}>
          {Array.isArray(val) ? val.slice(0, 3).join(', ') + (val.length > 3 ? '...' : '') : val}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Project Management"
      subtitle="Add, edit, reorder, or feature portfolio case studies and web applications."
      breadcrumb={[{ label: 'Projects' }]}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleOpenAddModal}
        >
          + Add New Project
        </button>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        searchKey="title"
        searchPlaceholder="Search projects by title or category..."
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
      />

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        maxWidth="760px"
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="proj-title">Project Title *</label>
              <input
                type="text"
                id="proj-title"
                className="admin-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. AI Workflow Automation Studio"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="proj-slug">URL Slug *</label>
              <input
                type="text"
                id="proj-slug"
                className="admin-input"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. workflow-studio"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="proj-category">Category *</label>
              <select
                id="proj-category"
                className="admin-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Full Stack Web Application">Full Stack Web Application</option>
                <option value="Frontend Web Application">Frontend Web Application</option>
                <option value="Full Stack Platform">Full Stack Platform</option>
                <option value="Web Application & Design System">Web Application & Design System</option>
                <option value="Full Stack Resource Hub">Full Stack Resource Hub</option>
              </select>
            </div>

            <div className="admin-form-group" style={{ justifyContent: 'center' }}>
              <label className="admin-form-label">Featured on Homepage</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '6px' }}>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <span>Display in "Selected Work" on Home</span>
              </label>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="proj-tagline">Tagline</label>
            <input
              type="text"
              id="proj-tagline"
              className="admin-input"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Short high-impact subtitle"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="proj-short">Short Description (for cards) *</label>
            <textarea
              id="proj-short"
              className="admin-textarea"
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="proj-overview">Full Overview (for case study page)</label>
            <textarea
              id="proj-overview"
              className="admin-textarea"
              rows={3}
              value={formData.overview}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="proj-problem">The Problem Solved</label>
              <textarea
                id="proj-problem"
                className="admin-textarea"
                rows={2}
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="proj-solution">The Technical Solution</label>
              <textarea
                id="proj-solution"
                className="admin-textarea"
                rows={2}
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="proj-tech">Technologies (Comma separated) *</label>
            <input
              type="text"
              id="proj-tech"
              className="admin-input"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="React.js, JavaScript, Python, Django, MySQL, CSS3"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="proj-features">Key Features (One per line)</label>
            <textarea
              id="proj-features"
              className="admin-textarea"
              rows={3}
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="proj-github">GitHub Repository URL</label>
              <input
                type="url"
                id="proj-github"
                className="admin-input"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="proj-live">Live Demo URL</label>
              <input
                type="url"
                id="proj-live"
                className="admin-input"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Project Screenshots & Cloudinary Media</span>
              {projectImages.length > 0 && (
                <span style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 600 }}>
                  ☁️ {projectImages.length} {projectImages.length === 1 ? 'Image' : 'Images'} Stored
                </span>
              )}
            </label>

            {/* Gallery of Uploaded Project Images */}
            {projectImages.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '10px',
                marginBottom: '12px',
                padding: '10px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
              }}>
                {projectImages.map((img) => (
                  <div
                    key={img.id || img.imageUrl}
                    style={{
                      position: 'relative',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      height: '80px',
                    }}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.altText || 'Project screenshot'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      display: 'flex',
                      gap: '4px',
                    }}>
                      <a
                        href={img.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: 'rgba(15, 23, 42, 0.7)',
                          color: '#FFFFFF',
                          borderRadius: '4px',
                          padding: '2px 4px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="View Full Size"
                      >
                        <ExternalLinkIcon size={10} />
                      </a>
                      {editingProject && (
                        <button
                          type="button"
                          onClick={() => handleDeleteProjectImage(img.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.85)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '2px 4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Delete from Cloudinary"
                        >
                          <TrashIcon size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <FileUploader
              key={editingProject ? `edit-${editingProject.id}-${projectImages.length}` : 'new-proj-img'}
              label={isUploadingImage ? "Uploading to Cloudinary..." : editingProject ? "Upload Additional Screenshot to Cloudinary" : "Upload Project Screenshot (Cloudinary)"}
              helpText="JPG, PNG, WebP (Max 10MB) — Uploaded to portfolio/projects"
              accept="image/*"
              onFileSelect={handleUploadProjectImage}
            />
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
              className="admin-btn admin-btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : editingProject ? 'Update Project' : 'Publish Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingProject?.title}"? This project and its case study page will be removed from the public website.`}
        confirmLabel="Delete Project"
        isLoading={isSaving}
      />
    </AdminLayout>
  );
};

export default ManageProjects;
