// Configuration for Admin Access
export const ADMIN_CONFIG = {
  // Master passcode to unlock the Admin Dashboard on any device
  MASTER_PASSCODE: 'admin2024',
  
  // Storage key for admin authorization
  SESSION_STORAGE_KEY: 'careerforge_admin_authenticated',

  // List of team member emails allowed to access the admin side
  ALLOWED_ADMIN_EMAILS: [
    'bulbule.damodhar@gmail.com',
    'aditig4865@gmail.com',
    'purvamasal621@gmail.com',
    'karekaryash50@gmail.com'
  ]
};

export function isUserAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_CONFIG.ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase());
}

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(ADMIN_CONFIG.SESSION_STORAGE_KEY) === 'true' ||
         sessionStorage.getItem(ADMIN_CONFIG.SESSION_STORAGE_KEY) === 'true';
}

export function setAdminAuthenticated(auth: boolean): void {
  if (auth) {
    localStorage.setItem(ADMIN_CONFIG.SESSION_STORAGE_KEY, 'true');
    sessionStorage.setItem(ADMIN_CONFIG.SESSION_STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_CONFIG.SESSION_STORAGE_KEY);
    sessionStorage.removeItem(ADMIN_CONFIG.SESSION_STORAGE_KEY);
  }
}
