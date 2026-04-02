#!/usr/bin/env node

/**
 * This script verifies that the deployment was successful
 */

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Deployment Verification');
console.log('=======================');

rl.question('Enter the URL of your deployed site: ', (url) => {
  // Remove trailing slash if present
  url = url.endsWith('/') ? url.slice(0, -1) : url;
  
  console.log(`\nVerifying deployment at ${url}...`);
  
  // Check if the site is accessible
  checkUrl(url)
    .then(() => {
      console.log('✅ Site is accessible');
      
      // Check if the main page loads correctly
      return checkUrl(`${url}/`);
    })
    .then(() => {
      console.log('✅ Main page loads correctly');
      
      // Check if the payment success page is accessible
      return checkUrl(`${url}/payment-success.html`);
    })
    .then(() => {
      console.log('✅ Payment success page is accessible');
      
      // Check if the payment canceled page is accessible
      return checkUrl(`${url}/payment-canceled.html`);
    })
    .then(() => {
      console.log('✅ Payment canceled page is accessible');
      
      console.log('\nDeployment verification successful! 🎉');
      console.log('\nNext steps:');
      console.log('1. Configure your environment variables in the Netlify dashboard');
      console.log('2. Set up your Stripe webhook to point to your Supabase Edge Function');
      console.log('3. Test the payment flow in the production environment');
      
      rl.close();
    })
    .catch((error) => {
      console.error(`❌ Verification failed: ${error.message}`);
      console.log('\nPlease check your deployment and try again.');
      rl.close();
    });
});

function checkUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve();
      } else {
        reject(new Error(`Received status code ${res.statusCode} for ${url}`));
      }
    }).on('error', (error) => {
      reject(new Error(`Failed to connect to ${url}: ${error.message}`));
    });
  });
}