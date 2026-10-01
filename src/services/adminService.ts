import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  collectionGroup 
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { User } from 'firebase/auth';

export interface AdminUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  lastLogin: number;
  createdAt: number;
  resumeCount?: number;
  careerCount?: number;
}

export interface AdminResume {
  id: string;
  name: string;
  userId: string;
  userName: string;
  userEmail: string;
  template: string;
  updatedAt: number;
  createdAt?: number;
  data: any;
}

export interface AdminCareerSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  profile: {
    educationLevel: string;
    stream: string;
    interests: string[];
    question: string;
  };
  results: any;
  createdAt: number;
}

export interface AdminFeedback {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string | number;
  userId?: string;
}

export interface AdminActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: 'sign_in' | 'resume_save' | 'resume_delete' | 'career_guidance' | 'resume_download' | 'feedback_submitted';
  title: string;
  details: string;
  timestamp: number;
}

// Local cache helper to guarantee immediate offline/instant loading
const LOCAL_USERS_KEY = 'cf_admin_users_cache';
const LOCAL_RESUMES_KEY = 'cf_admin_resumes_cache';
const LOCAL_CAREER_KEY = 'cf_admin_career_cache';
const LOCAL_LOGS_KEY = 'cf_admin_logs_cache';
const LOCAL_FEEDBACK_KEY = 'cf_admin_feedback_cache';

function getLocalCache<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalCache<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data.slice(0, 100)));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

/**
 * Record a user sign in event
 */
export async function trackUserSignIn(user: User): Promise<void> {
  if (!user) return;
  const userData: AdminUser = {
    uid: user.uid,
    displayName: user.displayName || user.email?.split('@')[0] || 'User',
    email: user.email || 'No email provided',
    photoURL: user.photoURL || '',
    lastLogin: Date.now(),
    createdAt: user.metadata?.creationTime ? new Date(user.metadata.creationTime).getTime() : Date.now()
  };

  // 1. Update local cache
  const cachedUsers = getLocalCache<AdminUser>(LOCAL_USERS_KEY);
  const existingIdx = cachedUsers.findIndex(u => u.uid === user.uid);
  if (existingIdx >= 0) {
    cachedUsers[existingIdx] = { ...cachedUsers[existingIdx], ...userData, lastLogin: Date.now() };
  } else {
    cachedUsers.unshift(userData);
  }
  setLocalCache(LOCAL_USERS_KEY, cachedUsers);

  // 2. Add activity log
  trackActivityLog({
    userId: user.uid,
    userName: userData.displayName,
    userEmail: userData.email,
    action: 'sign_in',
    title: 'User Signed In',
    details: `${userData.displayName} (${userData.email}) logged in successfully`,
    timestamp: Date.now()
  });

  // 3. Save to Firestore
  try {
    await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
    // Also save in a global admin_users collection to simplify admin listing
    await setDoc(doc(db, 'admin_users', user.uid), userData, { merge: true });
  } catch (err) {
    console.warn('Could not sync user to Firestore:', err);
  }
}

/**
 * Record a saved or updated resume
 */
export async function trackResumeSave(
  resumeId: string,
  resumeName: string,
  resumeData: any,
  template: string
): Promise<void> {
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid || 'guest';
  const userName = currentUser?.displayName || resumeData?.personalInfo?.fullName || 'User';
  const userEmail = currentUser?.email || resumeData?.personalInfo?.email || 'No email';

  const record: AdminResume = {
    id: resumeId,
    name: resumeName || `${userName}'s Resume`,
    userId,
    userName,
    userEmail,
    template: template || 'classic',
    updatedAt: Date.now(),
    data: resumeData
  };

  // 1. Update local cache
  const cached = getLocalCache<AdminResume>(LOCAL_RESUMES_KEY);
  const existingIdx = cached.findIndex(r => r.id === resumeId);
  if (existingIdx >= 0) {
    cached[existingIdx] = record;
  } else {
    cached.unshift(record);
  }
  setLocalCache(LOCAL_RESUMES_KEY, cached);

  // 2. Add activity log
  trackActivityLog({
    userId,
    userName,
    userEmail,
    action: 'resume_save',
    title: 'Resume Created/Saved',
    details: `${userName} saved resume "${record.name}" with ${template} template`,
    timestamp: Date.now()
  });

  // 3. Save to Firestore all_resumes
  try {
    await setDoc(doc(db, 'all_resumes', resumeId), record, { merge: true });
  } catch (err) {
    console.warn('Could not sync resume to all_resumes:', err);
  }
}

