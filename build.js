#!/usr/bin/env node

// Netlify Build Script
// This script injects environment variables into browser files during build

const fs = require('fs');
const path = require('path');

console.log('🔧 Building with environment variables...');

// Create a browser-compatible config file with environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY_HERE",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Write the config for browser use
const configContent = `// Auto-generated Firebase configuration for browser
// This file is created during Netlify build with environment variables

window.firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};

// Also export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = firebaseConfig;
}
`;

fs.writeFileSync('config-browser.js', configContent);
console.log('✅ Created config-browser.js with environment variables');

// Check if we have real API keys
if (firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY_HERE") {
  console.log('✅ Real Firebase configuration detected');
} else {
  console.log('⚠️ Using placeholder configuration - check environment variables');
}
