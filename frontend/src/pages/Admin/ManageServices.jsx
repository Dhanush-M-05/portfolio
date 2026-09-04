import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import DataTable from '../../components/Admin/DataTable/DataTable';
import Modal from '../../components/Admin/Modal/Modal';
import ConfirmDialog from '../../components/Admin/ConfirmDialog/ConfirmDialog';
import Toast from '../../components/Admin/Toast/Toast';

export const ManageServices = () => {
  const { services, addService, updateService, deleteService } = useCMS();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deletingService, setDeletingService] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const initialFormState = {
    title: '',
    number: `0${services.length + 1}`,
    shortDescription: '',
    deliverables: 'Architecture & Design\nProduction implementation\nTesting & documentation',
    icon: 'CodeIcon',
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      ...initialFormState,
      number: `0${services.length + 1}`,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    setFormData({
      title: srv.title || '',
      number: srv.number || '01',
      shortDescription: srv.shortDescription || '',
      deliverables: Array.isArray(srv.deliverables) ? srv.deliverables.join('\n') : srv.deliverables || '',
      icon: srv.icon || 'CodeIcon',
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (srv) => {
    setDeletingService(srv);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingService) return;
    setIsSaving(true);
    try {
      await deleteService(deletingService.id);
      setToastMessage(`Service "${deletingService.title}" removed.`);
      setIsConfirmOpen(false);
    } catch (err) {
      setToastMessage('Failed to delete service: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      ...formData,
      deliverables: formData.deliverables.split('\n').map((d) => d.trim()).filter(Boolean),
    };

    try {
      if (editingService) {
        await updateService(editingService.id, payload);
        setToastMessage(`Service "${formData.title}" updated.`);
      } else {
        await addService(payload);
        setToastMessage(`Service "${formData.title}" added to portfolio.`);
      }
      setIsModalOpen(false);
    } catch (err) {
      setToastMessage('Error saving service: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      header: 'Number',
      key: 'number',
      width: '80px',
      render: (val) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#64748B' }}>{val}</span>,
    },
    {
      header: 'Service Title',
      key: 'title',
      render: (val, row) => (
        <div>
          <strong style={{ color: '#0F172A' }}>{val}</strong>
          <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748B' }}>
            {row.shortDescription}
          </span>
        </div>
      ),
    },
    {
      header: 'Deliverables',
      key: 'deliverables',
      render: (val) => (
        <span style={{ fontSize: '0.8rem', color: '#475569' }}>
          {Array.isArray(val) ? `${val.length} deliverables specified` : val}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Services Management"
      subtitle="Define and update the professional web development offerings shown on your portfolio."
      breadcrumb={[{ label: 'Services' }]}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleOpenAdd}
        >
          + Add New Service
        </button>
      </div>

      <DataTable
        columns={columns}
        data={services}
        searchKey="title"
        searchPlaceholder="Search services by title..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add New Service'}
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="srv-title">Service Title *</label>
              <input
                type="text"
                id="srv-title"
                className="admin-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Next.js Full Stack Architecture"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="srv-number">Display Index (e.g. 01)</label>
              <input
                type="text"
                id="srv-number"
                className="admin-input"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="srv-desc">Short Description *</label>
            <textarea
              id="srv-desc"
              className="admin-textarea"
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="srv-deliv">Deliverables (One per line)</label>
            <textarea
              id="srv-deliv"
              className="admin-textarea"
              rows={3}
              value={formData.deliverables}
              onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
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
              {isSaving ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Service"
        message={`Are you sure you want to delete service "${deletingService?.title}"?`}
        confirmLabel="Delete"
        isLoading={isSaving}
      />
    </AdminLayout>
  );
};

export default ManageServices;
