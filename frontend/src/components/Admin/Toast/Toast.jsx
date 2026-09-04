import React, { useState, useEffect } from 'react';
import { CheckIcon } from '../../Icons/Icons';

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="admin-toast-container" role="status">
      <div className={`admin-toast toast-${type}`}>
        <span className="toast-icon-wrapper">
          {type === 'success' ? <CheckIcon size={16} /> : '!'}
        </span>
        <span className="toast-message-text">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
