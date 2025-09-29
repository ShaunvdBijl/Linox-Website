// Firebase Configuration for LINQXFITNESS
// This file contains Firebase initialization and configuration

// Firebase configuration object
// This will load from config.js (which is gitignored) or use placeholders
let firebaseConfig;

try {
  // Try to load from secure config file (not tracked by Git)
  firebaseConfig = require('./config.js');
} catch (error) {
  // Fallback to placeholder values if config.js doesn't exist
  console.warn('⚠️ config.js not found. Using placeholder configuration.');
  firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY_HERE",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    measurementId: "G-XXXXXXXXXX"
  };
}

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
