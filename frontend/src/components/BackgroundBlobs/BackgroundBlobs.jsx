import React from 'react';
import './BackgroundBlobs.css';

export const BackgroundBlobs = () => {
  return (
    <div className="ambient-background-container" aria-hidden="true">
      <div className="ambient-blob blob-1" />
      <div className="ambient-blob blob-2" />
      <div className="ambient-blob blob-3" />
      <div className="ambient-blob blob-4" />
      <div className="ambient-glass-ring ring-1" />
      <div className="ambient-glass-ring ring-2" />
      <div className="ambient-grid-overlay" />
    </div>
  );
};

export default BackgroundBlobs;
