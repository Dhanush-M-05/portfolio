import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import DataTable from '../../components/Admin/DataTable/DataTable';
import Modal from '../../components/Admin/Modal/Modal';
import ConfirmDialog from '../../components/Admin/ConfirmDialog/ConfirmDialog';
import Toast from '../../components/Admin/Toast/Toast';

export const ManageExperience = () => {
  const { experience, addExperience, updateExperience, deleteExperience } = useCMS();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [deletingExp, setDeletingExp] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const initialFormState = {
    role: '',
    organization: '',
    period: '2026',
    location: 'Chennai, India',
    type: 'Internship',
    description: '',
    responsibilities: 'Developed, tested, and deployed web application features\nMaintained databases ensuring data accuracy\nCollaborated with cross-functional teams',
    technologies: 'React.js, Spring Boot, Java, Python, MySQL',
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setEditingExp(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingExp(exp);
    setFormData({
      role: exp.role || '',
      organization: exp.company || exp.organization || '',
      period: exp.duration || exp.period || '',
      location: exp.location || 'Chennai, India',
      type: exp.type || 'Internship',
      description: exp.description || '',
      responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities.join('\n') : exp.responsibilities || '',
      technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : exp.technologies || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (exp) => {
    setDeletingExp(exp);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingExp) return;
    setIsSaving(true);
    try {
      await deleteExperience(deletingExp.id);
      setToastMessage(`Experience entry "${deletingExp.role}" deleted.`);
      setIsConfirmOpen(false);
    } catch (err) {
      setToastMessage('Failed to delete experience: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      ...formData,
      responsibilities: formData.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean),
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editingExp) {
        await updateExperience(editingExp.id, payload);
        setToastMessage(`Experience "${formData.role}" updated.`);
      } else {
        await addExperience(payload);
        setToastMessage(`Experience "${formData.role}" added.`);
      }
      setIsModalOpen(false);
    } catch (err) {
      setToastMessage('Error saving experience: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      header: 'Role & Organization',
      key: 'role',
      render: (val, row) => (
        <div>
          <strong style={{ color: '#0F172A' }}>{val}</strong>
          <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748B' }}>
            {row.organization} • {row.location}
          </span>
        </div>
      ),
    },
    {
      header: 'Period',
      key: 'period',
      render: (val) => <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{val}</span>,
    },
    {
      header: 'Type',
      key: 'type',
      render: (val) => <span className="admin-badge badge-category">{val}</span>,
    },
  ];

  return (
    <AdminLayout
      title="Experience Management"
      subtitle="Manage career history, internships, roles, and project leadership records."
      breadcrumb={[{ label: 'Experience' }]}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleOpenAdd}
        >
          + Add Experience
        </button>
      </div>

      <DataTable
        columns={columns}
        data={experience}
        searchKey="role"
        searchPlaceholder="Search by role or organization..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExp ? 'Edit Experience Record' : 'Add Experience Record'}
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="exp-role">Role Title *</label>
              <input
                type="text"
                id="exp-role"
                className="admin-input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Web Development Intern"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="exp-org">Organization *</label>
              <input
                type="text"
                id="exp-org"
                className="admin-input"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. Tech Solutions Inc."
                required
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="exp-period">Duration / Period *</label>
              <input
                type="text"
                id="exp-period"
                className="admin-input"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="e.g. 2024 — Present"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="exp-type">Employment / Role Type</label>
              <select
                id="exp-type"
                className="admin-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Internship">Internship</option>
                <option value="Full Time">Full Time</option>
                <option value="Contract">Contract</option>
                <option value="Project Leadership">Project Leadership</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="exp-loc">Location</label>
            <input
              type="text"
              id="exp-loc"
              className="admin-input"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="exp-desc">Brief Overview</label>
            <textarea
              id="exp-desc"
              className="admin-textarea"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="exp-resp">Key Responsibilities & Bullet Points (One per line)</label>
            <textarea
              id="exp-resp"
              className="admin-textarea"
              rows={3}
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="exp-tech">Technologies (Comma separated)</label>
            <input
              type="text"
              id="exp-tech"
              className="admin-input"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="React.js, JavaScript, Python, Django, MySQL, REST API"
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
              {isSaving ? 'Saving...' : editingExp ? 'Update Experience' : 'Add Experience'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Experience Record"
        message={`Are you sure you want to delete "${deletingExp?.role}" at "${deletingExp?.organization}"?`}
        confirmLabel="Delete"
        isLoading={isSaving}
      />
    </AdminLayout>
  );
};

export default ManageExperience;
