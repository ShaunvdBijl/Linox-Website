// Firebase Configuration Template
// Copy this file to config.js and add your actual values
// NEVER commit config.js to version control

const firebaseConfig = {
  apiKey: "your_firebase_api_key_here",
  authDomain: "your_project_id.firebaseapp.com", 
  projectId: "your_project_id",
  storageBucket: "your_project_id.firebasestorage.app",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id",
  measurementId: "your_measurement_id"
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = firebaseConfig;
} else {
  window.firebaseConfig = firebaseConfig;
}
