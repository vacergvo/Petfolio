import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration from the user's provided snippet
const firebaseConfig = {
  apiKey: "AIzaSyC7qrHuULs_dzP-WlN62G3nMVcqegQMnZo",
  authDomain: "lps-checklist.firebaseapp.com",
  projectId: "lps-checklist",
  storageBucket: "lps-checklist.firebasestorage.app",
  messagingSenderId: "1003458248363",
  appId: "1:1003458248363:web:c58fcb6d6912d112d401ee"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);