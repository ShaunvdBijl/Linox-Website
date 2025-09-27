// Secure Login System
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(loginForm);
            const loginData = {
                email: formData.get('email'),
                password: formData.get('password'),
                rememberMe: formData.get('rememberMe')
            };
            
            // Validate form
            if (validateLoginForm(loginData)) {
                // Authenticate user securely
                authenticateUser(loginData);
            }
        });
    }
    
    // Add social login button functionality
    const socialButtons = document.querySelectorAll('button');
    socialButtons.forEach(button => {
        if (button.textContent.includes('Google') || button.textContent.includes('Facebook')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                handleSocialLogin(this.textContent.trim());
            });
        }
    });
    
    // Add input focus effects
    const inputs = document.querySelectorAll('input');
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
    
    // Add "Forgot Password" functionality
    const forgotPasswordLink = document.querySelector('a[href="#"]');
    if (forgotPasswordLink && forgotPasswordLink.textContent.includes('Forgot Password')) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
    }
    
    // Check for existing session
    checkExistingSession();
});

// Secure Authentication System
async function authenticateUser(loginData) {
    try {
        // Show loading state
        const submitButton = document.querySelector('#loginForm button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Authenticating...';
        submitButton.disabled = true;
        
        // Load secure users
        const users = await loadSecureUsers();
        
        // Find user by email
        const user = users.find(u => u.email.toLowerCase() === loginData.email.toLowerCase());
        
        if (!user) {
            showLoginErrors(['Invalid email or password. Please try again.']);
            resetButton(submitButton, originalText);
            return;
        }
        
        // Verify password
        const hashedPassword = await hashPassword(loginData.password, user.salt);
        
        if (hashedPassword !== user.passwordHash) {
            showLoginErrors(['Invalid email or password. Please try again.']);
            resetButton(submitButton, originalText);
            return;
        }
        
        // Check if account is active
        if (!user.isActive) {
            showLoginErrors(['Account is deactivated. Please contact support.']);
            resetButton(submitButton, originalText);
            return;
        }
        
        // Create secure session
        const sessionToken = generateSessionToken();
        const sessionData = {
            userId: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            token: sessionToken,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString() // 7 days
        };
        
        // Save session
        await saveSecureSession(sessionData);
        saveUserDataToLocalStorage(sessionData);
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        await saveSecureUsers(users);
        
        // Show success and redirect
        showLoginSuccess();
        
        setTimeout(() => {
            // Redirect admin users to admin portal, regular users to dashboard
            if (user.isAdmin) {
                window.location.href = 'admin-portal.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        }, 2000);
        
    } catch (error) {
        console.error('Authentication failed:', error);
        showLoginErrors(['Authentication failed. Please try again or contact support.']);
        resetButton(submitButton, originalText);
    }
}

// Check for existing valid session
async function checkExistingSession() {
    try {
        const session = await loadSecureSession();
        if (session) {
            // User is already logged in, redirect based on role
            if (session.isAdmin) {
                window.location.href = 'admin-portal.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        }
    } catch (error) {
        console.error('Session check failed:', error);
    }
}

// Secure Password Hashing (same as signup)
async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

// Generate session token
function generateSessionToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Secure User Storage (imported from signup system)
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

// Encryption/Decryption (imported from signup system)
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

// IndexedDB functions (imported from signup system)
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

// Form validation
function validateLoginForm(loginData) {
    const errors = [];
    
    if (!loginData.email.trim()) {
        errors.push('Email is required');
    } else if (!isValidEmail(loginData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!loginData.password) {
        errors.push('Password is required');
    }
    
    if (errors.length > 0) {
        showLoginErrors(errors);
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showLoginErrors(errors) {
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    
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
    errorTitle.textContent = 'Login Error:';
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
    
    const form = document.getElementById('loginForm');
    form.parentNode.insertBefore(errorContainer, form);
    
    setTimeout(() => {
        if (errorContainer.parentNode) {
            errorContainer.remove();
        }
    }, 5000);
}

function showLoginSuccess() {
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
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
        <h4 style="margin: 0 0 0.5rem 0;">Login Successful!</h4>
        <p style="margin: 0;">Welcome back! Redirecting to your dashboard...</p>
    `;
    
    const form = document.getElementById('loginForm');
    form.parentNode.insertBefore(successContainer, form);
}

function handleSocialLogin(provider) {
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = `Connecting to ${provider}...`;
    button.disabled = true;
    
    setTimeout(() => {
        showLoginErrors([`${provider} login is not available in demo mode. Please use email/password login.`]);
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

function handleForgotPassword() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 400px;
        width: 90%;
        text-align: center;
    `;
    
    modalContent.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: #1e1e2f;">Reset Password</h3>
        <p style="margin-bottom: 1.5rem; color: #666;">Enter your email address and we'll send you a link to reset your password.</p>
        <form id="forgotPasswordForm" style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
                <label for="resetEmail" style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #333;">Email Address</label>
                <input type="email" id="resetEmail" required style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem;">
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button type="submit" class="btn-primary" style="flex: 1; padding: 12px;">Send Reset Link</button>
                <button type="button" onclick="closeForgotPasswordModal()" style="flex: 1; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer;">Cancel</button>
            </div>
        </form>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('resetEmail').value;
        if (isValidEmail(email)) {
            modalContent.innerHTML = `
                <h3 style="margin-bottom: 1rem; color: #1e1e2f;">Check Your Email</h3>
                <p style="margin-bottom: 1.5rem; color: #666;">We've sent a password reset link to ${email}</p>
                <p style="font-size: 0.9rem; color: #666; margin-bottom: 1.5rem;">Note: Password reset functionality is not available in demo mode.</p>
                <button onclick="closeForgotPasswordModal()" class="btn-primary" style="width: 100%; padding: 12px;">Close</button>
            `;
        } else {
            alert('Please enter a valid email address');
        }
    });
}

function closeForgotPasswordModal() {
    const modal = document.querySelector('div[style*="position: fixed"]');
    if (modal) {
        modal.remove();
    }
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('loginPassword');
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
    
    input:focus {
        border-color: #667eea !important;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    }
`;
document.head.appendChild(style);
