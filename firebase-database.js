// Firebase Firestore Database Service
// This file handles all database operations

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from './firebase-config.js';

class FirebaseDatabaseService {
  constructor() {
    this.db = db;
  }

  // Customer Management
  async getAllCustomers() {
    try {
      const customersRef = collection(this.db, 'customers');
      const q = query(customersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const customers = [];
      querySnapshot.forEach((doc) => {
        customers.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, customers };
    } catch (error) {
      console.error('Error getting customers:', error);
      return { success: false, error: error.message };
    }
  }

  async getCustomer(customerId) {
    try {
      const customerRef = doc(this.db, 'customers', customerId);
      const customerSnap = await getDoc(customerRef);

      if (customerSnap.exists()) {
        return { success: true, customer: { id: customerSnap.id, ...customerSnap.data() } };
      } else {
        return { success: false, error: 'Customer not found' };
      }
    } catch (error) {
      console.error('Error getting customer:', error);
      return { success: false, error: error.message };
    }
  }

  async createCustomer(customerData) {
    try {
      const customerRef = collection(this.db, 'customers');
      const newCustomer = {
        ...customerData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      };

      const docRef = await addDoc(customerRef, newCustomer);
      return { success: true, customerId: docRef.id };
    } catch (error) {
      console.error('Error creating customer:', error);
      return { success: false, error: error.message };
    }
  }

  async updateCustomer(customerId, updates) {
    try {
      const customerRef = doc(this.db, 'customers', customerId);
      await updateDoc(customerRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating customer:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteCustomer(customerId) {
    try {
      await deleteDoc(doc(this.db, 'customers', customerId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting customer:', error);
      return { success: false, error: error.message };
    }
  }

  // Workout Management
  async getCustomerWorkouts(customerId) {
    try {
      const workoutsRef = collection(this.db, 'workouts');
      const q = query(
        workoutsRef,
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const workouts = [];
      querySnapshot.forEach((doc) => {
        workouts.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, workouts };
    } catch (error) {
      console.error('Error getting workouts:', error);
      return { success: false, error: error.message };
    }
  }

  async createWorkout(workoutData) {
    try {
      const workoutRef = collection(this.db, 'workouts');
      const newWorkout = {
        ...workoutData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(workoutRef, newWorkout);
      return { success: true, workoutId: docRef.id };
    } catch (error) {
      console.error('Error creating workout:', error);
      return { success: false, error: error.message };
    }
  }

  async updateWorkout(workoutId, updates) {
    try {
      const workoutRef = doc(this.db, 'workouts', workoutId);
      await updateDoc(workoutRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating workout:', error);
      return { success: false, error: error.message };
    }
  }

  // Schedule Management
  async getCustomerSchedule(customerId) {
    try {
      const scheduleRef = collection(this.db, 'schedules');
      const q = query(
        scheduleRef,
        where('customerId', '==', customerId),
        orderBy('date', 'asc')
      );
      const querySnapshot = await getDocs(q);

      const schedules = [];
      querySnapshot.forEach((doc) => {
        schedules.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, schedules };
    } catch (error) {
      console.error('Error getting schedule:', error);
      return { success: false, error: error.message };
    }
  }

  async createSchedule(scheduleData) {
    try {
      const scheduleRef = collection(this.db, 'schedules');
      const newSchedule = {
        ...scheduleData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(scheduleRef, newSchedule);
      return { success: true, scheduleId: docRef.id };
    } catch (error) {
      console.error('Error creating schedule:', error);
      return { success: false, error: error.message };
    }
  }

  // Exercise Recommendations
  async getExerciseRecommendations(customerId) {
    try {
      const recommendationsRef = collection(this.db, 'exerciseRecommendations');
      const q = query(
        recommendationsRef,
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const recommendations = [];
      querySnapshot.forEach((doc) => {
        recommendations.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, recommendations };
    } catch (error) {
      console.error('Error getting exercise recommendations:', error);
      return { success: false, error: error.message };
    }
  }

  async createExerciseRecommendation(recommendationData) {
    try {
      const recommendationRef = collection(this.db, 'exerciseRecommendations');
      const newRecommendation = {
        ...recommendationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(recommendationRef, newRecommendation);
      return { success: true, recommendationId: docRef.id };
    } catch (error) {
      console.error('Error creating exercise recommendation:', error);
      return { success: false, error: error.message };
    }
  }

  // Progress Tracking
  async getCustomerProgress(customerId) {
    try {
      const progressRef = collection(this.db, 'progress');
      const q = query(
        progressRef,
        where('customerId', '==', customerId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const progress = [];
      querySnapshot.forEach((doc) => {
        progress.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, progress };
    } catch (error) {
      console.error('Error getting progress:', error);
      return { success: false, error: error.message };
    }
  }

  async recordProgress(progressData) {
    try {
      const progressRef = collection(this.db, 'progress');
      const newProgress = {
        ...progressData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(progressRef, newProgress);
      return { success: true, progressId: docRef.id };
    } catch (error) {
      console.error('Error recording progress:', error);
      return { success: false, error: error.message };
    }
  }

  // Analytics and Reports
  async getCustomerStats() {
    try {
      const customersRef = collection(this.db, 'customers');
      const querySnapshot = await getDocs(customersRef);

      const stats = {
        total: 0,
        active: 0,
        pending: 0,
        inactive: 0,
        newThisWeek: 0
      };

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      querySnapshot.forEach((doc) => {
        const customer = doc.data();
        stats.total++;

        if (customer.status === 'active') stats.active++;
        else if (customer.status === 'pending') stats.pending++;
        else if (customer.status === 'inactive') stats.inactive++;

        if (customer.createdAt && customer.createdAt.toDate() > oneWeekAgo) {
          stats.newThisWeek++;
        }
      });

      return { success: true, stats };
    } catch (error) {
      console.error('Error getting customer stats:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create and export singleton instance
export const firebaseDB = new FirebaseDatabaseService();
