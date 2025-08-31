// Secure Authentication Utilities
// This file contains all shared authentication functions for the LinoxFitness application

// Initialize default accounts
async function initializeDefaultAccounts() {
    try {
        const users = await loadSecureUsers();
        
        // Check if default accounts already exist
        const adminExists = users.find(u => u.email === 'admin@linoxfitness.com');
        const testExists = users.find(u => u.email === 'test@linoxfitness.com');
        
        if (!adminExists) {
            const adminUser = await createDefaultUser({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@linoxfitness.com',
                password: 'Admin123!',
                fitnessGoal: 'General Fitness',
                experience: 'Advanced',
                isAdmin: true
            });
            users.push(adminUser);
        }
        
        if (!testExists) {
            const testUser = await createDefaultUser({
                firstName: 'Test',
                lastName: 'User',
                email: 'test@linoxfitness.com',
                password: 'Test123!',
                fitnessGoal: 'Weight Loss',
                experience: 'Beginner',
                isAdmin: false
            });
            users.push(testUser);
        }
        
        if (!adminExists || !testExists) {
            await saveSecureUsers(users);
            console.log('Default accounts initialized successfully');
        }
        
        return true;
    } catch (error) {
        console.error('Failed to initialize default accounts:', error);
        return false;
    }
}

// Create default user account
async function createDefaultUser(userData) {
    const salt = generateSecureSalt();
    const hashedPassword = await hashPassword(userData.password, salt);
    
    return {
        id: generateSecureId(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(),
        passwordHash: hashedPassword,
        salt: salt,
        fitnessGoal: userData.fitnessGoal,
        experience: userData.experience,
        isAdmin: userData.isAdmin || false,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true,
        profileComplete: true
    };
}

// Secure Password Hashing using Web Crypto API
async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

// Generate secure salt
function generateSecureSalt() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Generate secure user ID
function generateSecureId() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Generate session token
function generateSessionToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Encryption/Decryption using Web Crypto API
async function encryptData(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const key = await crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256
        },
        true,
        ['encrypt', 'decrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedBuffer = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        dataBuffer
    );
    
    const exportedKey = await crypto.subtle.exportKey('raw', key);
    
    const combined = new Uint8Array(iv.length + exportedKey.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(exportedKey), iv.length);
    combined.set(new Uint8Array(encryptedBuffer), iv.length + exportedKey.length);
    
    return btoa(String.fromCharCode(...combined));
}

async function decryptData(encryptedData) {
    try {
        const combined = new Uint8Array(atob(encryptedData).split('').map(char => char.charCodeAt(0)));
        
        const iv = combined.slice(0, 12);
        const exportedKey = combined.slice(12, 44);
        const encryptedBuffer = combined.slice(44);
        
        const key = await crypto.subtle.importKey(
            'raw',
            exportedKey,
            {
                name: 'AES-GCM',
                length: 256
            },
            false,
            ['decrypt']
        );
        
        const decryptedBuffer = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            encryptedBuffer
        );
        
        const decoder = new TextDecoder();
        return decoder.decode(decryptedBuffer);
    } catch (error) {
        console.error('Decryption failed:', error);
        throw error;
    }
}

// Secure User Storage System
async function saveSecureUsers(users) {
    try {
        const encryptedData = await encryptData(JSON.stringify(users));
        localStorage.setItem('linox_users_encrypted', encryptedData);
        await saveToIndexedDB('users', encryptedData);
        return true;
    } catch (error) {
        console.error('Failed to save users:', error);
        throw error;
    }
}

async function loadSecureUsers() {
    try {
        let encryptedData = localStorage.getItem('linox_users_encrypted');
        
        if (!encryptedData) {
            encryptedData = await loadFromIndexedDB('users');
        }
        
        if (!encryptedData) {
            return [];
        }
        
        const decryptedData = await decryptData(encryptedData);
        return JSON.parse(decryptedData);
        
    } catch (error) {
        console.error('Failed to load users:', error);
        return [];
    }
}

// Secure Session Management
async function saveSecureSession(sessionData) {
    try {
        const encryptedSession = await encryptData(JSON.stringify(sessionData));
        localStorage.setItem('linox_session_encrypted', encryptedSession);
        return true;
    } catch (error) {
        console.error('Failed to save session:', error);
        throw error;
    }
}

async function loadSecureSession() {
    try {
        const encryptedSession = localStorage.getItem('linox_session_encrypted');
        if (!encryptedSession) return null;
        
        const decryptedSession = await decryptData(encryptedSession);
        const sessionData = JSON.parse(decryptedSession);
        
        // Check if session is expired
        if (new Date(sessionData.expiresAt) < new Date()) {
            await clearSecureSession();
            return null;
        }
        
        return sessionData;
    } catch (error) {
        console.error('Failed to load session:', error);
        return null;
    }
}

async function clearSecureSession() {
    localStorage.removeItem('linox_session_encrypted');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('sessionExpires');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('fitnessGoal');
    localStorage.removeItem('experience');
}

// IndexedDB for larger data storage
async function saveToIndexedDB(storeName, data) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('LinoxFitnessDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const putRequest = store.put(data, 'primary');
            
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
        };
        
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        };
    });
}

async function loadFromIndexedDB(storeName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('LinoxFitnessDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const getRequest = store.get('primary');
            
            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = () => reject(getRequest.error);
        };
        
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        };
    });
}

