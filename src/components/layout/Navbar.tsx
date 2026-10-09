import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import styles from './Navbar.module.css';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { User as UserIcon, ChevronDown, Shield, Menu, X } from 'lucide-react';
import { trackUserSignIn } from '../../services/adminService';
import { isUserAdmin } from '../../config/admin';
import { AuthModal } from '../auth/AuthModal';

export function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        trackUserSignIn(currentUser);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  const isActive = (path: string) => {
    return location.pathname === path ? styles.active : '';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={styles.navbarWrapper}>
      <nav className={`container ${styles.navbar}`}>
        <div className={styles.navContainer}>
          <Link to={isAdminPage ? "/admin" : "/"} className={styles.logo}>
            CareerForge {isAdminPage && (
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                padding: '2px 8px', 
                borderRadius: '4px', 
                background: 'rgba(255, 126, 95, 0.15)', 
                color: 'var(--color-primary)', 
                border: '1px solid rgba(255, 126, 95, 0.3)', 
                verticalAlign: 'middle', 
                marginLeft: '8px' 
              }}>
                ADMIN PORTAL
              </span>
            )}
          </Link>
          {!isAdminPage && (
            <div className={styles.navLinks}>
              <Link to="/" className={`${styles.navLink} ${isActive('/')}`}>Home</Link>
              <Link to="/resume-builder" className={`${styles.navLink} ${isActive('/resume-builder')}`}>Resume Builder</Link>
              <Link to="/templates" className={`${styles.navLink} ${isActive('/templates')}`}>Templates</Link>
              <Link to="/career-guidance" className={`${styles.navLink} ${isActive('/career-guidance')}`}>Career Guidance</Link>
              <Link to="/#feedback" className={styles.navLink}>Feedback</Link>
            </div>
          )}
          <div className={styles.navActions}>
            {isAdminPage && (
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.875rem' }}>
                  Exit to User App →
                </Button>
              </Link>
            )}
            {user ? (
              <div style={{ position: 'relative' }}>
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <UserIcon size={20} />
                  <ChevronDown size={16} />
                </div>
                
                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    background: 'var(--color-surface-elevation)',
                    border: '1px solid var(--color-structural-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0',
                    minWidth: '240px',
                    boxShadow: 'var(--shadow-structural)',
                    zIndex: 50,
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '1rem 1.25rem', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', borderBottom: '1px solid var(--color-structural-border)' }}>
                      {user.displayName || user.email || 'User'}
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                      <Link 
                        to="/my-resumes" 
                        style={{ display: 'block', padding: '0.75rem 0.75rem', fontSize: '1rem', fontWeight: 500, color: 'var(--color-text)', textDecoration: 'none', borderRadius: 'var(--radius-sm)' }}
                        onClick={() => { setIsDropdownOpen(false); closeMobileMenu(); }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; e.currentTarget.style.color = 'var(--color-text-main)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text)'; }}
                      >
                        My Resumes
                      </Link>
                      {isUserAdmin(user.email) && (
                        <Link 
                          to="/admin" 
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0.75rem', fontSize: '1rem', fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none', borderRadius: 'var(--radius-sm)' }}
                          onClick={() => { setIsDropdownOpen(false); closeMobileMenu(); }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Shield size={16} />
                          Admin Dashboard
                        </Link>
                      )}
                      <div 
                        onClick={() => { handleLogout(); closeMobileMenu(); }}
                        style={{ display: 'block', padding: '0.75rem 0.75rem', fontSize: '1rem', fontWeight: 500, color: 'var(--color-text)', cursor: 'pointer', borderRadius: 'var(--radius-sm)', marginTop: '0.25rem' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; e.currentTarget.style.color = 'var(--color-error)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text)'; }}
                      >
                        Sign Out
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="primary" onClick={() => { handleLogin(); closeMobileMenu(); }} style={{ padding: '0.5rem 1.25rem', fontSize: '0.9375rem' }}>
                Sign In
              </Button>
            )}
            
            {!isAdminPage && (
              <button 
                className={styles.mobileMenuBtn} 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {!isAdminPage && isMobileMenuOpen && (
          <div className={styles.mobileNav}>
            <Link to="/" className={`${styles.mobileNavLink} ${isActive('/')}`} onClick={closeMobileMenu}>Home</Link>
            <Link to="/resume-builder" className={`${styles.mobileNavLink} ${isActive('/resume-builder')}`} onClick={closeMobileMenu}>Resume Builder</Link>
            <Link to="/templates" className={`${styles.mobileNavLink} ${isActive('/templates')}`} onClick={closeMobileMenu}>Templates</Link>
            <Link to="/career-guidance" className={`${styles.mobileNavLink} ${isActive('/career-guidance')}`} onClick={closeMobileMenu}>Career Guidance</Link>
            <Link to="/#feedback" className={styles.mobileNavLink} onClick={closeMobileMenu}>Feedback</Link>
          </div>
        )}
      </nav>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
