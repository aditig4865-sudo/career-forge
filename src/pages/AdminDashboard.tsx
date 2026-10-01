import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  FileText, 
  Compass, 
  Activity, 
  Shield, 
  Lock, 
  Eye, 
  Download, 
  RefreshCw, 
  Search, 
  Clock, 
  Calendar, 
  Mail, 
  X, 
  LogOut, 
  KeyRound, 
  CheckCircle2, 
  Briefcase,
  GraduationCap,
  MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import styles from './AdminDashboard.module.css';
import { 
  ADMIN_CONFIG, 
  isAdminAuthenticated, 
  setAdminAuthenticated,
  isUserAdmin
} from '../config/admin';
import { auth } from '../config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  fetchAllUsers, 
  fetchAllResumes, 
  fetchAllCareerSessions, 
  fetchAllActivityLogs,
  fetchAllFeedback,
  AdminUser,
  AdminResume,
  AdminCareerSession,
  AdminActivityLog,
  AdminFeedback
} from '../services/adminService';
import { useReactToPrint } from 'react-to-print';
import { ResumeContext, TemplateId } from '../context/ResumeContext';
import { ClassicTemplate } from '../components/resume/templates/ClassicTemplate';
import { ModernTemplate } from '../components/resume/templates/ModernTemplate';
import { ProfessionalTemplate } from '../components/resume/templates/ProfessionalTemplate';
import { StandardTemplate } from '../components/resume/templates/StandardTemplate';
import { CreativeTemplate } from '../components/resume/templates/CreativeTemplate';
import { ElegantTemplate } from '../components/resume/templates/ElegantTemplate';
import { MinimalTemplate } from '../components/resume/templates/MinimalTemplate';
import { TechTemplate } from '../components/resume/templates/TechTemplate';

