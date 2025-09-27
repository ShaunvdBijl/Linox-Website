// Firebase Storage Service
// This file handles file uploads and storage

import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from './firebase-config.js';

class FirebaseStorageService {
  constructor() {
    this.storage = storage;
  }

  // Upload customer profile photo
  async uploadCustomerPhoto(customerId, file) {
    try {
      const fileName = `customers/${customerId}/profile/${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { success: true, url: downloadURL, fileName };
    } catch (error) {
      console.error('Error uploading customer photo:', error);
      return { success: false, error: error.message };
    }
  }

  // Upload workout video
  async uploadWorkoutVideo(customerId, workoutId, file) {
    try {
      const fileName = `customers/${customerId}/workouts/${workoutId}/${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { success: true, url: downloadURL, fileName };
    } catch (error) {
      console.error('Error uploading workout video:', error);
      return { success: false, error: error.message };
    }
  }

  // Upload exercise demonstration video
  async uploadExerciseVideo(exerciseId, file) {
    try {
      const fileName = `exercises/${exerciseId}/${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { success: true, url: downloadURL, fileName };
    } catch (error) {
      console.error('Error uploading exercise video:', error);
      return { success: false, error: error.message };
    }
  }

  // Upload document
  async uploadDocument(customerId, documentType, file) {
    try {
      const fileName = `customers/${customerId}/documents/${documentType}/${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { success: true, url: downloadURL, fileName };
    } catch (error) {
      console.error('Error uploading document:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete file
  async deleteFile(filePath) {
    try {
      const fileRef = ref(this.storage, filePath);
      await deleteObject(fileRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { success: false, error: error.message };
    }
  }

  // Get file download URL
  async getDownloadURL(filePath) {
    try {
      const fileRef = ref(this.storage, filePath);
      const url = await getDownloadURL(fileRef);
      return { success: true, url };
    } catch (error) {
      console.error('Error getting download URL:', error);
      return { success: false, error: error.message };
    }
  }

  // List files in a folder
  async listFiles(folderPath) {
    try {
      const folderRef = ref(this.storage, folderPath);
      const result = await listAll(folderRef);
      
      const files = [];
      for (const item of result.items) {
        const url = await getDownloadURL(item);
        files.push({
          name: item.name,
          url: url.url,
          path: item.fullPath
        });
      }
      
      return { success: true, files };
    } catch (error) {
      console.error('Error listing files:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create and export singleton instance
export const firebaseStorage = new FirebaseStorageService();
