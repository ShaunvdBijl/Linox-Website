// Secure Firebase Configuration Loader
// This file loads configuration from a separate config.js file
// NEVER put actual API keys in this file

// Try to load from external config file first
let firebaseConfig = null;

try {
  // For production, this would load from environment variables
  // For development, it loads from config.js (which should be in .gitignore)
  
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Browser environment - load from window.firebaseConfig if available
    if (window.firebaseConfig) {
      firebaseConfig = window.firebaseConfig;
    }
  } else {
    // Node.js environment - load from config.js
    firebaseConfig = require('./config.js');
  }
} catch (error) {
  console.warn('Could not load external config. Using placeholder values.');
}

// Fallback configuration with placeholders
// This ensures the app doesn't break if config is missing
if (!firebaseConfig) {
  firebaseConfig = {
    apiKey: "PLACEHOLDER_API_KEY",
    authDomain: "PLACEHOLDER_PROJECT.firebaseapp.com",
    projectId: "PLACEHOLDER_PROJECT",
    storageBucket: "PLACEHOLDER_PROJECT.firebasestorage.app",
    messagingSenderId: "PLACEHOLDER_SENDER_ID",
    appId: "PLACEHOLDER_APP_ID",
    measurementId: "PLACEHOLDER_MEASUREMENT_ID"
  };
  
  console.error('⚠️  Firebase configuration not found!');
  console.error('Please create a config.js file with your Firebase configuration.');
  console.error('See config.example.js for the template.');
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

// Export config for debugging (remove in production)
export { firebaseConfig };
