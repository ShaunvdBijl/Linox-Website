# Firebase Backend Setup Guide

## 🚀 **Complete Firebase Backend Implementation**

This guide will help you set up a production-ready Firebase backend for your LINQXFITNESS website.

## 📋 **Prerequisites**

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **Firebase Account** - [Sign up here](https://firebase.google.com/)
3. **Git** (for version control)

## 🔧 **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `linoxfitness-backend`
4. Enable Google Analytics (optional)
5. Click "Create project"

## 🔐 **Step 2: Enable Authentication**

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 🗄️ **Step 3: Set up Firestore Database**

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

## 🔑 **Step 4: Get Firebase Configuration**

1. In Firebase Console, go to "Project Settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (`</>`)
4. Enter app nickname: `linoxfitness-web`
5. Click "Register app"
6. Copy the `firebaseConfig` object

## 📝 **Step 5: Update Configuration**

1. Open `firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 🏗️ **Step 6: Install Dependencies**

Run these commands in your project directory:

```bash
npm install
```

## 🔒 **Step 7: Set up Firestore Security Rules**

1. In Firebase Console, go to "Firestore Database"
2. Click "Rules" tab
3. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin can read/write all data
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Customers collection - admin only
    match /customers/{customerId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Workouts collection - admin only
    match /workouts/{workoutId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Schedules collection - admin only
    match /schedules/{scheduleId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

## 📁 **Step 8: Set up Storage**

1. In Firebase Console, go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Select a location
5. Click "Done"

## 🚀 **Step 9: Deploy to Netlify**

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify:**
```bash
netlify login
```

3. **Deploy your site:**
```bash
netlify deploy --prod --dir .
```

## 🧪 **Step 10: Test the System**

1. **Test Admin Login:**
   - Email: `admin@linoxfitness.com`
   - Password: `Admin123!`

2. **Test Customer Signup:**
   - Go to signup page
   - Create a new customer account
   - Verify it appears in admin portal

## 📊 **Database Structure**

### Users Collection
```
users/{userId} {
  uid: string,
  firstName: string,
  lastName: string,
  email: string,
  fitnessGoal: string,
  experience: string,
  isAdmin: boolean,
  createdAt: timestamp,
  lastLogin: timestamp,
  isActive: boolean,
  profileComplete: boolean,
  phone: string,
  trainingLevel: string,
  goals: array,
  emergencyContact: object,
  medicalInfo: object
}
```

### Customers Collection
```
customers/{customerId} {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  status: string, // active, pending, inactive
  trainingLevel: string,
  goals: array,
  createdAt: timestamp,
  updatedAt: timestamp,
  isActive: boolean
}
```

### Workouts Collection
```
workouts/{workoutId} {
  customerId: string,
  title: string,
  description: string,
  exercises: array,
  duration: number,
  difficulty: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Schedules Collection
```
schedules/{scheduleId} {
  customerId: string,
  date: timestamp,
  time: string,
  type: string, // training, assessment, consultation
  status: string, // scheduled, completed, cancelled
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🔧 **Next Steps**

1. **Update your existing pages** to use Firebase instead of localStorage
2. **Create customer detail pages** for individual management
3. **Add workout schedule management** functionality
4. **Implement exercise recommendation system**
5. **Add progress tracking** features
6. **Set up email notifications** for customers
7. **Add file upload** functionality for photos/videos

## 🆘 **Troubleshooting**

### Common Issues:
1. **"Firebase not defined"** - Make sure you've updated firebase-config.js with your actual config
2. **"Permission denied"** - Check your Firestore security rules
3. **"Module not found"** - Run `npm install` to install dependencies
4. **Authentication errors** - Verify Firebase Auth is enabled and configured

### Getting Help:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
