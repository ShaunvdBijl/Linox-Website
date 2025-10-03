# Exercise Recommendation Database Structure

## 🎯 Purpose
Store exercises, exercise library, and customer-specific exercise recommendations in Firebase.

## 📊 Database Collections

### 1. **exercises Collection** (Exercise Library)
```
exercises/{exerciseId} {
  name: string,                    // "Squats", "Push-ups", etc.
  category: string,               // "strength", "cardio", "flexibility", "core"
  muscleGroups: array,            // ["legs", "glutes"], ["chest", "arms"], etc.
  difficulty: string,             // "beginner", "intermediate", "advanced"
  equipment: string,              // "bodyweight", "dumbbells", "resistance-band", "none"
  description: string,            // Detailed exercise description
  instructions: array,            // Step-by-step instructions
  benefits: array,                // ["strength", "endurance", "balance"]
  contraindications: array,       // ["knee-injury", "back-problems"]
  duration: number,              // Estimated duration in minutes
  calories: number,              // Estimated calories burned
  videoUrl: string,              // Optional video demonstration URL
  imageUrl: string,              // Optional exercise image URL
  isActive: boolean,             // Whether exercise is available
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: string              // Admin user ID who created this exercise
}
```

### 2. **customerRecommendedExercises Collection** (Customer-Specific Recommendations)
```
customerRecommendedExercises/{recommendationId} {
  customerID: string,             // Customer this recommendation is for
  exerciseId: string,             // Reference to exercises collection
  exerciseName: string,           // Denormalized for easy access
  sets: number,                   // Number of sets recommended
  reps: number,                   // Number of reps per set
  duration: number,               // Duration for time-based exercises (seconds)
  weight: number,                 // Weight/resistance (if applicable)
  notes: string,                  // Special instructions for this customer
  priority: string,               // "high", "medium", "low"
  status: string,                 // "active", "completed", "paused", "removed"
  assignedDate: timestamp,        // When exercise was assigned
  completedDates: array,          // Array of completion timestamps
  lastCompleted: timestamp,       // Most recent completion
  nextDueDate: timestamp,         // When exercise should be done next
  frequency: string,              // "daily", "3x-week", "weekly", "custom"
  createdBy: string,              // Admin who made the recommendation
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 3. **exerciseCategories Collection** (Exercise Categories)
```
exerciseCategories/{categoryId} {
  name: string,                   // "Strength Training", "Cardio", "Yoga"
  description: string,            // Category description
  icon: string,                   // Icon name or URL
  color: string,                  // Hex color for UI
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 4. **customerExerciseHistory Collection** (Track Exercise Performance)
```
customerExerciseHistory/{historyId} {
  customerID: string,
  exerciseId: string,
  exerciseName: string,
  performedAt: timestamp,         // When exercise was performed
  sets: number,                   // Actual sets completed
  reps: number,                   // Actual reps per set
  duration: number,               // Actual duration (for time-based exercises)
  weight: number,                 // Weight used
  difficulty: string,             // How hard it felt: "easy", "moderate", "hard"
  notes: string,                  // Customer's notes about the session
  painLevel: number,              // 1-10 scale (if applicable)
  form: string,                   // "excellent", "good", "needs-work"
  createdBy: string,              // Customer ID (self-reported) or trainer ID
  createdAt: timestamp
}
```

## 🔍 Indexes Needed

### exercises Collection
- `category + difficulty + isActive`
- `muscleGroups + difficulty + isActive`
- `equipment + difficulty + isActive`

### customerRecommendedExercises Collection
- `customerID + status + assignedDate`
- `customerID + priority + status`
- `exerciseId + status`

### customerExerciseHistory Collection
- `customerID + performedAt DESC`
- `exerciseId + performedAt DESC`

## 🚀 Usage Examples

### Get All Exercises for a Category
```javascript
const exercisesQuery = query(
  collection(db, 'exercises'),
  where('category', '==', 'strength'),
  where('difficulty', '==', 'beginner'),
  where('isActive', '==', true)
);
```

### Get Customer's Active Recommendations
```javascript
const recommendationsQuery = query(
  collection(db, 'customerRecommendedExercises'),
  where('customerID', '==', customerId),
  where('status', '==', 'active'),
  orderBy('priority', 'desc'),
  orderBy('assignedDate', 'desc')
);
```

### Get Customer's Exercise History
```javascript
const historyQuery = query(
  collection(db, 'customerExerciseHistory'),
  where('customerID', '==', customerId),
  orderBy('performedAt', 'desc')
);
```

## 📋 Sample Data

### Exercise Library
- **Squats** (Strength, Legs, Beginner, Bodyweight)
- **Push-ups** (Strength, Upper Body, Beginner, Bodyweight)
- **Plank** (Core, Full Body, Beginner, Bodyweight)
- **Burpees** (Cardio, Full Body, Intermediate, Bodyweight)
- **Lunges** (Strength, Legs, Beginner, Bodyweight)
- **Mountain Climbers** (Cardio, Full Body, Intermediate, Bodyweight)
- **Dead Bug** (Core, Core, Beginner, Bodyweight)

### Customer Recommendations Example
```javascript
{
  customerID: "op0oejT2GFciFuXcPqptdU3MHHv1", // Piet Pompies
  exerciseId: "squats-basic",
  exerciseName: "Squats",
  sets: 3,
  reps: 12,
  notes: "Focus on proper form, go slow",
  priority: "high",
  status: "active",
  assignedDate: new Date(),
  frequency: "3x-week"
}
```
