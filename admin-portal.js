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
    // Navigate to customer detail page
    window.location.href = `customer-details.html?id=${customerId}`;
  }

  manageSchedule(customerId) {
    // Navigate to schedule management page
    window.location.href = `customer-schedule.html?id=${customerId}`;
  }

  recommendExercises(customerId) {
    // Navigate to exercise recommendation page
    window.location.href = `customer-exercises.html?id=${customerId}`;
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