/**
 * Record when a student/user requests Career Guidance
 */
export async function trackCareerGuidanceSession(
  profile: { educationLevel: string; stream: string; interests: string[]; question: string },
  results: any
): Promise<void> {
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid || 'guest';
  const userName = currentUser?.displayName || 'Student / Guest User';
  const userEmail = currentUser?.email || 'Guest Explorer';

  const sessionRecord: AdminCareerSession = {
    id: 'cg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId,
    userName,
    userEmail,
    profile,
    results,
    createdAt: Date.now()
  };

  // 1. Update local cache
  const cached = getLocalCache<AdminCareerSession>(LOCAL_CAREER_KEY);
  cached.unshift(sessionRecord);
  setLocalCache(LOCAL_CAREER_KEY, cached);

  // 2. Add activity log
  trackActivityLog({
    userId,
    userName,
    userEmail,
    action: 'career_guidance',
    title: 'Career Guidance Generated',
    details: `${userName} explored careers for ${profile.educationLevel} (${profile.stream || 'General'}) with interests: ${profile.interests.slice(0, 3).join(', ')}${profile.interests.length > 3 ? '...' : ''}`,
    timestamp: Date.now()
  });

  // 3. Save to Firestore
  try {
    await addDoc(collection(db, 'career_guidance_sessions'), sessionRecord);
  } catch (err) {
    console.warn('Could not sync career guidance session:', err);
  }
}

/**
 * Record an activity log
 */
export async function trackActivityLog(log: Omit<AdminActivityLog, 'id'>): Promise<void> {
  const fullLog: AdminActivityLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    ...log
  };

  const cached = getLocalCache<AdminActivityLog>(LOCAL_LOGS_KEY);
  cached.unshift(fullLog);
  setLocalCache(LOCAL_LOGS_KEY, cached);

  try {
    await addDoc(collection(db, 'activity_logs'), fullLog);
  } catch (err) {
    // quiet fallback
  }
}

/**
 * Admin Data Fetchers
 */
export async function fetchAllUsers(): Promise<AdminUser[]> {
  const usersMap = new Map<string, AdminUser>();

  // Load from local cache first
  getLocalCache<AdminUser>(LOCAL_USERS_KEY).forEach(u => usersMap.set(u.uid, u));

  // Try Firestore admin_users
  try {
    const snap = await getDocs(collection(db, 'admin_users'));
    snap.forEach(d => {
      const data = d.data() as AdminUser;
      usersMap.set(data.uid || d.id, { ...data, uid: data.uid || d.id });
    });
  } catch {
    // Try users collection
    try {
      const snapUsers = await getDocs(collection(db, 'users'));
      snapUsers.forEach(d => {
        const data = d.data() as AdminUser;
        usersMap.set(data.uid || d.id, { ...data, uid: data.uid || d.id });
      });
    } catch (e) {
      console.warn('Firestore users fetch failed:', e);
    }
  }

  // Also include current user if logged in
  if (auth.currentUser && !usersMap.has(auth.currentUser.uid)) {
    usersMap.set(auth.currentUser.uid, {
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'User',
      email: auth.currentUser.email || 'No email',
      photoURL: auth.currentUser.photoURL || '',
      lastLogin: Date.now(),
      createdAt: Date.now()
    });
  }

  return Array.from(usersMap.values()).sort((a, b) => (b.lastLogin || 0) - (a.lastLogin || 0));
}

