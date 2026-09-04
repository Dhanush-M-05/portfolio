import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import DataTable from '../../components/Admin/DataTable/DataTable';
import Modal from '../../components/Admin/Modal/Modal';
import ConfirmDialog from '../../components/Admin/ConfirmDialog/ConfirmDialog';
import Toast from '../../components/Admin/Toast/Toast';

export const ManageEducation = () => {
  const { education, addEducation, updateEducation, deleteEducation } = useCMS();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [deletingEdu, setDeletingEdu] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const initialFormState = {
    degree: '',
    institution: '',
    location: 'Chennai, Tamil Nadu',
    period: '2023 – 2027',
    grade: 'CGPA: 7.20',
    highlights: 'B.E in Computer Science and Engineering\nAffiliated with Anna University (Autonomous)\nCGPA: 7.20\nExpected Graduation: 2027',
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setEditingEdu(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (edu) => {
    setEditingEdu(edu);
    setFormData({
      degree: edu.degree || '',
      institution: edu.institution || '',
      location: edu.location || '',
      period: edu.period || '',
      grade: edu.grade || '',
      highlights: Array.isArray(edu.highlights) ? edu.highlights.join('\n') : edu.highlights || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (edu) => {
    setDeletingEdu(edu);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingEdu) return;
    setIsSaving(true);
    try {
      await deleteEducation(deletingEdu.id);
      setToastMessage(`Education entry "${deletingEdu.degree}" removed.`);
      setIsConfirmOpen(false);
    } catch (err) {
      setToastMessage('Failed to delete education: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      ...formData,
      highlights: formData.highlights.split('\n').map((h) => h.trim()).filter(Boolean),
    };

    try {
      if (editingEdu) {
        await updateEducation(editingEdu.id, payload);
        setToastMessage(`Education "${formData.degree}" updated.`);
      } else {
        await addEducation(payload);
        setToastMessage(`Education "${formData.degree}" added.`);
      }
      setIsModalOpen(false);
    } catch (err) {
      setToastMessage('Error saving education: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      header: 'Degree & Institution',
      key: 'degree',
      render: (val, row) => (
        <div>
          <strong style={{ color: '#0F172A' }}>{val}</strong>
          <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748B' }}>
            {row.institution}
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
      header: 'Grade / Distinction',
      key: 'grade',
      render: (val) => <span className="admin-badge badge-active">{val}</span>,
    },
  ];

  return (
    <AdminLayout
      title="Education Management"
      subtitle="Manage university degrees, coursework, and academic milestones."
      breadcrumb={[{ label: 'Education' }]}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleOpenAdd}
        >
          + Add Education
        </button>
      </div>

      <DataTable
        columns={columns}
        data={education}
        searchKey="degree"
        searchPlaceholder="Search education by degree or institution..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEdu ? 'Edit Education' : 'Add Education'}
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="edu-degree">Degree Title *</label>
            <input
              type="text"
              id="edu-degree"
              className="admin-input"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              placeholder="e.g. Bachelor of Engineering in Computer Science"
              required
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="edu-inst">Institution / University *</label>
              <input
                type="text"
                id="edu-inst"
                className="admin-input"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="e.g. Visvesvaraya Technological University"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="edu-loc">Location</label>
              <input
                type="text"
                id="edu-loc"
                className="admin-input"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="edu-period">Period / Years</label>
              <input
                type="text"
                id="edu-period"
                className="admin-input"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="e.g. 2021 — 2025"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="edu-grade">Grade / Honors</label>
              <input
                type="text"
                id="edu-grade"
                className="admin-input"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="e.g. First Class with Distinction"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="edu-highlights">Coursework & Highlights (One per line)</label>
            <textarea
              id="edu-highlights"
              className="admin-textarea"
              rows={3}
              value={formData.highlights}
              onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
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
              {isSaving ? 'Saving...' : editingEdu ? 'Update Education' : 'Add Education'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Education Entry"
        message={`Are you sure you want to delete "${deletingEdu?.degree}"?`}
        confirmLabel="Delete"
        isLoading={isSaving}
      />
    </AdminLayout>
  );
};

export default ManageEducation;