export function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Data States
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [resumes, setResumes] = useState<AdminResume[]>([]);
  const [careerSessions, setCareerSessions] = useState<AdminCareerSession[]>([]);
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  // UI States
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'resumes' | 'career' | 'feedback' | 'logs'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | '7d' | '10d' | '30d' | 'year'>('all');
  
  // Modals
  const [previewResume, setPreviewResume] = useState<AdminResume | null>(null);
  const [previewCareer, setPreviewCareer] = useState<AdminCareerSession | null>(null);
  const [previewUser, setPreviewUser] = useState<AdminUser | null>(null);

  // Printing
  const [printData, setPrintData] = useState<AdminResume | null>(null);
  const resumePrintRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: resumePrintRef,
    documentTitle: printData?.data?.personalInfo?.fullName || printData?.name || 'Resume',
    onAfterPrint: () => setPrintData(null),
  });

  useEffect(() => {
    if (printData) {
      handlePrint();
    }
  }, [printData, handlePrint]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [usersData, resumesData, careerData, logsData, feedbackData] = await Promise.all([
        fetchAllUsers(),
        fetchAllResumes(),
        fetchAllCareerSessions(),
        fetchAllActivityLogs(),
        fetchAllFeedback()
      ]);

      setUsers(usersData);
      setResumes(resumesData);
      setCareerSessions(careerData);
      setLogs(logsData);
      setFeedbacks(feedbackData);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated()) {
      setAuthorized(true);
      loadDashboardData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === ADMIN_CONFIG.MASTER_PASSCODE) {
      setAdminAuthenticated(true);
      setAuthorized(true);
      setAuthError('');
      loadDashboardData();
    } else {
      setAuthError('Incorrect passcode. Please enter the valid admin passcode.');
    }
  };

  const handleLock = () => {
    setAdminAuthenticated(false);
    setAuthorized(false);
    setPasscodeInput('');
  };

  // Helper date formatter
  const formatDate = (timestamp?: string | number) => {
    if (!timestamp) return 'N/A';
    const dateObj = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
    return dateObj.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isWithinTimeFilter = (timestamp?: string | number) => {
    if (timeFilter === 'all' || !timestamp) return true;
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (timeFilter === '7d') return diffDays <= 7;
    if (timeFilter === '10d') return diffDays <= 10;
    if (timeFilter === '30d') return diffDays <= 30;
    if (timeFilter === 'year') return diffDays <= 365;
    return true;
  };

  // Filtered Data (by search and time)
  const displayUsers = users.filter(u => isWithinTimeFilter(u.createdAt));
  const displayResumes = resumes.filter(r => isWithinTimeFilter(r.createdAt || r.updatedAt));
  const displayCareer = careerSessions.filter(c => isWithinTimeFilter(c.createdAt));
  const displayFeedbacks = feedbacks.filter(f => isWithinTimeFilter(f.timestamp));
  const displayLogs = logs.filter(l => isWithinTimeFilter(l.timestamp));

  // Search Filtered Lists
  const filteredUsers = displayUsers.filter(u => 
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResumes = displayResumes.filter(r =>
    r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.template?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCareer = displayCareer.filter(c => 
    c.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.profile?.educationLevel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.profile?.stream?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.profile?.interests?.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredFeedback = displayFeedbacks.filter(f =>
    f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Authentication Gate View
  if (!authChecked) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!currentUser || !isUserAdmin(currentUser.email)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', textAlign: 'center', padding: '2rem' }}>
        <Shield size={64} color="var(--color-error)" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2rem', color: 'var(--color-text-main)', marginBottom: '1rem' }}>Access Denied</h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', lineHeight: '1.6' }}>
          You do not have permission to view the Admin Dashboard. If you believe this is an error, please contact the system administrator.
        </p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div className={styles.authGateWrapper}>
          <div className={styles.authIconWrapper}>
            <Shield size={36} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>
            Admin Access Portal
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
            Enter your admin credentials to view user registrations, saved resumes, and career guidance sessions.
          </p>

          <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ position: 'relative', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Master Admin Passcode
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input 
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => { setPasscodeInput(e.target.value); setAuthError(''); }}
                  placeholder="Enter passcode (default: admin2024)"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    background: 'var(--color-bg-base)',
                    border: authError ? '1px solid var(--color-error)' : '1px solid var(--color-structural-border)',
                    borderRadius: 'var(--radius-base)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  autoFocus
                />
              </div>
              {authError && (
                <div style={{ color: '#ef4444', fontSize: '0.8125rem', marginTop: '0.5rem' }}>
                  {authError}
                </div>
              )}
            </div>

            <Button type="submit" variant="primary" style={{ width: '100%', padding: '0.875rem', fontWeight: 600 }}>
              <Lock size={16} style={{ marginRight: '6px' }} /> Unlock Admin Dashboard
            </Button>
          </form>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-structural-border)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            Note: Default passcode is <code style={{ color: 'var(--color-secondary)', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>admin2024</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.adminContainer}`}>
      {/* Header */}
      <div className={styles.headerSection}>
        <div>
          <div className={styles.badgeLive}>
            <span className={styles.badgePulse}></span> Live Admin Telemetry
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', margin: 0 }}>
            Monitor real-time user activity, inspect generated resumes, and view student career guidance reports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button 
            variant="secondary" 
            onClick={loadDashboardData} 
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> 
            {isLoading ? 'Syncing...' : 'Refresh'}
          </Button>

          <Button 
            variant="secondary" 
            onClick={handleLock}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171' }}
          >
            <LogOut size={16} /> Exit Admin
          </Button>
        </div>
      </div>

      {/* Time Filter & Metric Cards */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={16} color="var(--color-text-muted)" />
        <select 
          value={timeFilter} 
          onChange={(e) => setTimeFilter(e.target.value as any)}
          style={{
            background: 'var(--color-surface-elevation)',
            color: 'var(--color-text-main)',
            border: '1px solid var(--color-structural-border)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Time</option>
          <option value="7d">Last 7 Days</option>
          <option value="10d">Last 10 Days</option>
          <option value="30d">Last 30 Days (Month)</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
            <Users size={26} />
          </div>
          <div>
            <div className={styles.statValue}>{displayUsers.length}</div>
            <div className={styles.statLabel}>Signed-In Users</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(255, 126, 95, 0.15)', color: '#FF7E5F' }}>
            <FileText size={26} />
          </div>
          <div>
            <div className={styles.statValue}>{displayResumes.length}</div>
            <div className={styles.statLabel}>Resumes Created</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
            <Compass size={26} />
          </div>
          <div>
            <div className={styles.statValue}>{displayCareer.length}</div>
            <div className={styles.statLabel}>Career Guidances</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <MessageSquare size={26} />
          </div>
          <div>
            <div className={styles.statValue}>{displayFeedbacks.length}</div>
            <div className={styles.statLabel}>User Feedbacks</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>
            <Activity size={26} />
          </div>
          <div>
            <div className={styles.statValue}>{displayLogs.length}</div>
            <div className={styles.statLabel}>Platform Activities</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsNav}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={18} /> Overview
        </button>

        <button 
          className={`${styles.tabButton} ${activeTab === 'users' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} /> Users <span className={styles.tabCount}>{users.length}</span>
        </button>

        <button 
          className={`${styles.tabButton} ${activeTab === 'resumes' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('resumes')}
        >
          <FileText size={18} /> Resumes <span className={styles.tabCount}>{resumes.length}</span>
        </button>

        <button 
          className={`${styles.tabButton} ${activeTab === 'career' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('career')}
        >
          <Compass size={18} /> Career Guidance <span className={styles.tabCount}>{careerSessions.length}</span>
        </button>

        <button 
          className={`${styles.tabButton} ${activeTab === 'feedback' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          <MessageSquare size={18} /> Feedback <span className={styles.tabCount}>{feedbacks.length}</span>
        </button>

        <button 
          className={`${styles.tabButton} ${activeTab === 'logs' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <Clock size={18} /> Live Logs <span className={styles.tabCount}>{logs.length}</span>
        </button>
      </div>

      {/* Search Bar for list tabs */}
      {activeTab !== 'overview' && activeTab !== 'logs' && (
        <div className={styles.searchBar}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <Button variant="ghost" onClick={() => setSearchQuery('')} style={{ fontSize: '0.875rem' }}>
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Quick grid: Recent Resumes & Recent Career Sessions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
            {/* Recent Resumes Card */}
            <Card style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={20} color="var(--color-primary)" /> Recent Resumes
                </h3>
                <Button variant="ghost" onClick={() => setActiveTab('resumes')} style={{ fontSize: '0.875rem', padding: '4px 8px' }}>
                  View All ({resumes.length}) →
                </Button>
              </div>

              {resumes.length === 0 ? (
                <div style={{ color: 'var(--color-text-muted)', padding: '2rem 0', textAlign: 'center' }}>
                  No resumes recorded yet. When users build a resume, it will appear here.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {resumes.slice(0, 5).map((r) => (
                    <div 
                      key={r.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.875rem 1rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--color-structural-border)',
                        borderRadius: 'var(--radius-base)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text-main)' }}>{r.name}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                          by {r.userName} ({r.userEmail}) • {formatDate(r.updatedAt)}
                        </div>
                      </div>
                      <Button variant="secondary" onClick={() => setPreviewResume(r)} style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
                        <Eye size={14} style={{ marginRight: '4px' }} /> View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Career Queries Card */}
            <Card style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Compass size={20} color="#c084fc" /> Recent Career Guidance
                </h3>
                <Button variant="ghost" onClick={() => setActiveTab('career')} style={{ fontSize: '0.875rem', padding: '4px 8px' }}>
                  View All ({careerSessions.length}) →
                </Button>
              </div>

              {careerSessions.length === 0 ? (
                <div style={{ color: 'var(--color-text-muted)', padding: '2rem 0', textAlign: 'center' }}>
                  No career guidance sessions yet. Student queries will be logged here.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {careerSessions.slice(0, 5).map((c) => (
                    <div 
                      key={c.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.875rem 1rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--color-structural-border)',
                        borderRadius: 'var(--radius-base)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text-main)' }}>
                          {c.profile?.educationLevel} ({c.profile?.stream || 'General'})
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                          User: {c.userName} • {formatDate(c.createdAt)}
                        </div>
                      </div>
                      <Button variant="secondary" onClick={() => setPreviewCareer(c)} style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
                        <Eye size={14} style={{ marginRight: '4px' }} /> Report
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Feedback Card */}
            <Card style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={20} color="#fbbf24" /> Recent User Feedback
                </h3>
                <Button variant="ghost" onClick={() => setActiveTab('feedback')} style={{ fontSize: '0.875rem', padding: '4px 8px' }}>
                  View All ({feedbacks.length}) →
                </Button>
              </div>

              {feedbacks.length === 0 ? (
                <div style={{ color: 'var(--color-text-muted)', padding: '1.5rem 0', textAlign: 'center' }}>
                  No feedback received yet. User comments submitted on the home page will appear here.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                  {feedbacks.slice(0, 3).map((f) => (
                    <div 
                      key={f.id}
                      style={{
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--color-structural-border)',
                        borderLeft: '3px solid #fbbf24',
                        borderRadius: 'var(--radius-base)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text-main)' }}>{f.name}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{formatDate(f.timestamp)}</span>
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{f.email}</div>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-main)', fontStyle: 'italic', lineHeight: 1.5 }}>
                          "{f.message}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Activity Stream Section */}
          <Card style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="#4ade80" /> Recent Live Platform Events
            </h3>
            {logs.length === 0 ? (
              <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '1.5rem' }}>
                No events recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {logs.slice(0, 8).map((log) => (
                  <div 
                    key={log.id} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255, 255, 255, 0.015)',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: '3px solid var(--color-primary)'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-main)', marginRight: '8px' }}>{log.title}</span>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{log.details}</span>
                    </div>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 2: USERS */}
      {activeTab === 'users' && (
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const userResumes = resumes.filter(r => r.userId === u.uid);
                  const userCareers = careerSessions.filter(c => c.userId === u.uid);
                  return (
                    <tr key={u.uid}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            color: '#121212',
                            fontSize: '0.875rem'
                          }}>
                            {u.displayName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{u.displayName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ID: {u.uid.substring(0, 10)}...</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={14} color="var(--color-text-muted)" /> {u.email}
                        </div>
                      </td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td>{formatDate(u.lastLogin)}</td>
                      <td>
                        <Button 
                          variant="secondary" 
                          onClick={() => setPreviewUser(u)}
                          style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
                        >
                          View Content ({userResumes.length} resumes, {userCareers.length} queries)
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: RESUMES */}
      {activeTab === 'resumes' && (
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Resume Title</th>
                <th>Created By</th>
                <th>Template</th>
                <th>Last Modified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResumes.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    No resumes found.
                  </td>
                </tr>
              ) : (
                filteredResumes.map((r) => {
                  let tagClass = styles.tagClassic;
                  if (r.template === 'modern') tagClass = styles.tagModern;
                  if (r.template === 'professional') tagClass = styles.tagProfessional;
                  if (r.template === 'standard') tagClass = styles.tagStandard;

                  return (
                    <tr key={r.id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-main)' }}>{r.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Candidate: {r.data?.personalInfo?.fullName || 'Not specified'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{r.userName}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{r.userEmail}</div>
                      </td>
                      <td>
                        <span className={`${styles.tag} ${tagClass}`}>
                          {r.template || 'classic'}
                        </span>
                      </td>
                      <td>{formatDate(r.updatedAt)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button 
                            variant="secondary" 
                            onClick={() => setPreviewResume(r)}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.8125rem' }}
                          >
                            <Eye size={14} /> View
                          </Button>
                          <Button 
                            variant="secondary" 
                            onClick={() => setPrintData(r)}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.8125rem' }}
                          >
                            <Download size={14} /> PDF
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: CAREER GUIDANCE */}
      {activeTab === 'career' && (
        <div className={styles.cardGrid}>
          {filteredCareer.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
              No career guidance records found.
            </div>
          ) : (
            filteredCareer.map((c) => (
              <div key={c.id} className={styles.careerCard}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                      {formatDate(c.createdAt)}
                    </span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(168, 85, 247, 0.15)', 
                      color: '#c084fc', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      fontWeight: 600 
                    }}>
                      {c.profile?.educationLevel}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--color-text-main)' }}>
                    {c.userName}
                  </h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                    {c.userEmail}
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>
                      Stream / Specialization:
                    </div>
                    <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
                      {c.profile?.stream || 'General / Not specified'}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>
                      Interests:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {c.profile?.interests?.map((interest, idx) => (
                        <span key={idx} className={styles.interestChip}>{interest}</span>
                      ))}
                    </div>
                  </div>

                  {c.profile?.question && (
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.03)', 
                      padding: '0.75rem', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '0.8125rem', 
                      color: 'var(--color-text-muted)',
                      fontStyle: 'italic',
                      marginBottom: '1rem' 
                    }}>
                      "{c.profile.question}"
                    </div>
                  )}
                </div>

                <Button 
                  variant="primary" 
                  onClick={() => setPreviewCareer(c)} 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Eye size={16} /> View AI Career Guidance Report
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 5: USER FEEDBACK */}
      {activeTab === 'feedback' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredFeedback.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)', background: 'var(--color-surface-elevation)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-structural-border)' }}>
              No feedback messages found matching your criteria.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.25rem' }}>
              {filteredFeedback.map((fb) => {
                const isRegisteredUser = Boolean(fb.userId && fb.userId !== 'guest');
                const userRecord = users.find(u => u.uid === fb.userId || u.email?.toLowerCase() === fb.email?.toLowerCase());

                return (
                  <div key={fb.id} className={styles.feedbackCard}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: isRegisteredUser 
                              ? 'linear-gradient(135deg, #10B981, #059669)'
                              : 'linear-gradient(135deg, #6B7280, #4B5563)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '1rem'
                          }}>
                            {fb.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-main)' }}>
                              {fb.name}
                            </div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                              {fb.email}
                            </div>
                          </div>
                        </div>

                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: isRegisteredUser ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                          color: isRegisteredUser ? '#34d399' : 'var(--color-text-muted)',
                          border: isRegisteredUser ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--color-structural-border)'
                        }}>
                          {isRegisteredUser ? 'Registered User' : 'Visitor / Guest'}
                        </span>
                      </div>

                      {/* Message Content */}
                      <div className={styles.feedbackMessage}>
                        "{fb.message}"
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--color-structural-border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Submitted: {formatDate(fb.timestamp)}
                      </span>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {fb.email && fb.email !== 'No email' && (
                          <a 
                            href={`mailto:${fb.email}?subject=Thank you for your CareerForge feedback`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(255, 126, 95, 0.15)',
                              color: 'var(--color-primary)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            <Mail size={12} /> Reply
                          </a>
                        )}

                        {userRecord && (
                          <Button 
                            variant="secondary" 
                            onClick={() => setPreviewUser(userRecord)}
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          >
                            View User
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: LIVE LOGS */}
      {activeTab === 'logs' && (
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    No activity logs recorded.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                      {formatDate(log.timestamp)}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{log.userName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{log.userEmail}</div>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '3px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: 'rgba(255, 126, 95, 0.15)',
                        color: 'var(--color-primary)'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-main)' }}>{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL 1: RESUME PREVIEW */}
      {previewResume && (
        <div className={styles.modalBackdrop} onClick={() => setPreviewResume(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-structural-border)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text-main)' }}>{previewResume.name}</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
                  Created by <strong>{previewResume.userName}</strong> ({previewResume.userEmail}) • Template: {previewResume.template}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="primary" onClick={() => setPrintData(previewResume)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Download size={16} /> Download PDF
                </Button>
                <Button variant="ghost" onClick={() => setPreviewResume(null)}>
                  <X size={20} />
                </Button>
              </div>
            </div>

            {/* Resume Live Render */}
            <div style={{ background: '#ffffff', color: '#111827', borderRadius: 'var(--radius-base)', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
              <ResumeContext.Provider value={{
                data: previewResume.data,
                templateData: previewResume.data,
                updateData: () => {},
                selectedTemplate: (previewResume.template as TemplateId) || 'classic',
                setTemplate: () => {}
              }}>
                <div style={{ width: '100%', maxWidth: '794px', margin: '0 auto' }}>
                  {previewResume.template === 'classic' && <ClassicTemplate />}
                  {previewResume.template === 'modern' && <ModernTemplate />}
                  {previewResume.template === 'professional' && <ProfessionalTemplate />}
                  {previewResume.template === 'standard' && <StandardTemplate />}
                  {previewResume.template === 'creative' && <CreativeTemplate />}
                  {previewResume.template === 'elegant' && <ElegantTemplate />}
                  {previewResume.template === 'minimal' && <MinimalTemplate />}
                  {previewResume.template === 'tech' && <TechTemplate />}
                </div>
              </ResumeContext.Provider>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CAREER GUIDANCE DETAILS */}
      {previewCareer && (
        <div className={styles.modalBackdrop} onClick={() => setPreviewCareer(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-structural-border)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text-main)' }}>
                  Student Career Guidance Report
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
                  Student: <strong>{previewCareer.userName}</strong> ({previewCareer.userEmail}) • {formatDate(previewCareer.createdAt)}
                </p>
              </div>
              <Button variant="ghost" onClick={() => setPreviewCareer(null)}>
                <X size={20} />
              </Button>
            </div>

            {/* Profile Context */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--color-structural-border)', borderRadius: 'var(--radius-base)', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--color-secondary)' }}>Student Profile Context</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Education Level:</span>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{previewCareer.profile?.educationLevel}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Stream:</span>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{previewCareer.profile?.stream || 'None specified'}</div>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Interests:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                  {previewCareer.profile?.interests?.map((i, idx) => (
                    <span key={idx} className={styles.interestChip}>{i}</span>
                  ))}
                </div>
              </div>

              {previewCareer.profile?.question && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Specific Question Asked:</span>
                  <div style={{ color: 'var(--color-text-main)', fontStyle: 'italic', marginTop: '2px' }}>
                    "{previewCareer.profile.question}"
                  </div>
                </div>
              )}
            </div>

            {/* AI Results */}
            {previewCareer.results ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {previewCareer.results.summary && (
                  <div style={{ background: 'rgba(255, 126, 95, 0.08)', border: '1px solid rgba(255, 126, 95, 0.2)', padding: '1.25rem', borderRadius: 'var(--radius-base)' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>AI Profile Analysis</h4>
                    <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                      {previewCareer.results.summary}
                    </p>
                  </div>
                )}

                {previewCareer.results.careerPaths && (
                  <div>
                    <h4 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>
                      Recommended Career Paths ({previewCareer.results.careerPaths.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {previewCareer.results.careerPaths.map((career: any, idx: number) => (
                        <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--color-structural-border)', borderRadius: 'var(--radius-base)', padding: '1.25rem' }}>
                          <h5 style={{ fontSize: '1.125rem', color: 'var(--color-secondary)', marginBottom: '0.35rem' }}>
                            {idx + 1}. {career.name}
                          </h5>
                          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>
                            {career.shortDescription || career.whyItFits}
                          </p>

                          {career.skillsToDevelop && (
                            <div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Skills to develop: </span>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                                {career.skillsToDevelop.map((s: string, sIdx: number) => (
                                  <span key={sIdx} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px', color: 'var(--color-text-main)' }}>
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previewCareer.results.roadmap && (
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--color-structural-border)', borderRadius: 'var(--radius-base)', padding: '1.25rem' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>Action Roadmap</h4>
                    <ol style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
                      {previewCareer.results.roadmap.map((step: string, sIdx: number) => (
                        <li key={sIdx} style={{ marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: 'var(--color-text-muted)', padding: '2rem', textAlign: 'center' }}>
                No guidance analysis payload recorded for this session.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: USER DEEP DIVE */}
      {previewUser && (
        <div className={styles.modalBackdrop} onClick={() => setPreviewUser(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-structural-border)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text-main)' }}>{previewUser.displayName}</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
                  {previewUser.email} • Joined: {formatDate(previewUser.createdAt)}
                </p>
              </div>
              <Button variant="ghost" onClick={() => setPreviewUser(null)}>
                <X size={20} />
              </Button>
            </div>

            {/* User Resumes */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="var(--color-primary)" /> Resumes Created by this User
              </h3>
              {resumes.filter(r => r.userId === previewUser.uid).length === 0 ? (
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                  This user has not created any resumes yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {resumes.filter(r => r.userId === previewUser.uid).map(r => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{r.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Template: {r.template} • Last modified: {formatDate(r.updatedAt)}</div>
                      </div>
                      <Button variant="secondary" onClick={() => { setPreviewUser(null); setPreviewResume(r); }} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        View Resume
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Career Guidance Sessions */}
            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={18} color="#c084fc" /> Career Guidance Queries by this User
              </h3>
              {careerSessions.filter(c => c.userId === previewUser.uid).length === 0 ? (
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                  This user has not explored career guidance yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {careerSessions.filter(c => c.userId === previewUser.uid).map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.profile?.educationLevel} ({c.profile?.stream || 'General'})</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{formatDate(c.createdAt)}</div>
                      </div>
                      <Button variant="secondary" onClick={() => { setPreviewUser(null); setPreviewCareer(c); }} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        View Guidance
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Feedback */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="#fbbf24" /> Feedback Submitted by this User
              </h3>
              {feedbacks.filter(f => f.userId === previewUser.uid || (f.email && previewUser.email && f.email.toLowerCase() === previewUser.email.toLowerCase())).length === 0 ? (
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                  This user has not submitted any feedback yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {feedbacks.filter(f => f.userId === previewUser.uid || (f.email && previewUser.email && f.email.toLowerCase() === previewUser.email.toLowerCase())).map(f => (
                    <div key={f.id} style={{ padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #fbbf24' }}>
                      <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-main)', marginBottom: '4px' }}>"{f.message}"</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Sent: {formatDate(f.timestamp)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden print container for Admin PDF download */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
        {printData && (
          <ResumeContext.Provider value={{
            data: printData.data,
            templateData: printData.data,
            updateData: () => {},
            selectedTemplate: (printData.template as TemplateId) || 'classic',
            setTemplate: () => {}
          }}>
            <div ref={resumePrintRef} style={{ width: '794px', padding: '20px' }}>
              {printData.template === 'classic' && <ClassicTemplate />}
              {printData.template === 'modern' && <ModernTemplate />}
              {printData.template === 'professional' && <ProfessionalTemplate />}
              {printData.template === 'standard' && <StandardTemplate />}
            </div>
          </ResumeContext.Provider>
        )}
      </div>
    </div>
  );
}
