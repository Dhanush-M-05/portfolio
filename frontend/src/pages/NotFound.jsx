import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '../components/Icons/Icons';
import Button from '../components/Button/Button';

export const NotFound = () => {
  return (
    <main className="not-found-page container" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'var(--navbar-height)' }}>
      <div className="custom-glass-card has-gradient-border" style={{ textAlign: 'center', maxWidth: '560px', padding: '56px 36px' }}>
        <span className="gradient-text" style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1, display: 'block', marginBottom: '16px' }}>
          404
        </span>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '12px' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
          The page you are looking for might have been moved or does not exist in this portfolio.
        </p>
        <Button to="/" variant="primary" size="lg" icon={ArrowRightIcon}>
          Return to Homepage
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
