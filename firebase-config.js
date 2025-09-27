// Firebase Configuration for LINQXFITNESS
// This file contains Firebase initialization and configuration

// Firebase configuration object
// Your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AQ.Ab8RN6KgqvLt8-m4-nu8_m9YwNxwJEPkY-2VQitKApmH9h4EAA",
  authDomain: "linox-website.firebaseapp.com",
  projectId: "linox-website",
  storageBucket: "linox-website.firebasestorage.app",
  messagingSenderId: "559179347351",
  appId: "1:559179347351:web:1158b072023b4a7a6500d2",
  measurementId: "G-FN0BHTE93G"
};

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Export the app instance
export default app;
