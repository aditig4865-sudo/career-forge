import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWbVY7mfpGe81TZvklviMy6m1z_Jw4nck",
  authDomain: "web-app-84c9c.firebaseapp.com",
  projectId: "web-app-84c9c",
  storageBucket: "web-app-84c9c.firebasestorage.app",
  messagingSenderId: "240203380706",
  appId: "1:240203380706:web:f9e3b9bee4b1e868372bbb",
  measurementId: "G-5J23FTH81K"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
export const db = getFirestore(app);
