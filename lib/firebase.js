
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDFsvw0ZpmTN3w0JPHYG3uUGiwY0r9m7zM",
  authDomain: "smartnoteapp-768e4.firebaseapp.com",
  projectId: "smartnoteapp-768e4",
  storageBucket: "smartnoteapp-768e4.firebasestorage.app",
  messagingSenderId: "391750140768",
  appId: "1:391750140768:web:13ee1bbc57fa41b60b9405"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
