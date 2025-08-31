// Secure Account Management System
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(signupForm);
            const signupData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
                fitnessGoal: formData.get('fitnessGoal'),
                experience: formData.get('experience'),
                terms: formData.get('terms')
            };
            
            // Validate form
            if (validateSignupForm(signupData)) {
                // Create secure account
                createSecureAccount(signupData);
            }
        });
    }
    
    // Add real-time password confirmation validation
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (passwordInput && confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordConfirmation();
        });
        
        passwordInput.addEventListener('input', function() {
            updatePasswordStrengthIndicator();
            validatePasswordConfirmation();
        });
    }
    
    // Add input focus effects
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
            this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '#e9ecef';
            this.style.boxShadow = 'none';
        });
    });
});

// Secure Account Creation System
async function createSecureAccount(userData) {
    try {
        // Show loading state
        const submitButton = document.querySelector('#signupForm button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Creating Account...';
        submitButton.disabled = true;
        
        // Step 1: Generate secure salt and hash password
        const salt = generateSecureSalt();
        const hashedPassword = await hashPassword(userData.password, salt);
        
        // Step 2: Create user object with encrypted data
        const userObject = {
            id: generateSecureId(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email.toLowerCase(),
            passwordHash: hashedPassword,
            salt: salt,
            fitnessGoal: userData.fitnessGoal,
            experience: userData.experience,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true,
            profileComplete: true
        };
        
        // Step 3: Check if user already exists
        const existingUsers = await loadSecureUsers();
        const userExists = existingUsers.find(user => 
            user.email.toLowerCase() === userData.email.toLowerCase()
        );
        
        if (userExists) {
            showErrors(['An account with this email already exists. Please use a different email or try logging in.']);
            resetButton(submitButton, originalText);
            return;
        }
        
        // Step 4: Save user to secure storage
        existingUsers.push(userObject);
        await saveSecureUsers(existingUsers);
        
        // Step 5: Create user session
        const sessionToken = generateSessionToken();
        const sessionData = {
            userId: userObject.id,
            email: userObject.email,
            name: `${userObject.firstName} ${userObject.lastName}`,
            token: sessionToken,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString() // 7 days
        };
        
        // Step 6: Save session and user data
        await saveSecureSession(sessionData);
        saveUserDataToLocalStorage(sessionData);
        
        // Step 7: Show success and redirect
        showSuccessMessage('Account created successfully! Welcome to LinoxFitness!');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
    } catch (error) {
        console.error('Account creation failed:', error);
        showErrors(['Account creation failed. Please try again or contact support.']);
        resetButton(submitButton, originalText);
    }
}

// Secure Password Hashing using Web Crypto API
async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    
    // Use SHA-256 for hashing
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

// Secure User Storage System
async function saveSecureUsers(users) {
    try {
        // Encrypt user data before storing
        const encryptedData = await encryptData(JSON.stringify(users));
        
        // Store in localStorage with encryption
        localStorage.setItem('linox_users_encrypted', encryptedData);
        
        // Also create a backup in IndexedDB for larger datasets
        await saveToIndexedDB('users', encryptedData);
        
        return true;
    } catch (error) {
        console.error('Failed to save users:', error);
        throw error;
    }
}

async function loadSecureUsers() {
    try {
        // Try to load from localStorage first
        let encryptedData = localStorage.getItem('linox_users_encrypted');
        
        if (!encryptedData) {
            // Try to load from IndexedDB
            encryptedData = await loadFromIndexedDB('users');
        }
        
        if (!encryptedData) {
            return [];
        }
        
        // Decrypt and parse user data
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
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('fitnessGoal');
    localStorage.removeItem('experience');
}

// Encryption/Decryption using Web Crypto API
async function encryptData(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Generate encryption key
    const key = await crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256
        },
        true,
        ['encrypt', 'decrypt']
    );
    
    // Generate IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt data
    const encryptedBuffer = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        dataBuffer
    );
    
    // Export key
    const exportedKey = await crypto.subtle.exportKey('raw', key);
    
    // Combine IV, key, and encrypted data
    const combined = new Uint8Array(iv.length + exportedKey.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(exportedKey), iv.length);
    combined.set(new Uint8Array(encryptedBuffer), iv.length + exportedKey.length);
    
    return btoa(String.fromCharCode(...combined));
}

