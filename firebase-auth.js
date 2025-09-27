// Firebase Authentication Service
// This file handles all authentication operations

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase-config.js';

class FirebaseAuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
    this.init();
  }

  init() {
    // Listen for authentication state changes
    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      if (user) {
        // Load user profile from Firestore
        await this.loadUserProfile(user.uid);
      }
      this.notifyAuthStateListeners(user);
    });
  }

  // Add authentication state listener
  onAuthStateChange(callback) {
    this.authStateListeners.push(callback);
  }

  // Notify all listeners of auth state changes
  notifyAuthStateListeners(user) {
    this.authStateListeners.forEach(callback => callback(user));
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Load user profile
      await this.loadUserProfile(user.uid);
      
      return { success: true, user: user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  // Create new user account
  async signUp(userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Create user document in Firestore
      const userProfile = {
        uid: user.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        fitnessGoal: userData.fitnessGoal,
        experience: userData.experience,
        isAdmin: userData.isAdmin || false,
        createdAt: new Date(),
        lastLogin: null,
        isActive: true,
        profileComplete: true,
        phone: userData.phone || '',
        trainingLevel: userData.trainingLevel || 'Beginner',
        goals: userData.goals || [],
        emergencyContact: userData.emergencyContact || {},
        medicalInfo: userData.medicalInfo || {}
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      return { success: true, user: user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  }

  // Load user profile from Firestore
  async loadUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        this.userProfile = userDoc.data();
        return this.userProfile;
      }
      return null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(uid, updates) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: new Date()
      });
      await this.loadUserProfile(uid);
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get user profile
  getUserProfile() {
    return this.userProfile;
  }

  // Check if user is admin
  isAdmin() {
    return this.userProfile && this.userProfile.isAdmin;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }
}

// Create and export singleton instance
export const firebaseAuth = new FirebaseAuthService();
