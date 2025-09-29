// SECURE CONFIGURATION LOADER
// This file loads the actual Firebase config from config.js (which is gitignored)

// For browser environments, we'll load this dynamically
if (typeof window !== 'undefined') {
  // Browser environment - load config via script tag
  const script = document.createElement('script');
  script.src = './config.js';
  script.onload = () => {
    // Config loaded successfully
    console.log('✅ Secure Firebase configuration loaded');
  };
  script.onerror = () => {
    // Fallback to placeholder config
    console.warn('⚠️ config.js not found. Using placeholder configuration.');
    window.firebaseConfig = {
      apiKey: "YOUR_FIREBASE_API_KEY_HERE",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:abcdef123456",
      measurementId: "G-XXXXXXXXXX"
    };
  };
  document.head.appendChild(script);
}
