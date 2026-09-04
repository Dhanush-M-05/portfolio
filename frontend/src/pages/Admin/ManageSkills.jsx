import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import DataTable from '../../components/Admin/DataTable/DataTable';
import Modal from '../../components/Admin/Modal/Modal';
import ConfirmDialog from '../../components/Admin/ConfirmDialog/ConfirmDialog';
import Toast from '../../components/Admin/Toast/Toast';

export const ManageSkills = () => {
  const { skills, addSkill, updateSkill, deleteSkill } = useCMS();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deletingSkill, setDeletingSkill] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const initialFormState = {
    name: '',
    category: 'frontend',
    level: 'Advanced',
    proficiency: 85,
    tag: 'Technology',
    description: '',
    featured: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      category: skill.category || 'frontend',
      level: skill.level || 'Advanced',
      proficiency: skill.proficiency || 85,
      tag: skill.tag || 'Technology',
      description: skill.description || '',
      featured: Boolean(skill.featured),
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (skill) => {
    setDeletingSkill(skill);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSkill) return;
    setIsSaving(true);
    try {
      await deleteSkill(deletingSkill.name);
      setToastMessage(`Skill "${deletingSkill.name}" removed from portfolio.`);
      setIsConfirmOpen(false);
    } catch (err) {
      setToastMessage('Failed to delete skill: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.name, formData);
        setToastMessage(`Skill "${formData.name}" updated successfully.`);
      } else {
        await addSkill(formData);
        setToastMessage(`Skill "${formData.name}" added to portfolio.`);
      }
      setIsModalOpen(false);
    } catch (err) {
      setToastMessage('Error saving skill: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      header: 'Skill Name',
      key: 'name',
      render: (val, row) => (
        <div>
          <strong style={{ color: '#0F172A' }}>{val}</strong>
          <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>{row.tag}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (val) => <span className="admin-badge badge-category" style={{ textTransform: 'capitalize' }}>{val}</span>,
    },
    {
      header: 'Level',
      key: 'level',
      render: (val) => <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>{val}</span>,
    },
    {
      header: 'Proficiency',
      key: 'proficiency',
      render: (val) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '80px', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${val}%`, height: '100%', backgroundColor: '#4F46E5', borderRadius: '4px' }} />
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748B', fontFamily: 'monospace' }}>{val}%</span>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Skills Management"
      subtitle="Organize technical proficiencies across Frontend, Backend, Database, and Tools."
      breadcrumb={[{ label: 'Skills' }]}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleOpenAdd}
        >
          + Add New Skill
        </button>
      </div>

      <DataTable
        columns={columns}
        data={skills}
        searchKey="name"
        searchPlaceholder="Search skills by name..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Technical Skill' : 'Add Technical Skill'}
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="skill-name">Skill / Technology Name *</label>
              <input
                type="text"
                id="skill-name"
                className="admin-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Next.js or PostgreSQL"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="skill-tag">Classification Tag</label>
              <input
                type="text"
                id="skill-tag"
                className="admin-input"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="e.g. Framework or RDBMS"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="skill-category">Category *</label>
              <select
                id="skill-category"
                className="admin-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="tools">Tools & DevOps</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="skill-level">Proficiency Level</label>
              <select
                id="skill-level"
                className="admin-select"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              >
                <option value="Advanced">Advanced</option>
                <option value="Proficient">Proficient</option>
                <option value="Intermediate">Intermediate</option>
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="admin-form-label" htmlFor="skill-proficiency">Proficiency Percentage</label>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4F46E5', fontFamily: 'monospace' }}>
                {formData.proficiency}%
              </span>
            </div>
            <input
              type="range"
              id="skill-proficiency"
              min="40"
              max="100"
              step="1"
              value={formData.proficiency}
              onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#4F46E5', cursor: 'pointer' }}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="skill-desc">Brief Description / Sub-skills</label>
            <textarea
              id="skill-desc"
              className="admin-textarea"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Component architecture, custom hooks, performance tuning"
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
              {isSaving ? 'Saving...' : editingSkill ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Skill"
        message={`Are you sure you want to remove "${deletingSkill?.name}" from your portfolio?`}
        confirmLabel="Remove Skill"
        isLoading={isSaving}
      />
    </AdminLayout>
  );
};

export default ManageSkills;
