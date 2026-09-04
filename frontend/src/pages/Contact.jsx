import React, { useEffect } from 'react';
import ContactSection from '../sections/Contact/ContactSection';

export const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="contact-page-wrapper" style={{ paddingTop: 'calc(var(--navbar-height) + 30px)' }}>
      <ContactSection />
    </main>
  );
};

export default Contact;