// User Authentication Functions
async function authenticateUser(email, password) {
    try {
        const users = await loadSecureUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            return { success: false, error: 'Invalid email or password' };
        }
        
        const hashedPassword = await hashPassword(password, user.salt);
        
        if (hashedPassword !== user.passwordHash) {
            return { success: false, error: 'Invalid email or password' };
        }
        
        if (!user.isActive) {
            return { success: false, error: 'Account is deactivated' };
        }
        
        return { success: true, user };
    } catch (error) {
        console.error('Authentication failed:', error);
        return { success: false, error: 'Authentication failed' };
    }
}

async function createUserSession(user) {
    try {
        const sessionToken = generateSessionToken();
        const sessionData = {
            userId: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            token: sessionToken,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString(), // 7 days
            isAdmin: user.isAdmin || false
        };
        
        await saveSecureSession(sessionData);
        saveUserDataToLocalStorage(sessionData);
        
        return sessionData;
    } catch (error) {
        console.error('Failed to create session:', error);
        throw error;
    }
}

function saveUserDataToLocalStorage(sessionData) {
    localStorage.setItem('userEmail', sessionData.email);
    localStorage.setItem('userName', sessionData.name);
    localStorage.setItem('userId', sessionData.userId);
    localStorage.setItem('sessionToken', sessionData.token);
    localStorage.setItem('sessionExpires', sessionData.expiresAt);
    localStorage.setItem('isAdmin', sessionData.isAdmin || false);
}

// Session Validation
async function isUserAuthenticated() {
    try {
        const session = await loadSecureSession();
        return session !== null;
    } catch (error) {
        console.error('Session validation failed:', error);
        return false;
    }
}

async function getCurrentUser() {
    try {
        const session = await loadSecureSession();
        if (!session) return null;
        
        const users = await loadSecureUsers();
        return users.find(u => u.id === session.userId);
    } catch (error) {
        console.error('Failed to get current user:', error);
        return null;
    }
}

// Check if current user is admin
async function isCurrentUserAdmin() {
    try {
        const session = await loadSecureSession();
        return session && session.isAdmin;
    } catch (error) {
        console.error('Failed to check admin status:', error);
        return false;
    }
}

// Logout Function
async function logout() {
    try {
        await clearSecureSession();
        return true;
    } catch (error) {
        console.error('Logout failed:', error);
        return false;
    }
}

// Password Strength Checker
function checkPasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 8) score++;
    else feedback.push('At least 8 characters');
    
    // Contains lowercase
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Include lowercase letters');
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Include uppercase letters');
    
    // Contains numbers
    if (/\d/.test(password)) score++;
    else feedback.push('Include numbers');
    
    // Contains special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else feedback.push('Include special characters');
    
    return { score, feedback };
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// User Management Functions
async function createUser(userData) {
    try {
        const salt = generateSecureSalt();
        const hashedPassword = await hashPassword(userData.password, salt);
        
        const userObject = {
            id: generateSecureId(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email.toLowerCase(),
            passwordHash: hashedPassword,
            salt: salt,
            fitnessGoal: userData.fitnessGoal,
            experience: userData.experience,
            isAdmin: userData.isAdmin || false,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true,
            profileComplete: true
        };
        
        const existingUsers = await loadSecureUsers();
        const userExists = existingUsers.find(user => 
            user.email.toLowerCase() === userData.email.toLowerCase()
        );
        
        if (userExists) {
            return { success: false, error: 'User already exists' };
        }
        
        existingUsers.push(userObject);
        await saveSecureUsers(existingUsers);
        
        return { success: true, user: userObject };
    } catch (error) {
        console.error('Failed to create user:', error);
        return { success: false, error: 'Failed to create user' };
    }
}

async function updateUser(userId, updates) {
    try {
        const users = await loadSecureUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return { success: false, error: 'User not found' };
        }
        
        users[userIndex] = { ...users[userIndex], ...updates };
        await saveSecureUsers(users);
        
        return { success: true, user: users[userIndex] };
    } catch (error) {
        console.error('Failed to update user:', error);
        return { success: false, error: 'Failed to update user' };
    }
}

// Get all users (admin only)
async function getAllUsers() {
    try {
        const isAdmin = await isCurrentUserAdmin();
        if (!isAdmin) {
            return { success: false, error: 'Access denied. Admin privileges required.' };
        }
        
        const users = await loadSecureUsers();
        // Remove sensitive data before returning
        const safeUsers = users.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            fitnessGoal: user.fitnessGoal,
            experience: user.experience,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            isActive: user.isActive,
            profileComplete: user.profileComplete
        }));
        
        return { success: true, users: safeUsers };
    } catch (error) {
        console.error('Failed to get users:', error);
        return { success: false, error: 'Failed to get users' };
    }
}

// Initialize system on load
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultAccounts();
});

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeDefaultAccounts,
        createDefaultUser,
        hashPassword,
        generateSecureSalt,
        generateSecureId,
        generateSessionToken,
        encryptData,
        decryptData,
        saveSecureUsers,
        loadSecureUsers,
        saveSecureSession,
        loadSecureSession,
        clearSecureSession,
        saveToIndexedDB,
        loadFromIndexedDB,
        authenticateUser,
        createUserSession,
        saveUserDataToLocalStorage,
        isUserAuthenticated,
        getCurrentUser,
        isCurrentUserAdmin,
        logout,
        checkPasswordStrength,
        isValidEmail,
        createUser,
        updateUser,
        getAllUsers
    };
}
