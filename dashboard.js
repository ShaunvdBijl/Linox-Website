// Check if user is logged in
document.addEventListener('DOMContentLoaded', async function() {
    const isAuthenticated = await isUserAuthenticated();
    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        window.location.href = 'loginPage.html';
        return;
    }
    
    loadUserData();
    updateDashboardStats();
});

async function checkUserAuth() {
    const isAuthenticated = await isUserAuthenticated();
    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        window.location.href = 'loginPage.html';
        return;
    }
    
    // Update user name in dashboard
    const currentUser = await getCurrentUser();
    if (currentUser) {
        const userName = `${currentUser.firstName} ${currentUser.lastName}`;
        document.getElementById('userName').textContent = userName;
    }
}

function loadUserData() {
    // Load user data from localStorage or simulate API call
    const userData = {
        name: localStorage.getItem('userName') || 'John',
        email: localStorage.getItem('userEmail') || 'demo@linoxfitness.com',
        fitnessGoal: localStorage.getItem('fitnessGoal') || 'Weight Loss',
        experience: localStorage.getItem('experience') || 'Intermediate'
    };
    
    // Update dashboard with user data
    updateUserInfo(userData);
}

function updateUserInfo(userData) {
    // Update user-specific information on dashboard
    document.getElementById('userName').textContent = userData.name;
}

function updateDashboardStats() {
    // Update progress stats (in a real app, this would come from a database)
    const stats = {
        workoutsThisWeek: 4,
        caloriesBurned: 2450,
        weightProgress: -3.2,
        nextSession: 'Tomorrow'
    };
    
    // Update stats display
    updateStatsDisplay(stats);
}

function updateStatsDisplay(stats) {
    // Update the stats cards with current data
    // This would typically update the DOM elements with the stats
    console.log('Dashboard stats updated:', stats);
}

function markWorkoutComplete() {
    // Mark today's workout as complete
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Completing...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        button.textContent = '✓ Completed!';
        button.style.backgroundColor = '#28a745';
        button.style.borderColor = '#28a745';
        
        // Update workout count
        updateWorkoutCount();
        
        // Show success message
        showSuccessMessage('Workout marked as complete! Great job!');
        
        // Reset button after 3 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.style.backgroundColor = '';
            button.style.borderColor = '';
        }, 3000);
        
    }, 1500);
}

function updateWorkoutCount() {
    // Update the workout count in the stats
    const workoutCard = document.querySelector('.feature-card');
    if (workoutCard) {
        const countElement = workoutCard.querySelector('div');
        if (countElement) {
            const currentCount = parseInt(countElement.textContent);
            countElement.textContent = currentCount + 1;
        }
    }
}

function viewFullPlan() {
    // Navigate to full workout plan page
    window.location.href = 'workout-plans.html';
}

function showSuccessMessage(message) {
    // Create and show success message
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid #c3e6cb;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 3000);
}

async function logout() {
    // Clear user data and redirect to login
    await clearSecureSession();
    
    // Redirect to login page
    window.location.href = 'loginPage.html';
}

// Add active navigation highlighting
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Add hover effects for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = document.querySelectorAll('.feature-card, .btn-primary, .btn-secondary, .btn-outline');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Real-time updates (simulated)
function startRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        // Update any real-time data
        updateDashboardStats();
    }, 30000);
}

// Initialize real-time updates
document.addEventListener('DOMContentLoaded', function() {
    startRealTimeUpdates();
});

// Add CSS for active navigation
const style = document.createElement('style');
style.textContent = `
    .nav-menu a.active {
        color: #ffd700 !important;
        font-weight: bold;
    }
    
    .feature-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    }
    
    .btn-primary, .btn-secondary, .btn-outline {
        transition: all 0.3s ease;
    }
    
    .btn-primary:hover, .btn-secondary:hover, .btn-outline:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(style);
