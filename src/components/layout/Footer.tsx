import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return (
      <footer style={{ borderTop: '1px solid var(--color-structural-border)', padding: '1.5rem 0', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>CareerForge Admin Console &bull; Internal Control System</span>
          <Link to="/" style={{ color: 'var(--color-secondary)' }}>
            &larr; Exit to User Website
          </Link>
        </div>
      </footer>
    );
  }
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContainer}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>CareerForge</Link>
            <p className={styles.tagline}>Create a professional resume and explore career paths based on your interests, skills, and education.</p>
          </div>
          
          <div className={styles.linksContainer}>
            <div className={styles.linkGroup}>
              <span className={styles.linkGroupTitle}>Platform</span>
              <Link to="/resume-builder" className={styles.link}>Resume Builder</Link>
              <Link to="/templates" className={styles.link}>Templates</Link>
              <Link to="/career-guidance" className={styles.link}>Career Guidance</Link>
            </div>
          </div>
        </div>
        
        <div className={styles.bottomBar}>
          <span>&copy; {new Date().getFullYear()} CareerForge. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
