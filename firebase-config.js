// Firebase Configuration for LINQXFITNESS
// This file contains Firebase initialization and configuration

// Firebase configuration object
// Your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIrzE92nfyWeCxqpX1KcR2c_Rs1ubviy4",
  authDomain: "linox-soccer.firebaseapp.com",
  projectId: "linox-soccer",
  storageBucket: "linox-soccer.firebasestorage.app",
  messagingSenderId: "313058607377",
  appId: "1:313058607377:web:784530fe05a04272dd4cb0",
  measurementId: "G-QQJD06D5RK"
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
