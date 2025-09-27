#!/usr/bin/env node

/**
 * Secure Configuration Setup Script
 * Helps set up secure Firebase configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 Setting up secure Firebase configuration...\n');

// Check if config.js already exists
if (fs.existsSync('config.js')) {
  console.log('⚠️  config.js already exists!');
  console.log('If you want to recreate it, delete the existing file first.\n');
  process.exit(0);
}

// Copy config.example.js to config.js
try {
  if (fs.existsSync('config.example.js')) {
    const exampleContent = fs.readFileSync('config.example.js', 'utf8');
    fs.writeFileSync('config.js', exampleContent);
    console.log('✅ Created config.js from config.example.js');
  } else {
    console.log('❌ config.example.js not found!');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Error creating config.js:', error.message);
  process.exit(1);
}

// Check if .gitignore exists and contains config.js
try {
  let gitignoreContent = '';
  if (fs.existsSync('.gitignore')) {
    gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  }
  
  if (!gitignoreContent.includes('config.js')) {
    gitignoreContent += '\n# Firebase Configuration (Never commit actual API keys)\nconfig.js\n';
    fs.writeFileSync('.gitignore', gitignoreContent);
    console.log('✅ Added config.js to .gitignore');
  } else {
    console.log('✅ config.js already in .gitignore');
  }
} catch (error) {
  console.log('⚠️  Could not update .gitignore:', error.message);
}

console.log('\n🎯 Next Steps:');
console.log('1. Edit config.js with your actual Firebase configuration');
console.log('2. Never commit config.js to version control');
console.log('3. Use config.js for development, environment variables for production');
console.log('4. Run "npm run security-check" before every commit');
console.log('\n📖 See SECURITY_GUIDE.md for detailed instructions');

console.log('\n✅ Secure configuration setup complete!');
