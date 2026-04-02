#!/usr/bin/env node

/**
 * This script helps deploy the application to Netlify
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if Netlify CLI is installed
try {
  execSync('netlify --version', { stdio: 'ignore' });
} catch (error) {
  console.log('Netlify CLI is not installed. Installing...');
  execSync('npm install -g netlify-cli', { stdio: 'inherit' });
}

// Build the application
console.log('Building the application...');
execSync('npm run build', { stdio: 'inherit' });

// Check if the build directory exists
const buildDir = path.join(__dirname, 'dist');
if (!fs.existsSync(buildDir)) {
  console.error('Build directory does not exist. Build failed.');
  process.exit(1);
}

// Deploy to Netlify
console.log('Deploying to Netlify...');
try {
  execSync('netlify deploy --prod', { stdio: 'inherit' });
  console.log('Deployment successful!');
} catch (error) {
  console.error('Deployment failed:', error.message);
  console.log('You can try deploying manually with: netlify deploy --prod');
}