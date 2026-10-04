import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyApoqaQSKdwcgfd605rrPPVmkhTfU6jJB4",
  authDomain: "careerforge-c6fc7.firebaseapp.com",
  projectId: "careerforge-c6fc7",
  storageBucket: "careerforge-c6fc7.firebasestorage.app",
  messagingSenderId: "714041747515",
  appId: "1:714041747515:web:1ec32dd38549598f5cd41e",
  measurementId: "G-4Q9WY118Y4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
export const db = getFirestore(app);
