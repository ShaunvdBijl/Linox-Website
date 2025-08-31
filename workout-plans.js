// Workout Plans Management System
document.addEventListener('DOMContentLoaded', async function() {
    await checkUserAuth();
    initializeWorkoutPlans();
});

async function checkUserAuth() {
    const isAuthenticated = await isUserAuthenticated();
    if (!isAuthenticated) {
        window.location.href = 'loginPage.html';
        return;
    }
}

function initializeWorkoutPlans() {
    // Add event listeners for workout plan interactions
    addWorkoutPlanEventListeners();
}

function addWorkoutPlanEventListeners() {
    // Add hover effects and click handlers for workout cards
    const workoutCards = document.querySelectorAll('.feature-card');
    workoutCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// View week details in modal
function viewWeekDetails(weekNumber) {
    const workoutDetails = getWeekWorkoutDetails(weekNumber);
    
    const modal = document.getElementById('workoutModal');
    const detailsDiv = document.getElementById('workoutDetails');
    
    detailsDiv.innerHTML = `
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
            <h4 style="margin: 0 0 1rem 0; color: #667eea;">Week ${weekNumber} Workout Plan</h4>
            <div style="margin-bottom: 1rem;">
                <strong>Focus:</strong> ${workoutDetails.focus}<br>
                <strong>Duration:</strong> ${workoutDetails.duration}<br>
                <strong>Intensity:</strong> ${workoutDetails.intensity}
            </div>
            <div>
                <strong>Workouts:</strong>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                    ${workoutDetails.workouts.map(workout => `<li>${workout}</li>`).join('')}
                </ul>
            </div>
        </div>
        <div style="background: #e8f4fd; padding: 1.5rem; border-radius: 8px;">
            <h4 style="margin: 0 0 1rem 0; color: #0056b3;">Instructions</h4>
            <ul style="margin: 0; padding-left: 1.5rem;">
                ${workoutDetails.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
            </ul>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function getWeekWorkoutDetails(weekNumber) {
    const workoutPlans = {
        1: {
            focus: 'Foundation Building',
            duration: '4 weeks',
            intensity: 'Beginner to Intermediate',
            workouts: [
                'Monday: Upper Body Strength (45 min)',
                'Wednesday: Lower Body & Core (45 min)',
                'Friday: Full Body Circuit (40 min)',
                'Sunday: Active Recovery & Stretching (30 min)'
            ],
            instructions: [
                'Focus on proper form and technique',
                'Start with lighter weights and gradually increase',
                'Take 60-90 seconds rest between sets',
                'Stay hydrated throughout your workouts'
            ]
        },
        5: {
            focus: 'Strength Development',
            duration: '4 weeks',
            intensity: 'Intermediate to Advanced',
            workouts: [
                'Monday: Push Day (60 min)',
                'Tuesday: Pull Day (60 min)',
                'Thursday: Legs & Core (60 min)',
                'Saturday: Full Body Power (50 min)'
            ],
            instructions: [
                'Increase weight progressively each week',
                'Focus on compound movements',
                'Maintain proper breathing patterns',
                'Include mobility work before each session'
            ]
        },
        9: {
            focus: 'Advanced Training',
            duration: '4 weeks',
            intensity: 'Advanced',
            workouts: [
                'Monday: Strength & Power (75 min)',
                'Wednesday: Hypertrophy Focus (70 min)',
                'Friday: Athletic Performance (65 min)',
                'Sunday: Recovery & Mobility (45 min)'
            ],
            instructions: [
                'Implement advanced training techniques',
                'Focus on mind-muscle connection',
                'Monitor recovery and adjust intensity',
                'Consider working with a spotter for heavy lifts'
            ]
        }
    };
    
    return workoutPlans[weekNumber] || workoutPlans[1];
}

// Mark workout as complete
function markWorkoutComplete(day) {
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Completing...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = '✓ Completed!';
        button.style.backgroundColor = '#28a745';
        button.style.borderColor = '#28a745';
        button.disabled = true;
        
        // Update the workout card to show completed status
        const workoutCard = button.closest('div[style*="border: 2px solid"]');
        if (workoutCard) {
            const statusDiv = workoutCard.querySelector('div[style*="margin-top: 1rem"]');
            if (statusDiv) {
                statusDiv.innerHTML = '<span style="color: #28a745; font-weight: bold;">✓ Completed</span>';
            }
        }
        
        showSuccessMessage('Workout marked as complete! Great job!');
        
    }, 1500);
}

// Download workout plan as PDF
function downloadWorkoutPlan() {
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Generating PDF...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = '✓ Downloaded!';
        button.style.backgroundColor = '#28a745';
        button.style.borderColor = '#28a745';
        
        showSuccessMessage('Workout plan downloaded successfully!');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.style.backgroundColor = '';
            button.style.borderColor = '';
        }, 3000);
        
    }, 2000);
}

// Request modification to workout plan
function requestModification() {
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Sending Request...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = '✓ Request Sent!';
        button.style.backgroundColor = '#28a745';
        button.style.borderColor = '#28a745';
        
        showSuccessMessage('Modification request sent to your trainer!');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.style.backgroundColor = '';
            button.style.borderColor = '';
        }, 3000);
        
    }, 1500);
}

// View progress
function viewProgress() {
    window.location.href = 'progress.html';
}

// Contact trainer
function contactTrainer() {
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Opening Chat...';
    button.disabled = true;
    
    setTimeout(() => {
        showSuccessMessage('Trainer chat feature coming soon!');
        button.textContent = originalText;
        button.disabled = false;
    }, 1000);
}

// Switch to different program
function switchProgram(programType) {
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Switching...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = '✓ Switched!';
        button.style.backgroundColor = '#28a745';
        button.style.borderColor = '#28a745';
        
        showSuccessMessage(`Successfully switched to ${programType} program!`);
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.style.backgroundColor = '';
            button.style.borderColor = '';
        }, 3000);
        
    }, 2000);
}

// Start workout
function startWorkout() {
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Starting...';
    button.disabled = true;
    
    setTimeout(() => {
        showSuccessMessage('Workout timer started! Good luck!');
        button.textContent = originalText;
        button.disabled = false;
    }, 1000);
}

// Close workout modal
function closeWorkoutModal() {
    document.getElementById('workoutModal').style.display = 'none';
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border: 1px solid #c3e6cb;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Logout function
async function logout() {
    await clearSecureSession();
    window.location.href = 'loginPage.html';
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
    
    .nav-menu a.active {
        color: #ffd700 !important;
        font-weight: bold;
    }
    
    #workoutModal {
        backdrop-filter: blur(5px);
    }
`;
document.head.appendChild(style);
