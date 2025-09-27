#!/usr/bin/env node

/**
 * Security Check Script
 * Prevents committing sensitive information
 */

const fs = require('fs');
const path = require('path');

// Patterns that indicate potential secrets
const SECRET_PATTERNS = [
  /AIzaSy[A-Za-z0-9_-]{35}/g,           // Firebase API keys
  /sk-[A-Za-z0-9]{48}/g,                // OpenAI API keys
  /[A-Za-z0-9+/]{40}={0,2}/g,          // Base64 encoded secrets
  /-----BEGIN PRIVATE KEY-----/g,       // Private keys
  /-----BEGIN RSA PRIVATE KEY-----/g,   // RSA private keys
  /password\s*[:=]\s*["'][^"']+["']/gi, // Hardcoded passwords
  /api[_-]?key\s*[:=]\s*["'][^"']+["']/gi, // API keys
  /secret\s*[:=]\s*["'][^"']+["']/gi,   // Secrets
  /token\s*[:=]\s*["'][^"']+["']/gi,    // Tokens
];

// Files to check
const FILES_TO_CHECK = [
  '.js', '.html', '.css', '.json', '.md', '.txt', '.yml', '.yaml'
];

// Files to ignore
const IGNORE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /\.env\.example/,
  /config\.example\.js/,
  /SECURITY_GUIDE\.md/,
  /scripts\/security-check\.js/
];

let foundSecrets = [];

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      SECRET_PATTERNS.forEach(pattern => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            foundSecrets.push({
              file: filePath,
              line: index + 1,
              match: match,
              context: line.trim()
            });
          });
        }
      });
    });
  } catch (error) {
    // Skip files that can't be read
  }
}

function walkDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      // Check if file should be ignored
      const shouldIgnore = IGNORE_PATTERNS.some(pattern => 
        pattern.test(filePath)
      );
      
      if (shouldIgnore) {
        return;
      }
      
      if (stat.isDirectory()) {
        walkDirectory(filePath);
      } else if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        if (FILES_TO_CHECK.includes(ext)) {
          checkFile(filePath);
        }
      }
    });
  } catch (error) {
    // Skip directories that can't be read
  }
}

function main() {
  console.log('🔍 Running security check...\n');
  
  // Check current directory
  walkDirectory('.');
  
  if (foundSecrets.length > 0) {
    console.log('🚨 POTENTIAL SECRETS DETECTED!\n');
    console.log('The following patterns might contain sensitive information:\n');
    
    foundSecrets.forEach((secret, index) => {
      console.log(`${index + 1}. File: ${secret.file}:${secret.line}`);
      console.log(`   Pattern: ${secret.match}`);
      console.log(`   Context: ${secret.context}`);
      console.log('');
    });
    
    console.log('⚠️  Please review these findings before committing.');
    console.log('💡 Consider using environment variables or external config files.');
    console.log('📖 See SECURITY_GUIDE.md for best practices.');
    
    process.exit(1);
  } else {
    console.log('✅ No potential secrets detected.');
    console.log('🛡️  Your code appears to be secure for commit.');
  }
}

// Run the security check
main();
