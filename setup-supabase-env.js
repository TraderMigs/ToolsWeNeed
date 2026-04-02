#!/usr/bin/env node

/**
 * This script helps set up the required environment variables for Supabase Edge Functions
 */

const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Supabase Environment Variable Setup');
console.log('===================================');
console.log('This script will help you set up the required environment variables for your Supabase Edge Functions.');
console.log('You will need your Stripe API keys and other configuration values.\n');

const questions = [
  {
    name: 'STRIPE_SECRET_KEY',
    message: 'Enter your Stripe Secret Key:',
    required: true
  },
  {
    name: 'STRIPE_WEBHOOK_SECRET',
    message: 'Enter your Stripe Webhook Secret (leave blank if not yet created):',
    required: false
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    setEnvironmentVariables();
    return;
  }

  const question = questions[index];
  rl.question(`${question.message} `, (answer) => {
    if (question.required && !answer) {
      console.log('This field is required. Please try again.');
      askQuestion(index);
      return;
    }

    if (answer) {
      answers[question.name] = answer;
    }
    
    askQuestion(index + 1);
  });
}

function setEnvironmentVariables() {
  console.log('\nSetting environment variables...');
  
  Object.entries(answers).forEach(([key, value]) => {
    if (value) {
      try {
        execSync(`npx supabase secrets set ${key}="${value}"`, { stdio: 'inherit' });
        console.log(`✅ Successfully set ${key}`);
      } catch (error) {
        console.error(`❌ Failed to set ${key}: ${error.message}`);
      }
    }
  });
  
  console.log('\nEnvironment variables have been set.');
  console.log('You can verify them with: npx supabase secrets list');
  
  rl.close();
}

askQuestion(0);