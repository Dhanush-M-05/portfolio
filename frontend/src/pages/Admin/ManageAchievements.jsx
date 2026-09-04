import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import DataTable from '../../components/Admin/DataTable/DataTable';
import Modal from '../../components/Admin/Modal/Modal';
import ConfirmDialog from '../../components/Admin/ConfirmDialog/ConfirmDialog';
import Toast from '../../components/Admin/Toast/Toast';

export const ManageAchievements = () => {
  const { achievements, addAchievement, updateAchievement, deleteAchievement } = useCMS();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const initialFormState = {
    title: '',
    organization: '',
    year: '2024',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      organization: item.organization || '',
      year: item.year || '',
      description: item.description || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (item) => {
    setDeletingItem(item);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsSaving(true);
    try {
      await deleteAchievement(deletingItem.id);
      setToastMessage(`Achievement "${deletingItem.title}" deleted.`);
      setIsConfirmOpen(false);
    } catch (err) {
      setToastMessage('Error deleting achievement: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingItem) {
        await updateAchievement(editingItem.id, formData);
        setToastMessage(`Achievement "${formData.title}" updated.`);
      } else {
        await addAchievement(formData);
        setToastMessage(`Achievement "${formData.title}" added.`);
      }
      setIsModalOpen(false);
    } catch (err) {
      setToastMessage('Error saving achievement: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      header: 'Achievement / Award',
      key: 'title',
      render: (val, row) => (
        <div>
          <strong style={{ color: '#0F172A' }}>{val}</strong>
          <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748B' }}>
            {row.organization}
          </span>
        </div>
      ),
    },
    {
      header: 'Year',
      key: 'year',
      render: (val) => <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{val}</span>,
    },
    {
      header: 'Description',
      key: 'description',
      render: (val) => (
        <span style={{ fontSize: '0.8rem', color: '#475569' }}>{val}</span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Achievements Management"
      subtitle="Document competitive hackathons, awards, recognitions, and milestones."
      breadcrumb={[{ label: 'Achievements' }]}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleOpenAdd}
        >
          + Add Achievement
        </button>
      </div>

      <DataTable
        columns={columns}
        data={achievements}
        searchKey="title"
        searchPlaceholder="Search achievements..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Achievement' : 'Add Achievement'}
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="ach-title">Title / Award Name *</label>
            <input
              type="text"
              id="ach-title"
              className="admin-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 1st Place — Web Innovation Hackathon"
              required
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="ach-org">Organizing Body</label>
              <input
                type="text"
                id="ach-org"
                className="admin-input"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. University Tech Council"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="ach-year">Year</label>
              <input
                type="text"
                id="ach-year"
                className="admin-input"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g. 2024"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="ach-desc">Description</label>
            <textarea
              id="ach-desc"
              className="admin-textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Highlight what was built or achieved..."
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
              {isSaving ? 'Saving...' : editingItem ? 'Update Achievement' : 'Add Achievement'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Achievement"
        message={`Are you sure you want to delete "${deletingItem?.title}"?`}
        confirmLabel="Delete"
        isLoading={isSaving}
      />
    </AdminLayout>
  );
};

export default ManageAchievements;
