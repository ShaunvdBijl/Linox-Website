// Firebase Configuration for LINQXFITNESS
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

const firebaseConfig = {
  apiKey: "AIzaSyCIrzE92nfyWeCxqpX1KcR2c_Rs1ubviy4",
  authDomain: "linox-soccer.firebaseapp.com",
  projectId: "linox-soccer",
  storageBucket: "linox-soccer.firebasestorage.app",
  messagingSenderId: "313058607377",
  appId: "1:313058607377:web:784530fe05a04272dd4cb0",
  measurementId: "G-QQJD06D5RK"
};

console.log('✅ Firebase Config Loaded');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
