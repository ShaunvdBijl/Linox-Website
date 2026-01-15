// Firebase imports
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { firebaseDB } from './firebase-database.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from './firebase-config.js'; // Ensure we can access db directly if needed or via firebaseDB

// Initialize Auth
const auth = getAuth();

// State management
let currentUser = null;
let currentCustomerId = null;

document.addEventListener('DOMContentLoaded', async function () {
    // Check authentication state
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            console.log('User authenticated:', user.email);

            // Get customer ID
            await loadUserProfile(user.uid);

            // Load dashboard data
            await Promise.all([
                loadDashboardStats(),
                loadNextTraining(),
                loadTodaysWorkout(),
                loadUpcomingSessions(),
                loadRecentActivity(),
                loadVisualProgress(),
                loadGoals(),
                loadHistory()
            ]);

            startRealTimeUpdates();
        } else {
            console.log('No user authenticated, redirecting...');
            window.location.href = 'loginPage.html';
        }
    });

    // Add hover effects
    initHoverEffects();

    // Highlight active nav
    highlightActiveNav();
});

async function loadUserProfile(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const userName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Athlete';

            // Update UI name
            const userNameElement = document.getElementById('userName');
            if (userNameElement) userNameElement.textContent = userName;

            // Determine Customer ID (it might be the same as Auth UID or stored in profile)
            currentCustomerId = userData.customerId || userId;
            console.log('Customer ID loaded:', currentCustomerId);
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

async function loadDashboardStats() {
    if (!currentCustomerId) return;

    // Default stats
    let sessionsCount = 0;
    let skillRating = '-';
    let fitnessProgress = '-';
    let sessionGoal = 3; // Default goal

    try {
        // 1. Sessions This Week
        // Fetch schedules for this customer to count completed sessions this week
        const { success: scheduleSuccess, schedules } = await firebaseDB.getCustomerSchedule(currentCustomerId);

        if (scheduleSuccess && schedules) {
            const now = new Date();
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            startOfWeek.setHours(0, 0, 0, 0);

            sessionsCount = schedules.filter(s => {
                const sessionDate = s.date.toDate(); // timestamp to Date
                return sessionDate >= startOfWeek && s.status === 'completed';
            }).length;
        }

        // 2. Skill Rating & Fitness Progress
        // These might come from a 'customerStats' or 'progress' collection. 
        // For now, we'll try to fetch from the customer document if fields exist, or 'progress' collection
        const { success: customerSuccess, customer } = await firebaseDB.getCustomer(currentCustomerId);
        if (customerSuccess && customer) {
            if (customer.skillRating) skillRating = `${customer.skillRating}/10`;
            if (customer.fitnessProgress) fitnessProgress = `${customer.fitnessProgress}%`;
            if (customer.sessionGoal) sessionGoal = customer.sessionGoal;
        }

    } catch (error) {
        console.error('Error loading stats:', error);
    }

    // Update UI
    updateElement('sessionsThisWeek', sessionsCount);
    updateElement('sessionsGoal', sessionGoal);
    updateElement('skillRating', skillRating);
    updateElement('fitnessProgress', fitnessProgress);
}

async function loadNextTraining() {
    if (!currentCustomerId) return;

    try {
        const { success, schedules } = await firebaseDB.getCustomerSchedule(currentCustomerId);

        // Find next upcoming confirmed session
        const now = new Date();
        let nextSession = null;

        if (success && schedules) {
            const upcoming = schedules
                .filter(s => s.date.toDate() > now && s.status !== 'cancelled')
                .sort((a, b) => a.date.toDate() - b.date.toDate());

            if (upcoming.length > 0) {
                nextSession = upcoming[0];
            }
        }

        if (nextSession) {
            const date = nextSession.date.toDate();
            const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Check if it's tomorrow, today, or a date
            const isToday = isSameDay(date, new Date());
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const isTomorrow = isSameDay(date, tomorrow);

            let dateDisplay = date.toLocaleDateString();
            if (isToday) dateDisplay = 'Today';
            if (isTomorrow) dateDisplay = 'Tomorrow';

            updateElement('nextTrainingTime', dateDisplay);
            updateElement('nextTrainingType', `${timeString} - ${nextSession.type || 'Training'}`);
        } else {
            updateElement('nextTrainingTime', 'No session');
            updateElement('nextTrainingType', 'Book a session');
        }

    } catch (error) {
        console.error('Error loading next training:', error);
    }
}

async function loadTodaysWorkout() {
    if (!currentCustomerId) return;

    const container = document.getElementById('todaysWorkoutContent');
    if (!container) return;

    try {
        // Fetch assigned workouts
        const { success, workouts } = await firebaseDB.getCustomerWorkouts(currentCustomerId);

        // Simple logic: Is there a workout assigned for "today"? 
        // Note: The schema for workouts isn't explicitly date-based in FIREBASE_SETUP.md, 
        // usually workouts are plans assigned to a user. We might check if there's a schedule for today with a linked workout.
        // For this implementation, we will fetch the most recently created active workout plan

        let todaysWorkout = null;
        if (success && workouts && workouts.length > 0) {
            todaysWorkout = workouts[0]; // Just take the latest for now
        }

        if (todaysWorkout) {
            let exercisesHtml = '';
            if (todaysWorkout.exercises && Array.isArray(todaysWorkout.exercises)) {
                exercisesHtml = todaysWorkout.exercises.map(ex => `
                    <li style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                        <strong>${ex.name}:</strong> ${ex.sets} sets x ${ex.reps} reps
                    </li>
                 `).join('');
            }

            container.innerHTML = `
                <h3 style="color: #1e3a8a; margin-bottom: 1rem;">${todaysWorkout.title || 'Daily Workout'}</h3>
                <ul style="list-style: none; padding: 0;">
                    ${exercisesHtml || '<li>No exercises listed.</li>'}
                </ul>
                <div style="margin-top: 1.5rem;">
                  <button class="btn-primary" onclick="window.markWorkoutComplete('${todaysWorkout.id}')">Mark as Complete</button>
                  <button class="btn-secondary" onclick="window.viewFullPlan()">View Full Plan</button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div style="text-align: center; color: #666; padding: 2rem;">
                    <p>No workout planned for today. Enjoy your rest day!</p>
                    <a href="workout-plans.html" class="btn-primary" style="margin-top: 1rem; display: inline-block;">Browse Plans</a>
                </div>
            `;
        }

    } catch (error) {
        console.error('Error loading workout:', error);
        container.innerHTML = '<p>Error loading workout.</p>';
    }
}

async function loadUpcomingSessions() {
    if (!currentCustomerId) return;

    const container = document.getElementById('upcomingSessionsList');
    if (!container) return;

    try {
        const { success, schedules } = await firebaseDB.getCustomerSchedule(currentCustomerId);

        if (success && schedules) {
            const now = new Date();
            const upcoming = schedules
                .filter(s => s.date.toDate() > now && s.status !== 'cancelled')
                .sort((a, b) => a.date.toDate() - b.date.toDate())
                .slice(0, 3); // Take next 3

            if (upcoming.length > 0) {
                container.innerHTML = upcoming.map(session => {
                    const date = session.date.toDate();
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return `
                      <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem;">
                        <strong>${dayName} - ${timeString}</strong><br>
                        ${session.type || 'Training'} with Coach Lee
                      </div>
                    `;
                }).join('');
            } else {
                container.innerHTML = '<p style="color: #666; font-style: italic;">No upcoming sessions scheduled.</p>';
            }
        }
    } catch (error) {
        console.error('Error loading schedule:', error);
    }
}

async function loadRecentActivity() {
    if (!currentCustomerId) return;

    const container = document.getElementById('recentActivityList');
    if (!container) return;

    try {
        // We could fetch from a specific 'activities' collection or infer from completed sessions
        const { success, schedules } = await firebaseDB.getCustomerSchedule(currentCustomerId);

        const completedSessions = (success && schedules)
            ? schedules.filter(s => s.status === 'completed').sort((a, b) => b.date.toDate() - a.date.toDate()).slice(0, 3)
            : [];

        // For demo purposes, we will just show completed sessions as "activity"
        // In a real app, you might have achievement unlocks, etc.

        if (completedSessions.length > 0) {
            container.innerHTML = completedSessions.map(session => {
                const date = session.date.toDate();
                return `
                  <div class="service-card" style="padding: 1rem;">
                    <h3>✅ Completed Session</h3>
                    <p><strong>${session.type}</strong></p>
                    <small style="color: #666;">${date.toLocaleDateString()} at ${date.toLocaleTimeString()}</small>
                  </div>
                `;
            }).join('');
        } else {
            container.innerHTML = '<p>No recent activity recorded.</p>';
        }
    } catch (error) {
        console.error('Error loading activity:', error);
    }
}


async function loadVisualProgress() {
    if (!currentCustomerId) return;

    try {
        const ctx = document.getElementById('progressChart').getContext('2d');

        // Mock Data
        const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
        const weightData = [80, 79.5, 79, 78.5, 78];
        const strengthData = [100, 105, 105, 110, 115];

        if (window.myChart) window.myChart.destroy();

        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Body Weight (kg)',
                    data: weightData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    yAxisID: 'y',
                    tension: 0.3
                }, {
                    label: 'Squat Max (kg)',
                    data: strengthData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Weight (kg)' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Strength (kg)' },
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                }
            }
        });

    } catch (error) {
        console.error('Error loading chart:', error);
    }
}

