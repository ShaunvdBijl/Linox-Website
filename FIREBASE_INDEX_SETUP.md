# Firebase Index Setup Guide

## 🎯 Purpose
Create proper indexes for the customer sessions and related collections to improve query performance.

## 📋 Indexes Created

### 1. **customerSessions Collection**
- **Primary Query**: `customerId == X ORDER BY sessionDate DESC`
- **Status Filtering**: `customerId == X AND status == Y ORDER BY sessionDate ASC`
- **Trainer Filtering**: `customerId == X AND trainer == Y ORDER BY sessionDate DESC`
- **Session Type Filtering**: `customerId == X AND sessionType == Y ORDER BY sessionDate DESC`

### 2. **customerReminders Collection**
- **Customer Reminders**: `customerId == X ORDER BY sentAt DESC`
- **Session Reminders**: `sessionId == X ORDER BY sentAt DESC`

### 3. **schedules Collection**
- **Date & Time**: `date == X ORDER BY startTime ASC`
- **Trainer Schedule**: `trainer == X ORDER BY date ASC`
- **Activity Schedule**: `activity == X ORDER BY date ASC`

### 4. **customers Collection**
- **Email Indexing**: For email-based queries
- **Phone Indexing**: For phone-based queries

## 🚀 Method 1: Firebase Console (Recommended)

### Steps:
1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `linox-soccer`

2. **Navigate to Firestore**
   - Click "Firestore Database" in the left sidebar
   - Click on the "Indexes" tab

3. **Create Indexes Manually**
   
   **For customerSessions:**
   - Click "Create Index"
   - Collection: `customerSessions`
   - Fields:
     - `customerId` (Ascending)
     - `sessionDate` (Descending)
   - Click "Create"

   **Repeat for other combinations:**
   - `customerId` + `status` + `sessionDate`
   - `customerId` + `trainer` + `sessionDate`
   - `customerId` + `sessionType` + `sessionDate`

4. **For customerReminders:**
   - Collection: `customerReminders`
   - Fields: `customerId` + `sentAt`
   - Fields: `sessionId` + `sentAt`

5. **For schedules:**
   - Collection: `schedules`
   - Fields: `date` + `startTime`
   - Fields: `trainer` + `date`
   - Fields: `activity` + `date`

## 🛠️ Method 2: Firebase CLI (If Available)

### Prerequisites:
```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore
```

### Deploy Indexes:
```bash
# Deploy only indexes
firebase deploy --only firestore:indexes

# Or deploy everything
firebase deploy
```

## 🔧 Method 3: PowerShell Fix (For CLI Method)

If you get PowerShell execution policy errors:

```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try Firebase CLI again
firebase --version
```

## 📊 Expected Performance Improvements

### Before Indexes:
- ❌ Slow queries on large datasets
- ❌ Potential query failures
- ❌ High read costs

### After Indexes:
- ✅ Fast customer session lookups
- ✅ Efficient filtering by status/trainer/type
- ✅ Optimized reminder queries
- ✅ Better overall performance

## 🧪 Testing the Indexes

After creating indexes, test with these queries:

```javascript
// This should be fast now
const q = query(
  collection(db, 'customerSessions'),
  where('customerId', '==', 'customer123'),
  orderBy('sessionDate', 'desc')
);

// Status filtering
const q2 = query(
  collection(db, 'customerSessions'),
  where('customerId', '==', 'customer123'),
  where('status', '==', 'scheduled'),
  orderBy('sessionDate', 'asc')
);
```

## ⚠️ Important Notes

1. **Index Creation Time**: Complex indexes may take several minutes to build
2. **Storage Cost**: Indexes consume additional storage space
3. **Write Performance**: More indexes = slightly slower writes
4. **Query Optimization**: Only create indexes for queries you actually use

## 🎯 Next Steps

1. Create the indexes using your preferred method
2. Test the customer-schedule.html functionality
3. Monitor Firebase Console for any query performance improvements
4. Consider adding more indexes as your app grows

## 📞 Support

If you encounter any issues:
1. Check Firebase Console for index build status
2. Verify query syntax matches index structure
3. Check browser console for any Firestore errors
4. Review Firebase documentation for query limitations
