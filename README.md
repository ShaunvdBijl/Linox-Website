# LINQXFITNESS - Soccer Training & Fitness Management System

A comprehensive web application for soccer training and fitness management, featuring dual portals for administrators and customers, powered by Google Firebase.

## 🚀 **Project Overview**

LINQXFITNESS is a modern, full-stack web application designed for elite soccer training and fitness management. The system provides separate portals for administrators and customers, with real-time data synchronization using Google Firebase as the backend.

## 🏗️ **Architecture & Technology Stack**

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Google Firebase
- **Database**: Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Deployment**: Netlify
- **Development**: XAMPP Server (Local Development)

## 🔥 **Google Firebase Integration**

### **Firebase Services Used:**
- **Firebase Authentication**: User login, registration, and session management
- **Firestore Database**: Real-time data storage for customers, workouts, schedules
- **Firebase Storage**: File uploads for profile pictures and documents
- **Firebase Security Rules**: Role-based access control

### **Database Collections:**
- `users/` - User profiles and authentication data
- `customers/` - Customer information and status
- `workouts/` - Workout plans and exercises
- `schedules/` - Training schedules and appointments
- `exercises/` - Exercise library and recommendations

## 👑 **Admin Portal Features**

### **Dashboard & Analytics**
- Real-time customer statistics
- Active, pending, and new customer tracking
- Weekly/monthly growth metrics
- Data export capabilities

### **Customer Management**
- Complete customer database with search and filtering
- Customer status management (Active, Pending, Inactive)
- Detailed customer profiles with contact information
- Notes and communication tracking
- Customer assignment to trainers

### **Schedule Management**
- Training session scheduling
- Appointment booking and management
- Calendar integration
- Session status tracking (Scheduled, Completed, Cancelled)

### **Workout Plan Management**
- Custom workout plan creation
- Exercise library management
- Difficulty level assignment
- Progress tracking integration

### **Exercise Recommendations**
- Personalized exercise suggestions
- Training level-based recommendations
- Exercise database management
- Video/image attachments

## 👤 **Customer Portal Features**

### **Personal Dashboard**
- Welcome screen with personalized greeting
- Quick stats and progress overview
- Upcoming training sessions
- Recommended exercises

### **Training Schedule**
- View personal training schedule
- Book new training sessions
- Session history and tracking
- Calendar integration

### **My Training Plan**
- Personalized workout plans
- Exercise instructions and videos
- Progress tracking
- Goal setting and monitoring

### **Progress Tracking**
- Fitness metrics tracking
- Photo progress documentation
- Achievement milestones
- Performance analytics

### **Profile Management**
- Personal information updates
- Fitness goals and preferences
- Emergency contact information
- Medical information (if applicable)

## 🔐 **Security Features**

- Role-based access control (Admin vs Customer)
- Secure Firebase Authentication
- Data encryption in transit and at rest
- Firestore security rules
- Session management and timeout

## 📱 **User Interface**

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with Belgiumcampus iTversity color scheme
- **Intuitive Navigation**: Easy-to-use interface for both admins and customers
- **Real-time Updates**: Live data synchronization across all devices

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v16 or higher)
- XAMPP Server (for local development)
- Firebase Account
- Git

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Linox-Website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Update `firebase-config.js` with your Firebase configuration
   - Set up Firestore security rules (see `FIREBASE_SETUP.md`)

4. **Local Development:**
   ```bash
   # Start XAMPP Server
   # Copy files to XAMPP htdocs directory
   npm run dev
   ```

### **Default Admin Credentials**
- **Email**: `admin@linoxfitness.com`
- **Password**: `Admin123!`

## 📁 **Project Structure**

```
Linox-Website/
├── admin-portal.html          # Admin dashboard
├── admin-schedule.html        # Admin schedule management
├── admin-workout-plans.html   # Admin workout management
├── dashboard.html             # Customer dashboard
├── schedule.html              # Customer schedule view
├── my-workout-plan.html       # Customer workout plans
├── book-session.html          # Session booking
├── progress.html              # Progress tracking
├── profile.html               # User profile management
├── firebase-config.js         # Firebase configuration
├── firebase-auth.js           # Authentication service
├── firebase-database.js       # Database service
├── FIREBASE_SETUP.md          # Firebase setup guide
└── package.json               # Dependencies
```

## 🔧 **Development Scripts**

```bash
npm start          # Start development server
npm run build      # Build for production
npm run deploy     # Deploy to Netlify
npm run security-check  # Run security checks
```

## 🌐 **Deployment**

The application is configured for deployment on Netlify with:
- Environment variable support for Firebase configuration
- Automatic builds and deployments
- CDN distribution for global performance

## 📊 **Features Summary**

### **Admin Capabilities:**
- ✅ Customer database management
- ✅ Schedule and appointment management
- ✅ Workout plan creation and assignment
- ✅ Exercise library management
- ✅ Progress monitoring and analytics
- ✅ Data export and reporting

### **Customer Capabilities:**
- ✅ Personal dashboard and progress tracking
- ✅ Training schedule viewing and booking
- ✅ Personalized workout plans
- ✅ Exercise recommendations
- ✅ Profile and goal management

### **System Features:**
- ✅ Real-time data synchronization
- ✅ Secure user authentication
- ✅ Role-based access control
- ✅ Mobile-responsive design
- ✅ Cloud-based data storage
- ✅ Automated backup and recovery

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 📞 **Support**

For support and questions, please contact the development team or refer to the Firebase setup documentation.

---

**Built with ❤️ for elite soccer training and fitness management**