async function loadGoals() {
    if (!currentCustomerId) return;

    // Mock Goal Data
    const goal = {
        title: "Weight Loss Goal",
        target: "75kg (Current: 78kg)",
        progress: 60,
        deadline: "2025-06-01"
    };

    try {
        updateElement('goalTitle', goal.title);
        updateElement('goalTarget', `Target: ${goal.target}`);
        updateElement('goalPercentage', `${goal.progress}%`);

        const progressBar = document.getElementById('goalProgressBar');
        if (progressBar) progressBar.style.width = `${goal.progress}%`;

    } catch (error) {
        console.error('Error loading goals:', error);
    }
}

async function loadHistory() {
    if (!currentCustomerId) return;

    const container = document.getElementById('sessionHistoryBody');
    if (!container) return;

    try {
        const { success, schedules } = await firebaseDB.getCustomerSchedule(currentCustomerId);

        const history = (success && schedules)
            ? schedules.filter(s => s.status === 'completed' || s.status === 'cancelled').sort((a, b) => b.date.toDate() - a.date.toDate()).slice(0, 5)
            : [];

        if (history.length > 0) {
            container.innerHTML = history.map(session => {
                const date = session.date.toDate().toLocaleDateString();
                let statusColor = '#28a745';
                if (session.status === 'cancelled') statusColor = '#dc3545';

                return `
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 1rem;">${date}</td>
                    <td style="padding: 1rem;">${session.type || 'Training'}</td>
                    <td style="padding: 1rem;">${session.trainer || 'Coach Lee'}</td>
                    <td style="padding: 1rem;">
                      <span style="background: ${statusColor}20; color: ${statusColor}; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.85rem;">
                        ${session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                `;
            }).join('');
        } else {
            container.innerHTML = `
                <tr>
                    <td colspan="4" style="padding: 2rem; text-align: center; color: #666;">
                        No training history found. Complete your first session!
                    </td>
                </tr>
             `;
        }

    } catch (error) {
        console.error('Error loading history:', error);
    }
}

