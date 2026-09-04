import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import DataTable from '../../components/Admin/DataTable/DataTable';
import Modal from '../../components/Admin/Modal/Modal';
import ConfirmDialog from '../../components/Admin/ConfirmDialog/ConfirmDialog';
import Toast from '../../components/Admin/Toast/Toast';
import { MailIcon } from '../../components/Icons/Icons';

export const ManageMessages = () => {
  const { messages, markMessageRead, deleteMessage } = useCMS();

  const [activeMessage, setActiveMessage] = useState(null);
  const [deletingMessage, setDeletingMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const handleOpenView = async (msg) => {
    setActiveMessage(msg);
    if (!msg.isRead) {
      await markMessageRead(msg.id, true);
    }
  };

  const handleToggleRead = async (msg) => {
    await markMessageRead(msg.id, !msg.isRead);
    setToastMessage(`Marked as ${!msg.isRead ? 'read' : 'unread'}.`);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMessage) return;
    try {
      await deleteMessage(deletingMessage.id);
      setToastMessage('Inquiry deleted from inbox.');
      setDeletingMessage(null);
    } catch (err) {
      setToastMessage('Failed to delete message: ' + err.message);
    }
  };

  const columns = [
    {
      header: 'Status',
      key: 'isRead',
      width: '90px',
      render: (val, row) => (
        <button
          type="button"
          onClick={() => handleToggleRead(row)}
          className={`admin-badge ${val ? 'badge-inactive' : 'badge-active'}`}
          style={{ cursor: 'pointer', border: 'none' }}
          title="Click to toggle read status"
        >
          {val ? 'Read' : 'New'}
        </button>
      ),
    },
    {
      header: 'Sender & Subject',
      key: 'name',
      render: (val, row) => (
        <div>
          <strong style={{ color: '#0F172A' }}>{val}</strong>
          <span style={{ display: 'block', fontSize: '0.8rem', color: '#4F46E5', fontWeight: 600 }}>
            {row.subject}
          </span>
          <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>
            {row.email}
          </span>
        </div>
      ),
    },
    {
      header: 'Received Date',
      key: 'date',
      render: (val) => (
        <span style={{ fontSize: '0.8rem', color: '#64748B', fontFamily: 'monospace' }}>
          {new Date(val).toLocaleDateString()} {new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
  ];

  const customActions = (row) => (
    <button
      type="button"
      className="admin-action-icon-btn"
      onClick={() => handleOpenView(row)}
      title="View full message details"
      style={{ color: '#4F46E5' }}
    >
      <MailIcon size={16} />
    </button>
  );

  return (
    <AdminLayout
      title="Contact Messages Inbox"
      subtitle="Review inquiries and feedback submitted through the public website's contact form."
      breadcrumb={[{ label: 'Messages' }]}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <DataTable
        columns={columns}
        data={messages}
        searchKey="name"
        searchPlaceholder="Search messages by sender or subject..."
        customActions={customActions}
        onDelete={(row) => setDeletingMessage(row)}
        emptyMessage="Your inbox is clear. No messages received yet."
      />

      {/* Message Details Modal */}
      <Modal
        isOpen={Boolean(activeMessage)}
        onClose={() => setActiveMessage(null)}
        title="Inquiry Details"
      >
        {activeMessage && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#0F172A', margin: 0 }}>{activeMessage.name}</h4>
                  <a
                    href={`mailto:${activeMessage.email}`}
                    style={{ fontSize: '0.85rem', color: '#4F46E5', textDecoration: 'none' }}
                  >
                    {activeMessage.email}
                  </a>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace' }}>
                  {new Date(activeMessage.date).toLocaleString()}
                </span>
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', marginTop: '10px' }}>
                <strong style={{ fontSize: '0.8125rem', color: '#0F172A' }}>Subject: </strong>
                <span style={{ fontSize: '0.875rem', color: '#475569' }}>{activeMessage.subject}</span>
              </div>
            </div>

            <div>
              <label className="admin-form-label">Message Content:</label>
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                color: '#334155',
                whiteSpace: 'pre-wrap',
                marginTop: '6px',
              }}>
                {activeMessage.message}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <a
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject)}`}
                className="admin-btn admin-btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Reply via Email
              </a>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setActiveMessage(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingMessage)}
        onClose={() => setDeletingMessage(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Inquiry"
        message={`Are you sure you want to permanently delete the message from "${deletingMessage?.name}"?`}
        confirmLabel="Delete Message"
      />
    </AdminLayout>
  );
};

export default ManageMessages;
