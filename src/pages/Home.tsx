import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import styles from './Home.module.css';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { trackFeedbackSubmission } from '../services/adminService';

export function Home() {
  const [feedbackState, setFeedbackState] = useState<'idle' | 'submitted'>('idle');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  }, [location]);

  return (
    <div className="container">
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={`${styles.heroLeft} animate-fade-in-up stagger-1`}>
          <h1 className={styles.heroHeadline}>Build Your Resume.<br/>Plan Your Career.</h1>
          <p className={styles.heroText}>
            Create a professional resume and explore career paths based on your interests, skills, and education.
          </p>
          <div className={`${styles.heroButtons} animate-fade-in-up stagger-2`}>
            <Link to="/resume-builder">
              <Button variant="primary">Build My Resume</Button>
            </Link>
            <Link to="/career-guidance">
              <Button variant="secondary">Explore Careers</Button>
            </Link>
          </div>
        </div>
        <div className={`${styles.heroRight} animate-fade-in-up stagger-3`}>
          <div className={styles.floatingCardsContainer}>
            <div className={`${styles.floatingCard} ${styles.card1}`}>
              <div className={styles.cardGlow}></div>
              <div className={styles.cardHeader}>
                <div className={styles.circleAvatar}></div>
                <div>
                  <div className={styles.skeletonLine} style={{width: '80px', height: '12px', marginBottom: '6px'}}></div>
                  <div className={styles.skeletonLine} style={{width: '120px', height: '8px'}}></div>
                </div>
              </div>
              <div className={styles.skeletonLine} style={{width: '100%', marginTop: '1rem'}}></div>
              <div className={styles.skeletonLine} style={{width: '85%'}}></div>
              <div className={styles.skeletonLine} style={{width: '60%'}}></div>
            </div>
            
            <div className={`${styles.floatingCard} ${styles.card2}`}>
              <div className={styles.cardGlow}></div>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-primary)' }}>Career Match</h4>
              <div className={styles.skeletonBlock}></div>
              <div className={styles.skeletonBlock} style={{opacity: 0.6}}></div>
            </div>

            <div className={`${styles.floatingCard} ${styles.card3}`}>
              <div className={styles.cardGlow}></div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                 <div className={styles.tag}>React</div>
                 <div className={styles.tag}>Node.js</div>
              </div>
              <div className={styles.skeletonLine} style={{width: '100%'}}></div>
              <div className={styles.skeletonLine} style={{width: '40%'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.section}>
        <h2 className={`${styles.sectionTitle} animate-fade-in-up stagger-1`}>Everything You Need</h2>
        <div className={styles.featuresGrid}>
          <div className="animate-fade-in-up stagger-2 hover-lift">
            <Card>
              <h3 style={{ marginBottom: '1rem' }}>Resume Builder</h3>
              <p>Create a standout resume tailored for internships and early-career opportunities with live previews and professional formatting.</p>
            </Card>
          </div>
          <div className="animate-fade-in-up stagger-3 hover-lift">
            <Card>
              <h3 style={{ marginBottom: '1rem' }}>Career Guidance</h3>
              <p>Enter your interests, skills, and education to get personalized career recommendations and an actionable roadmap.</p>
            </Card>
          </div>
          <div className="animate-fade-in-up stagger-4 hover-lift">
            <Card>
              <h3 style={{ marginBottom: '1rem' }}>Resume Templates</h3>
              <p>Choose from beautifully crafted templates designed specifically for engineering, tech, and business roles.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* RESUME BUILDER PREVIEW */}
      <section className={styles.section}>
        <div style={{ display: 'flex', gap: 'var(--space-2xl)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '350px' }} className="animate-fade-in-up stagger-1">
            <h2 className={styles.sectionTitle} style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Create a Resume You're Proud Of</h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
              Our editor breaks down the process into simple sections. Fill in your education, projects, and skills, and see your resume update in real-time.
            </p>
            <Link to="/resume-builder">
              <Button variant="primary" className="hover-lift hover-glow">Start Building</Button>
            </Link>
          </div>
          <div style={{ flex: 1, minWidth: '350px', display: 'flex', justifyContent: 'center' }} className="animate-fade-in-up stagger-3">
             <div className="glass-panel hover-lift" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
               <div style={{ textAlign: 'center', borderBottom: '1px solid var(--color-structural-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                 <h3 style={{ margin: 0, fontSize: '2rem' }}>Aarav Sharma</h3>
                 <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', margin: '0.5rem 0 0 0' }}>aarav.sharma@gmail.com • Pune, Maharashtra</p>
               </div>
               <div style={{ marginBottom: '1.5rem' }}>
                 <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Experience</h4>
                 <div style={{ fontWeight: 500, fontSize: '1.125rem', color: 'var(--color-text-main)' }}>Software Intern — TechCorp</div>
                 <div style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>Built a React dashboard increasing efficiency by 20%.</div>
               </div>
               <div>
                 <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Skills</h4>
                 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                   <span style={{ border: '1px solid var(--color-structural-border)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.875rem' }}>React</span>
                   <span style={{ border: '1px solid var(--color-structural-border)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.875rem' }}>TypeScript</span>
                   <span style={{ border: '1px solid var(--color-structural-border)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.875rem' }}>Node.js</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* CAREER GUIDANCE SECTION */}
      <section className={styles.section}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-fade-in-up stagger-1">
          <h2 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>Not Sure What Career to Choose?</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto' }}>
            Discover career paths that match your academic background and personal interests.
          </p>
        </div>

        <div className={styles.careerCards}>
          <div className="animate-fade-in-up stagger-2 hover-lift">
            <Card>
              <h3 style={{ marginBottom: '0.5rem' }}>Software Engineer</h3>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Design, develop, and maintain software applications and systems.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ border: '1px solid var(--color-structural-border)', color: 'var(--color-text-muted)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.875rem' }}>Python</span>
              <span style={{ border: '1px solid var(--color-structural-border)', color: 'var(--color-text-muted)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.875rem' }}>Algorithms</span>
            </div>
            </Card>
          </div>
          <div className="animate-fade-in-up stagger-3 hover-lift">
            <Card>
              <h3 style={{ marginBottom: '0.5rem' }}>Data Scientist</h3>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Analyze and interpret complex data to help organizations make better decisions.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ border: '1px solid var(--color-structural-border)', color: 'var(--color-text-muted)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.875rem' }}>Statistics</span>
              <span style={{ border: '1px solid var(--color-structural-border)', color: 'var(--color-text-muted)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.875rem' }}>ML</span>
            </div>
            </Card>
          </div>
          <div className="animate-fade-in-up stagger-4 hover-lift">
            <Card>
              <h3 style={{ marginBottom: '0.5rem' }}>UI/UX Designer</h3>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Focus on the user experience and interface design of digital products.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ border: '1px solid var(--color-structural-border)', color: 'var(--color-text-muted)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.875rem' }}>Figma</span>
              <span style={{ border: '1px solid var(--color-structural-border)', color: 'var(--color-text-muted)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.875rem' }}>Wireframing</span>
            </div>
            </Card>
          </div>
        </div>
        <div style={{ textAlign: 'center' }} className="animate-fade-in-up stagger-5">
          <Link to="/career-guidance">
            <Button variant="secondary">Explore Career Paths</Button>
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.section}>
        <h2 className={`${styles.sectionTitle} animate-fade-in-up stagger-1`}>How It Works</h2>
        <div className={styles.stepsGrid}>
          <div className="animate-fade-in-up stagger-2">
            <span className={styles.stepNumber}>01 — Tell Us</span>
            <p className={styles.stepText}>Input your academic stream, skills, and personal interests into our simple form.</p>
          </div>
          <div className="animate-fade-in-up stagger-3">
            <span className={styles.stepNumber}>02 — Explore</span>
            <p className={styles.stepText}>Use the Resume Builder to craft your profile or discover matching careers.</p>
          </div>
          <div className="animate-fade-in-up stagger-4">
            <span className={styles.stepNumber}>03 — Next Step</span>
            <p className={styles.stepText}>Download your polished resume as a PDF and follow your career roadmap.</p>
          </div>
        </div>
      </section>

      {/* FEEDBACK SECTION */}
      <section id="feedback" className={styles.section} style={{ textAlign: 'center', position: 'relative' }}>
        
        <h2 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>We Value Your Voice</h2>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          Your insights help us shape the future of CareerForge. Drop a thought, rate your experience, or suggest a brilliant new feature.
        </p>
        
        <div className={styles.feedbackSection}>
          {feedbackState === 'submitted' ? (
            <div className="glass-panel animate-fade-in-up" style={{ padding: '3rem', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
              <h3 style={{ color: 'var(--color-success)', marginBottom: '1rem', fontSize: '2rem' }}>Thank You!</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>Your feedback fuels our innovation. We appreciate you taking the time to share your thoughts.</p>
              <Button variant="ghost" onClick={() => { setFeedbackState('idle'); setRating(0); }} style={{ padding: '0.75rem 2rem' }}>Submit Another</Button>
            </div>
          ) : (
            <div className="glass-panel animate-fade-in-up" style={{ padding: '3rem', borderRadius: 'var(--radius-xl)', textAlign: 'left', position: 'relative', overflow: 'visible' }}>
              <form 
                className={styles.feedbackForm}
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  
                  try {
                    const feedbackName = (formData.get('name') as string) || (currentUser ? (currentUser.displayName || 'User') : 'Anonymous');
                    const feedbackEmail = (currentUser ? currentUser.email : (formData.get('email') as string)) || 'No email';
                    const feedbackMessage = (formData.get('message') as string) || '';
                    const fullMessage = rating > 0 ? `[Rating: ${rating}/5] ${feedbackMessage}` : feedbackMessage;

                    await trackFeedbackSubmission({
                      name: feedbackName,
                      email: feedbackEmail,
                      message: fullMessage,
                      userId: currentUser?.uid
                    });
                    setFeedbackState('submitted');
                    form.reset();
                  } catch (err) {
                    console.error("Error submitting feedback", err);
                    alert("Failed to submit feedback. Please try again.");
                  }
                }}
              >
                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                  <label style={{ display: 'block', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '1rem' }}>How would you rate your experience?</label>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '2.5rem',
                          color: (hoverRating || rating) >= star ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                          transform: (hoverRating || rating) >= star ? 'scale(1.1)' : 'scale(1)',
                          textShadow: (hoverRating || rating) >= star ? '0 0 15px rgba(212, 175, 55, 0.5)' : 'none'
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {!currentUser && (
                  <div>
                    <input name="email" type="email" placeholder="Your Email Address" className={styles.feedbackInput} required />
                  </div>
                )}
                
                <div style={{ position: 'relative' }}>
                  <textarea 
                    name="message"
                    placeholder="Tell us what you loved, or what could be better..." 
                    required 
                    className={styles.feedbackInput} 
                    rows={5} 
                  />
                  <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', opacity: 0.5, pointerEvents: 'none' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                </div>
                
                <Button variant="primary" style={{ padding: '1.2rem', fontSize: '1.15rem', borderRadius: '12px', marginTop: '1rem', fontWeight: 600, letterSpacing: '1px' }} type="submit">
                  Send Feedback 🚀
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