// --- Helper Functions ---

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}


function initHoverEffects() {
    const interactiveElements = document.querySelectorAll('.feature-card, .btn-primary, .btn-secondary, .btn-outline');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.3s ease';
        });
        element.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
}

function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// --- Global Functions (for onclick handlers) ---

window.markWorkoutComplete = function (workoutId) {
    const button = event.target;
    button.textContent = 'Completing...';
    button.disabled = true;

    // Here we would call an API update
    // await firebaseDB.updateWorkout(workoutId, { status: 'completed' });

    setTimeout(() => {
        button.textContent = '✓ Completed!';
        button.style.backgroundColor = '#28a745';
        button.style.borderColor = '#28a745';

        // Show success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: #d4edda; color: #155724;
            padding: 1rem; border-radius: 8px; border: 1px solid #c3e6cb; z-index: 1000;
        `;
        successDiv.textContent = 'Workout marked as complete! Great job!';
        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
            // Reload stats to reflect completion
            loadDashboardStats();
            loadRecentActivity();
        }, 2000);
    }, 1000);
};

window.viewFullPlan = function () {
    window.location.href = 'workout-plans.html';
};

window.logout = async function () {
    try {
        await signOut(auth);
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = 'loginPage.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
};

function startRealTimeUpdates() {
    // Poll every minute for updates if needed, or rely on Firestore snapshots (better)
    setInterval(() => {
        loadDashboardStats();
    }, 60000);
}