export async function fetchAllResumes(): Promise<AdminResume[]> {
  const resumesMap = new Map<string, AdminResume>();

  // Load from local cache first
  getLocalCache<AdminResume>(LOCAL_RESUMES_KEY).forEach(r => resumesMap.set(r.id, r));

  // Try all_resumes collection
  try {
    const snap = await getDocs(collection(db, 'all_resumes'));
    snap.forEach(d => {
      const data = d.data() as AdminResume;
      resumesMap.set(d.id, { ...data, id: d.id });
    });
  } catch {
    // Fallback to collectionGroup resumes
    try {
      const snapGroup = await getDocs(collectionGroup(db, 'resumes'));
      snapGroup.forEach(d => {
        const data = d.data() as AdminResume;
        resumesMap.set(d.id, { ...data, id: d.id });
      });
    } catch (e) {
      console.warn('Firestore resumes fetch failed:', e);
    }
  }

  return Array.from(resumesMap.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export async function fetchAllCareerSessions(): Promise<AdminCareerSession[]> {
  const sessionsMap = new Map<string, AdminCareerSession>();

  // Load from local cache first
  getLocalCache<AdminCareerSession>(LOCAL_CAREER_KEY).forEach(s => sessionsMap.set(s.id, s));

  // Try Firestore career_guidance_sessions
  try {
    const q = query(collection(db, 'career_guidance_sessions'), orderBy('createdAt', 'desc'), limit(100));
    const snap = await getDocs(q);
    snap.forEach(d => {
      const data = d.data() as AdminCareerSession;
      sessionsMap.set(d.id, { ...data, id: d.id });
    });
  } catch {
    try {
      const snap = await getDocs(collection(db, 'career_guidance_sessions'));
      snap.forEach(d => {
        const data = d.data() as AdminCareerSession;
        sessionsMap.set(d.id, { ...data, id: d.id });
      });
    } catch (e) {
      console.warn('Firestore career sessions fetch failed:', e);
    }
  }

  return Array.from(sessionsMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function fetchAllActivityLogs(): Promise<AdminActivityLog[]> {
  const logsMap = new Map<string, AdminActivityLog>();

  // Load from local cache first
  getLocalCache<AdminActivityLog>(LOCAL_LOGS_KEY).forEach(l => logsMap.set(l.id, l));

  // Try Firestore activity_logs
  try {
    const q = query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc'), limit(100));
    const snap = await getDocs(q);
    snap.forEach(d => {
      const data = d.data() as AdminActivityLog;
      logsMap.set(d.id, { ...data, id: d.id });
    });
  } catch {
    try {
      const snap = await getDocs(collection(db, 'activity_logs'));
      snap.forEach(d => {
        const data = d.data() as AdminActivityLog;
        logsMap.set(d.id, { ...data, id: d.id });
      });
    } catch (e) {
      console.warn('Firestore activity logs fetch failed:', e);
    }
  }

  return Array.from(logsMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

/**
 * Record a feedback submission
 */
export async function trackFeedbackSubmission(feedback: {
  name: string;
  email: string;
  message: string;
  userId?: string;
}): Promise<void> {
  const record: AdminFeedback = {
    id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    name: feedback.name || 'Anonymous',
    email: feedback.email || 'No email',
    message: feedback.message,
    timestamp: new Date().toISOString(),
    userId: feedback.userId || 'guest'
  };

  const cached = getLocalCache<AdminFeedback>(LOCAL_FEEDBACK_KEY);
  cached.unshift(record);
  setLocalCache(LOCAL_FEEDBACK_KEY, cached);

  trackActivityLog({
    userId: feedback.userId || 'guest',
    userName: feedback.name || 'Anonymous',
    userEmail: feedback.email || 'No email',
    action: 'feedback_submitted',
    title: 'Feedback Submitted',
    details: `${feedback.name} sent feedback: "${feedback.message.slice(0, 60)}${feedback.message.length > 60 ? '...' : ''}"`,
    timestamp: Date.now()
  });

  try {
    await addDoc(collection(db, 'feedback'), {
      name: feedback.name,
      email: feedback.email,
      message: feedback.message,
      timestamp: new Date().toISOString(),
      userId: feedback.userId || 'guest'
    });
  } catch (err) {
    console.warn('Could not save feedback to Firestore:', err);
  }
}

/**
 * Fetch all user feedback
 */
export async function fetchAllFeedback(): Promise<AdminFeedback[]> {
  const feedbackMap = new Map<string, AdminFeedback>();

  // Load from local cache first
  getLocalCache<AdminFeedback>(LOCAL_FEEDBACK_KEY).forEach(f => feedbackMap.set(f.id, f));

  // Try Firestore feedback collection
  try {
    const snap = await getDocs(collection(db, 'feedback'));
    snap.forEach(d => {
      const data = d.data();
      feedbackMap.set(d.id, {
        id: d.id,
        name: data.name || 'Anonymous',
        email: data.email || 'No email',
        message: data.message || '',
        timestamp: data.timestamp || Date.now(),
        userId: data.userId || 'guest'
      });
    });
  } catch (err) {
    console.warn('Firestore feedback fetch failed:', err);
  }

  return Array.from(feedbackMap.values()).sort((a, b) => {
    const timeA = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : a.timestamp;
    const timeB = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : b.timestamp;
    return (timeB || 0) - (timeA || 0);
  });
}

