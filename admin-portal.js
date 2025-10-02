// Admin Portal JavaScript
class AdminPortal {
  constructor() {
    this.customers = [];
    this.filteredCustomers = [];
    this.init();
  }

  init() {
    this.checkAdminAuth();
    this.loadCustomers();
    this.setupEventListeners();
    this.updateStats();
  }

  checkAdminAuth() {
    // Check if user is logged in as admin
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Access denied. Admin privileges required.');
      window.location.href = 'loginPage.html';
      return;
    }
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  loadCustomers() {
    // Load customers from localStorage (in a real app, this would be from a database)
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    this.customers = customers;
    this.filteredCustomers = [...customers];
    this.renderCustomers();
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
      this.filterCustomers();
    });

    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    statusFilter.addEventListener('change', (e) => {
      this.filterCustomers();
    });

    // Sort functionality
    const sortBy = document.getElementById('sortBy');
    sortBy.addEventListener('change', (e) => {
      this.filterCustomers();
    });
  }

  filterCustomers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const sortBy = document.getElementById('sortBy').value;

    // Filter by search term
    let filtered = this.customers.filter(customer => {
      const matchesSearch = !searchTerm || 
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort customers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.joinDate) - new Date(a.joinDate);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    this.filteredCustomers = filtered;
    this.renderCustomers();
  }

  renderCustomers() {
    const grid = document.getElementById('customersGrid');
    const noCustomers = document.getElementById('noCustomers');

    if (this.filteredCustomers.length === 0) {
      grid.style.display = 'none';
      noCustomers.style.display = 'block';
      return;
    }

    grid.style.display = 'grid';
    noCustomers.style.display = 'none';

    grid.innerHTML = this.filteredCustomers.map(customer => this.createCustomerCard(customer)).join('');
  }

  createCustomerCard(customer) {
    const statusClass = `status-${customer.status}`;
    const statusText = customer.status.charAt(0).toUpperCase() + customer.status.slice(1);
    const initials = customer.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const joinDate = new Date(customer.joinDate).toLocaleDateString();

    return `
      <div class="customer-card" data-customer-id="${customer.id}">
        <div class="customer-card-content">
          <div class="customer-header">
            <div class="customer-avatar">
              ${initials}
            </div>
            <div class="customer-info">
              <h3>${customer.name}</h3>
              <p>${customer.email}</p>
              <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
          </div>

          <div class="customer-details">
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${customer.phone}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Join Date:</span>
              <span class="detail-value">${joinDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Training Level:</span>
              <span class="detail-value">${customer.trainingLevel || 'Not Set'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Last Activity:</span>
              <span class="detail-value">${customer.lastActivity || 'Never'}</span>
            </div>
          </div>

          <div class="customer-actions">
            <button class="action-btn btn-primary" onclick="adminPortal.viewCustomer(${customer.id})">
              View Details
            </button>
            <button class="action-btn btn-secondary" onclick="adminPortal.manageSchedule(${customer.id})">
              Manage Schedule
            </button>
            <button class="action-btn btn-secondary" onclick="adminPortal.recommendExercises(${customer.id})">
              Recommend Exercises
            </button>
          </div>
        </div>
      </div>
    `;
  }

  updateStats() {
    const total = this.customers.length;
    const active = this.customers.filter(c => c.status === 'active').length;
    const pending = this.customers.filter(c => c.status === 'pending').length;
    
    // Calculate new customers this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newThisWeek = this.customers.filter(c => new Date(c.joinDate) > oneWeekAgo).length;

    document.getElementById('totalCustomers').textContent = total;
    document.getElementById('activeCustomers').textContent = active;
    document.getElementById('pendingCustomers').textContent = pending;
    document.getElementById('newThisWeek').textContent = newThisWeek;
  }

  viewCustomer(customerId) {
    const customer = this.customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Show customer details in a modal
    this.showCustomerModal(customer);
  }

  manageSchedule(customerId) {
    const customer = this.customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Show schedule management modal
    this.showScheduleModal(customer);
  }

  recommendExercises(customerId) {
    const customer = this.customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Show exercise recommendation modal
    this.showExerciseModal(customer);
  }

  showCustomerModal(customer) {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Customer Details - ${customer.name}</h2>
          <button class="btn-close" onclick="this.closest('.admin-modal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="customer-detail-grid">
            <div class="detail-section">
              <h3>Personal Information</h3>
              <p><strong>Name:</strong> ${customer.name}</p>
              <p><strong>Email:</strong> ${customer.email}</p>
              <p><strong>Phone:</strong> ${customer.phone}</p>
              <p><strong>Join Date:</strong> ${new Date(customer.joinDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span class="status-badge status-${customer.status}">${customer.status}</span></p>
            </div>
            <div class="detail-section">
              <h3>Training Information</h3>
              <p><strong>Training Level:</strong> ${customer.trainingLevel || 'Not Set'}</p>
              <p><strong>Last Activity:</strong> ${customer.lastActivity || 'Never'}</p>
              <p><strong>Goals:</strong></p>
              <ul>
                ${customer.goals ? customer.goals.map(goal => `<li>${goal}</li>`).join('') : '<li>No goals set</li>'}
              </ul>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" onclick="this.closest('.admin-modal').remove()">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
  }

  showScheduleModal(customer) {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Manage Schedule - ${customer.name}</h2>
          <button class="btn-close" onclick="this.closest('.admin-modal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="schedule-management">
            <h3>Current Bookings</h3>
            <div class="booking-list">
              <p>No current bookings found.</p>
            </div>
            <div class="schedule-actions">
              <h3>Schedule Actions</h3>
              <button class="btn-primary" onclick="adminPortal.schedulePersonalTraining('${customer.id}')">
                Schedule Personal Training
              </button>
              <button class="btn-secondary" onclick="adminPortal.viewClassSchedule('${customer.id}')">
                View Class Schedule
              </button>
              <button class="btn-secondary" onclick="adminPortal.sendReminder('${customer.id}')">
                Send Reminder
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" onclick="this.closest('.admin-modal').remove()">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
  }

  showExerciseModal(customer) {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Exercise Recommendations - ${customer.name}</h2>
          <button class="btn-close" onclick="this.closest('.admin-modal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="exercise-recommendations">
            <div class="current-level">
              <h3>Current Training Level: ${customer.trainingLevel || 'Not Set'}</h3>
            </div>
            <div class="recommendations">
              <h3>Recommended Exercises</h3>
              <div class="exercise-categories">
                <div class="exercise-category">
                  <h4>Technical Skills</h4>
                  <ul>
                    <li>Ball Control Drills</li>
                    <li>Passing Accuracy</li>
                    <li>Shooting Practice</li>
                    <li>Dribbling Techniques</li>
                  </ul>
                </div>
                <div class="exercise-category">
                  <h4>Physical Conditioning</h4>
                  <ul>
                    <li>Cardio Endurance</li>
                    <li>Strength Training</li>
                    <li>Speed and Agility</li>
                    <li>Flexibility Training</li>
                  </ul>
                </div>
                <div class="exercise-category">
                  <h4>Tactical Training</h4>
                  <ul>
                    <li>Positioning Drills</li>
                    <li>Game Awareness</li>
                    <li>Decision Making</li>
                    <li>Team Coordination</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" onclick="adminPortal.sendExercisePlan('${customer.id}')">
            Send Exercise Plan
          </button>
          <button class="btn-secondary" onclick="this.closest('.admin-modal').remove()">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
  }

  schedulePersonalTraining(customerId) {
    this.showNotification(`Personal training session scheduled for customer ${customerId}`, 'success');
  }

  viewClassSchedule(customerId) {
    this.showNotification(`Opening class schedule for customer ${customerId}`, 'info');
  }

  sendReminder(customerId) {
    this.showNotification(`Reminder sent to customer ${customerId}`, 'success');
  }

  sendExercisePlan(customerId) {
    this.showNotification(`Exercise plan sent to customer ${customerId}`, 'success');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      max-width: 400px;
      padding: 1.25rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      color: white;
      font-weight: 600;
    `;
    
    if (type === 'success') {
      notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
      notification.style.backgroundColor = '#ef4444';
    } else {
      notification.style.backgroundColor = '#3b82f6';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 4000);
  }

  // Sample data generation for demo purposes
  generateSampleCustomers() {
    const sampleCustomers = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        status: 'active',
        joinDate: '2024-01-15',
        trainingLevel: 'Intermediate',
        lastActivity: '2 days ago',
        goals: ['Improve ball control', 'Increase speed']
      },
      {
        id: 2,
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '+1 (555) 234-5678',
        status: 'active',
        joinDate: '2024-02-01',
        trainingLevel: 'Advanced',
        lastActivity: '1 day ago',
        goals: ['Tactical awareness', 'Leadership skills']
      },
      {
        id: 3,
        name: 'Emma Rodriguez',
        email: 'emma.rodriguez@email.com',
        phone: '+1 (555) 345-6789',
        status: 'pending',
        joinDate: '2024-03-10',
        trainingLevel: 'Beginner',
        lastActivity: 'Never',
        goals: ['Learn basics', 'Build confidence']
      },
      {
        id: 4,
        name: 'David Thompson',
        email: 'david.thompson@email.com',
        phone: '+1 (555) 456-7890',
        status: 'active',
        joinDate: '2024-01-20',
        trainingLevel: 'Intermediate',
        lastActivity: '3 days ago',
        goals: ['Physical conditioning', 'Endurance']
      },
      {
        id: 5,
        name: 'Lisa Wang',
        email: 'lisa.wang@email.com',
        phone: '+1 (555) 567-8901',
        status: 'inactive',
        joinDate: '2023-12-05',
        trainingLevel: 'Advanced',
        lastActivity: '2 weeks ago',
        goals: ['Maintain fitness', 'Team leadership']
      },
      {
        id: 6,
        name: 'Alex Martinez',
        email: 'alex.martinez@email.com',
        phone: '+1 (555) 678-9012',
        status: 'active',
        joinDate: '2024-02-15',
        trainingLevel: 'Beginner',
        lastActivity: '1 day ago',
        goals: ['Basic skills', 'Team integration']
      }
    ];

    localStorage.setItem('customers', JSON.stringify(sampleCustomers));
    this.loadCustomers();
    this.updateStats();
  }
}

// Initialize admin portal when page loads
let adminPortal;
document.addEventListener('DOMContentLoaded', () => {
  adminPortal = new AdminPortal();
  
  // Generate sample data if no customers exist
  const customers = JSON.parse(localStorage.getItem('customers') || '[]');
  if (customers.length === 0) {
    adminPortal.generateSampleCustomers();
  }
});

// Logout function
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'loginPage.html';
}