async function decryptData(encryptedData) {
    try {
        // Decode from base64
        const combined = new Uint8Array(atob(encryptedData).split('').map(char => char.charCodeAt(0)));
        
        // Extract IV, key, and encrypted data
        const iv = combined.slice(0, 12);
        const exportedKey = combined.slice(12, 44);
        const encryptedBuffer = combined.slice(44);
        
        // Import key
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
        
        // Decrypt data
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

// Save user data to localStorage for compatibility
function saveUserDataToLocalStorage(sessionData) {
    localStorage.setItem('userEmail', sessionData.email);
    localStorage.setItem('userName', sessionData.name);
    localStorage.setItem('userId', sessionData.userId);
    localStorage.setItem('sessionToken', sessionData.token);
    localStorage.setItem('sessionExpires', sessionData.expiresAt);
}

// Form validation functions
function validateSignupForm(signupData) {
    const errors = [];
    
    // Required fields
    if (!signupData.firstName.trim()) errors.push('First name is required');
    if (!signupData.lastName.trim()) errors.push('Last name is required');
    if (!signupData.email.trim()) errors.push('Email is required');
    if (!signupData.password) errors.push('Password is required');
    if (!signupData.confirmPassword) errors.push('Please confirm your password');
    if (!signupData.fitnessGoal) errors.push('Please select your fitness goal');
    if (!signupData.experience) errors.push('Please select your experience level');
    if (!signupData.terms) errors.push('You must accept the terms and conditions');
    
    // Email validation
    if (signupData.email && !isValidEmail(signupData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Password validation
    if (signupData.password) {
        const passwordStrength = checkPasswordStrength(signupData.password);
        if (passwordStrength.score < 2) {
            errors.push('Password is too weak. Please choose a stronger password');
        }
    }
    
    // Password confirmation
    if (signupData.password && signupData.confirmPassword && 
        signupData.password !== signupData.confirmPassword) {
        errors.push('Passwords do not match');
    }
    
    if (errors.length > 0) {
        showErrors(errors);
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

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

function updatePasswordStrengthIndicator() {
    const password = document.getElementById('password').value;
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (!strengthIndicator) return;
    
    const strength = checkPasswordStrength(password);
    const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthColors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#20c997', '#198754'];
    
    strengthIndicator.textContent = strengthText[strength.score] || 'Very Weak';
    strengthIndicator.style.color = strengthColors[strength.score] || '#dc3545';
}

function validatePasswordConfirmation() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmPasswordInput.style.borderColor = '#dc3545';
        confirmPasswordInput.setCustomValidity('Passwords do not match');
    } else {
        confirmPasswordInput.style.borderColor = '#28a745';
        confirmPasswordInput.setCustomValidity('');
    }
}

function showErrors(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.style.cssText = `
        background-color: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border: 1px solid #f5c6cb;
    `;
    
    const errorTitle = document.createElement('h4');
    errorTitle.textContent = 'Please fix the following errors:';
    errorTitle.style.margin = '0 0 0.5rem 0';
    errorContainer.appendChild(errorTitle);
    
    const errorList = document.createElement('ul');
    errorList.style.margin = '0';
    errorList.style.paddingLeft = '1.5rem';
    
    errors.forEach(error => {
        const errorItem = document.createElement('li');
        errorItem.textContent = error;
        errorList.appendChild(errorItem);
    });
    
    errorContainer.appendChild(errorList);
    
    // Insert error container before the form
    const form = document.getElementById('signupForm');
    form.parentNode.insertBefore(errorContainer, form);
    
    // Auto-remove error messages after 8 seconds
    setTimeout(() => {
        if (errorContainer.parentNode) {
            errorContainer.remove();
        }
    }, 8000);
}

function showSuccessMessage(message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create success message
    const successContainer = document.createElement('div');
    successContainer.className = 'success-message';
    successContainer.style.cssText = `
        background-color: #d4edda;
        color: #155724;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border: 1px solid #c3e6cb;
        text-align: center;
    `;
    
    successContainer.innerHTML = `
        <h4 style="margin: 0 0 0.5rem 0;">Account Created Successfully!</h4>
        <p style="margin: 0;">${message}</p>
    `;
    
    // Insert success message before the form
    const form = document.getElementById('signupForm');
    form.parentNode.insertBefore(successContainer, form);
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('togglePassword');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '🙈';
        toggleButton.title = 'Hide password';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁️';
        toggleButton.title = 'Show password';
    }
}

// Toggle confirm password visibility
function toggleConfirmPasswordVisibility() {
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const toggleButton = document.getElementById('toggleConfirmPassword');
    
    if (confirmPasswordInput.type === 'password') {
        confirmPasswordInput.type = 'text';
        toggleButton.textContent = '🙈';
        toggleButton.title = 'Hide password';
    } else {
        confirmPasswordInput.type = 'password';
        toggleButton.textContent = '👁️';
        toggleButton.title = 'Show password';
    }
}

function resetButton(button, originalText) {
    button.textContent = originalText;
    button.disabled = false;
}

// Add CSS for enhanced styling
const style = document.createElement('style');
style.textContent = `
    .error-message {
        animation: slideIn 0.3s ease;
    }
    
    .success-message {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    input:invalid {
        border-color: #dc3545;
    }
    
    input:valid {
        border-color: #28a745;
    }
    
    .password-strength {
        font-size: 0.9rem;
        font-weight: bold;
        margin-top: 0.5rem;
    }
`;
document.head.appendChild(style);
