// Check authentication status and update navigation
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    updateCTAButtons();
});

function checkAuthStatus() {
    const userEmail = localStorage.getItem('userEmail');
    const memberPortal = document.getElementById('memberPortal');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginLink = document.querySelector('a[href="loginPage.html"]');
    const signUpLink = document.querySelector('a[href="signUp.html"]');
    
    // Footer links
    const dashboardLink = document.getElementById('dashboardLink');
    const bookingLink = document.getElementById('bookingLink');
    const workoutLink = document.getElementById('workoutLink');
    
    if (userEmail) {
        // User is logged in
        if (memberPortal) memberPortal.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (loginLink) loginLink.textContent = 'Welcome, ' + (localStorage.getItem('userName') || 'Member');
        if (signUpLink) signUpLink.style.display = 'none';
        
        // Show footer links for logged-in users
        if (dashboardLink) dashboardLink.style.display = 'block';
        if (bookingLink) bookingLink.style.display = 'block';
        if (workoutLink) workoutLink.style.display = 'block';
    } else {
        // User is not logged in
        if (memberPortal) memberPortal.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (loginLink) loginLink.textContent = 'Login';
        if (signUpLink) signUpLink.style.display = 'block';
        
        // Hide footer links for non-logged-in users
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (bookingLink) bookingLink.style.display = 'none';
        if (workoutLink) workoutLink.style.display = 'none';
    }
}

function updateCTAButtons() {
    const userEmail = localStorage.getItem('userEmail');
    
    // Update "Start Your Journey" button
    const startJourneyBtn = document.querySelector('.hero-buttons .btn-primary');
    if (startJourneyBtn) {
        if (userEmail) {
            startJourneyBtn.textContent = 'Go to Dashboard';
            startJourneyBtn.onclick = function() {
                window.location.href = 'dashboard.html';
            };
        } else {
            startJourneyBtn.textContent = 'Start Your Journey';
            startJourneyBtn.onclick = function() {
                window.location.href = 'signUp.html';
            };
        }
    }
    
    // Update "Get Started Now" button
    const getStartedBtn = document.querySelector('.cta-buttons .btn-primary');
    if (getStartedBtn) {
        if (userEmail) {
            getStartedBtn.textContent = 'Book a Session';
            getStartedBtn.onclick = function() {
                window.location.href = 'book-session.html';
            };
        } else {
            getStartedBtn.textContent = 'Get Started Now';
            getStartedBtn.onclick = function() {
                window.location.href = 'signUp.html';
            };
        }
    }
    
    // Update "Learn More" button
    const learnMoreBtn = document.querySelector('.hero-buttons .btn-secondary');
    if (learnMoreBtn) {
        if (userEmail) {
            learnMoreBtn.textContent = 'View Workout Plans';
            learnMoreBtn.onclick = function() {
                window.location.href = 'workout-plans.html';
            };
        } else {
            learnMoreBtn.textContent = 'Learn More';
            learnMoreBtn.onclick = function() {
                window.location.href = 'about.html';
            };
        }
    }
}

function logout() {
    // Clear user data
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('fitnessGoal');
    localStorage.removeItem('experience');
    
    // Update navigation
    checkAuthStatus();
    updateCTAButtons();
    
    // Show logout message
    showMessage('Successfully logged out!', 'success');
    
    // Redirect to home page after a short delay
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

function showMessage(message, type = 'info') {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease;
    `;
    
    // Set background color based on message type
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#dc3545';
    } else {
        messageDiv.style.backgroundColor = '#17a2b8';
    }
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .nav-menu li {
        transition: all 0.3s ease;
    }
    
    .nav-menu a {
        transition: color 0.3s ease;
    }
    
    .nav-menu a:hover {
        color: #ffd700 !important;
    }
    
    .btn-primary, .btn-secondary {
        transition: all 0.3s ease;
    }
    
    .btn-primary:hover, .btn-secondary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(style);