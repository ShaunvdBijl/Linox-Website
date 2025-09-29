// Firebase Configuration for LINQXFITNESS
// This file contains Firebase initialization and configuration

// Firebase configuration object
// Loads from environment variables (Netlify) or local config.js
let firebaseConfig;

// Check if we're in Netlify (production) environment
if (typeof process !== 'undefined' && process.env && process.env.FIREBASE_API_KEY) {
  // Production: Use Netlify environment variables
  firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  };
  console.log('✅ Using Netlify environment variables for Firebase config');
} else {
  // Development: Try to load from secure config file
  try {
    firebaseConfig = require('./config.js');
    console.log('✅ Using local config.js for Firebase config');
  } catch (error) {
    // Fallback to placeholder values
    console.warn('⚠️ No config found. Using placeholder configuration.');
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
