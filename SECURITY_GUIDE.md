# 🔒 Security Guide - LINQXFITNESS

## 🚨 **CRITICAL: API Key Security**

### **What Happened:**
- Firebase API key was exposed in GitHub repository
- GitHub detected the leak and sent security alert
- Key was rotated and system secured

### **How to Prevent This in the Future:**

## 🛡️ **Best Practices**

### **1. Never Commit API Keys to Git**
```bash
# ❌ NEVER DO THIS:
const firebaseConfig = {
  apiKey: "AIzaSy..." // ← This gets committed to Git!
};

# ✅ DO THIS INSTEAD:
// Load from external config file or environment variables
const firebaseConfig = loadConfig();
```

### **2. Use .gitignore**
```bash
# Add to .gitignore:
config.js          # Local configuration file
.env               # Environment variables
.env.local         # Local environment variables
.env.production    # Production environment variables
```

### **3. Use Environment Variables (Production)**
```bash
# For Netlify deployment:
# Go to Site Settings → Environment Variables
# Add: FIREBASE_API_KEY = your_api_key_here
```

### **4. Use External Config Files (Development)**
```bash
# 1. Copy config.example.js to config.js
cp config.example.js config.js

# 2. Edit config.js with your actual values
# 3. Add config.js to .gitignore
# 4. Never commit config.js
```

## 🔧 **Implementation Options**

### **Option A: External Config File (Recommended for Development)**
1. Create `config.js` from `config.example.js`
2. Add `config.js` to `.gitignore`
3. Load config in your Firebase files
4. **Never commit `config.js`**

### **Option B: Environment Variables (Recommended for Production)**
1. Set environment variables in Netlify
2. Use build-time replacement
3. Keys never appear in source code

### **Option C: Firebase App Check (Advanced Security)**
1. Enable Firebase App Check
2. Restrict API usage to your domains
3. Additional layer of security

## 📋 **Security Checklist**

### **Before Every Commit:**
- [ ] No API keys in source code
- [ ] All config files in `.gitignore`
- [ ] Test with placeholder values
- [ ] Verify no secrets in commit

### **Before Every Push:**
- [ ] Run `git status` to check files
- [ ] Review `git diff` for sensitive data
- [ ] Ensure `.gitignore` is working
- [ ] Test deployment with secure config

### **Monthly Security Review:**
- [ ] Rotate API keys
- [ ] Review Firebase security rules
- [ ] Check for exposed secrets
- [ ] Update dependencies

## 🚨 **Emergency Response**

### **If API Key is Exposed:**
1. **Immediately rotate the key** in Firebase Console
2. **Remove exposed key** from all files
3. **Update all references** with new key
4. **Commit and push** the fix
5. **Review git history** for other exposures

### **Firebase Console Steps:**
1. Go to Project Settings
2. Go to "Your apps" section
3. Click on your web app
4. Generate new API key
5. Update all references

## 🔍 **Detection Tools**

### **GitHub Security Features:**
- **Secret scanning**: Automatically detects exposed secrets
- **Dependabot alerts**: Notifies of vulnerable dependencies
- **Security tab**: Shows security issues in repository

### **Pre-commit Hooks:**
```bash
# Install pre-commit hooks to scan for secrets
npm install --save-dev husky lint-staged
```

### **Manual Checks:**
```bash
# Search for potential secrets in code
grep -r "AIzaSy" .
grep -r "sk-" .
grep -r "api_key" .
```

## 📚 **Resources**

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Environment Variables Best Practices](https://12factor.net/config)
- [Firebase App Check](https://firebase.google.com/docs/app-check)

## ⚠️ **Remember**

- **API keys are meant to be public** in Firebase, but it's better practice to keep them private
- **Real security comes from Firestore security rules**, not hiding the API key
- **Always use least-privilege access** in your security rules
- **Regular security audits** are essential for production systems
