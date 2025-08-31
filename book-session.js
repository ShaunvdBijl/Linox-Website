// Global variables for booking
let selectedSessionType = 'personal';
let selectedSession = '';
let selectedDate = '';
let selectedTime = '';

document.addEventListener('DOMContentLoaded', function() {
    checkUserAuth();
    initializeBookingSystem();
});

async function checkUserAuth() {
    const isAuthenticated = await isUserAuthenticated();
    if (!isAuthenticated) {
        window.location.href = 'loginPage.html';
        return;
    }
}

function initializeBookingSystem() {
    // Set default session type
    showSessionType('personal');
    
    // Add event listeners for calendar
    addCalendarEventListeners();
}

function showSessionType(type) {
    // Hide all sections
    document.querySelectorAll('.session-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Reset button styles
    document.querySelectorAll('#personalBtn, #groupBtn, #specializedBtn').forEach(btn => {
        btn.className = 'btn-secondary';
    });
    
    // Show selected section
    const sectionId = type + 'Section';
    document.getElementById(sectionId).style.display = 'block';
    
    // Update button styles
    document.getElementById(type + 'Btn').className = 'btn-primary';
    
    selectedSessionType = type;
}

function bookSession(type, session) {
    selectedSession = session;
    selectedSessionType = type;
    
    // Show time slots
    document.getElementById('timeSlots').style.display = 'block';
    
    // Scroll to calendar
    document.querySelector('.about-preview').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    showSuccessMessage('Please select a date and time for your session.');
}

function selectDate(date) {
    // Remove previous selection
    document.querySelectorAll('[onclick^="selectDate"]').forEach(day => {
        day.style.backgroundColor = '';
        day.style.color = '';
    });
    
    // Highlight selected date
    event.target.style.backgroundColor = '#667eea';
    event.target.style.color = 'white';
    
    selectedDate = date;
    
    // Show time slots if session is selected
    if (selectedSession) {
        document.getElementById('timeSlots').style.display = 'block';
    }
}

function selectTime(time) {
    // Remove previous selection
    document.querySelectorAll('[onclick^="selectTime"]').forEach(btn => {
        btn.className = 'btn-outline';
    });
    
    // Highlight selected time
    event.target.className = 'btn-primary';
    
    selectedTime = time;
    
    // Show booking confirmation if all selections are made
    if (selectedSession && selectedDate && selectedTime) {
        showBookingConfirmation();
    }
}

function showBookingConfirmation() {
    const sessionDetails = getSessionDetails();
    
    const modal = document.getElementById('bookingModal');
    const detailsDiv = document.getElementById('bookingDetails');
    
    detailsDiv.innerHTML = `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
            <h4 style="margin: 0 0 0.5rem 0; color: #667eea;">Session Details</h4>
            <p><strong>Type:</strong> ${sessionDetails.name}</p>
            <p><strong>Date:</strong> January ${selectedDate}, 2025</p>
            <p><strong>Time:</strong> ${selectedTime}</p>
            <p><strong>Duration:</strong> ${sessionDetails.duration}</p>
            <p><strong>Price:</strong> ${sessionDetails.price}</p>
        </div>
        <div style="background: #e8f4fd; padding: 1rem; border-radius: 8px;">
            <h4 style="margin: 0 0 0.5rem 0; color: #0056b3;">What's Included</h4>
            <ul style="margin: 0; padding-left: 1.5rem;">
                ${sessionDetails.includes.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function getSessionDetails() {
    const sessionDetails = {
        'personal': {
            'one-on-one': {
                name: 'One-on-One Personal Training',
                duration: '60 minutes',
                price: '$75',
                includes: ['Personalized workout plan', 'Form correction', 'Progress tracking', 'Nutrition tips']
            },
            'express': {
                name: '30-Minute Express Training',
                duration: '30 minutes',
                price: '$45',
                includes: ['Quick intense workout', 'Basic form guidance', 'Workout summary']
            },
            'nutrition': {
                name: 'Nutrition Consultation',
                duration: '45 minutes',
                price: '$60',
                includes: ['Personalized meal plan', 'Macro calculations', 'Supplement recommendations', 'Lifestyle coaching']
            }
        },
        'group': {
            'hiit': {
                name: 'HIIT Cardio Class',
                duration: '45 minutes',
                price: '$20',
                includes: ['High-intensity workout', 'Group motivation', 'Calorie burn tracking']
            },
            'strength': {
                name: 'Strength Training Class',
                duration: '60 minutes',
                price: '$25',
                includes: ['Full body workout', 'Equipment instruction', 'Strength progression']
            },
            'yoga': {
                name: 'Yoga & Flexibility',
                duration: '60 minutes',
                price: '$18',
                includes: ['Flexibility training', 'Stress relief', 'Mindfulness practice']
            }
        },
        'specialized': {
            'weight-loss': {
                name: 'Weight Loss Program',
                duration: '8 weeks',
                price: '$400',
                includes: ['16 training sessions', 'Custom nutrition plan', 'Progress tracking', 'Weekly check-ins']
            },
            'muscle-building': {
                name: 'Muscle Building Program',
                duration: '12 weeks',
                price: '$600',
                includes: ['24 training sessions', 'Meal plan', 'Supplement guide', 'Progress photos']
            },
            'sports': {
                name: 'Sports Performance',
                duration: '6 weeks',
                price: '$350',
                includes: ['12 training sessions', 'Performance assessment', 'Sport-specific training', 'Recovery protocols']
            }
        }
    };
    
    return sessionDetails[selectedSessionType][selectedSession];
}

function confirmBooking() {
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Processing...';
    button.disabled = true;
    
    // Simulate booking process
    setTimeout(() => {
        // Save booking to localStorage (in a real app, this would go to a database)
        const booking = {
            id: Date.now(),
            type: selectedSessionType,
            session: selectedSession,
            date: selectedDate,
            time: selectedTime,
            details: getSessionDetails(),
            status: 'confirmed',
            timestamp: new Date().toISOString()
        };
        
        // Get existing bookings
        const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        existingBookings.push(booking);
        localStorage.setItem('userBookings', JSON.stringify(existingBookings));
        
        // Show success message
        closeBookingModal();
        showSuccessMessage('Booking confirmed! Check your email for details.');
        
        // Reset selections
        resetSelections();
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
    }, 2000);
}

function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

function resetSelections() {
    selectedSession = '';
    selectedDate = '';
    selectedTime = '';
    
    // Reset UI
    document.querySelectorAll('[onclick^="selectDate"]').forEach(day => {
        day.style.backgroundColor = '';
        day.style.color = '';
    });
    
    document.querySelectorAll('[onclick^="selectTime"]').forEach(btn => {
        btn.className = 'btn-outline';
    });
    
    document.getElementById('timeSlots').style.display = 'none';
}

function addCalendarEventListeners() {
    // Add hover effects to calendar days
    document.querySelectorAll('[onclick^="selectDate"]').forEach(day => {
        day.addEventListener('mouseenter', function() {
            if (this.style.backgroundColor !== 'rgb(102, 126, 234)') {
                this.style.backgroundColor = '#f8f9fa';
            }
        });
        
        day.addEventListener('mouseleave', function() {
            if (this.style.backgroundColor !== 'rgb(102, 126, 234)') {
                this.style.backgroundColor = '';
            }
        });
    });
    
    // Add hover effects to time slots
    document.querySelectorAll('[onclick^="selectTime"]').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.classList.contains('btn-primary')) {
                this.style.backgroundColor = '#667eea';
                this.style.color = 'white';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('btn-primary')) {
                this.style.backgroundColor = '';
                this.style.color = '';
            }
        });
    });
}

function showSuccessMessage(message) {
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
        max-width: 300px;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 4000);
}

async function logout() {
    await clearSecureSession();
    window.location.href = 'loginPage.html';
}

// Add CSS for enhanced styling
const style = document.createElement('style');
style.textContent = `
    .session-section {
        transition: opacity 0.3s ease;
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
    
    #bookingModal {
        backdrop-filter: blur(5px);
    }
    
    #timeSlots {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
