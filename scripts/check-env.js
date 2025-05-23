const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env file
const envPath = path.join(__dirname, '../.env');
const exampleEnvPath = path.join(__dirname, '../.env.example');

// Check if .env exists
if (!fs.existsSync(envPath)) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: .env file is missing');
  console.log('Please create a .env file in the root directory.');
  console.log('You can copy .env.example and fill in your values.');
  process.exit(1);
}

// Check if .env.example exists
if (!fs.existsSync(exampleEnvPath)) {
  console.warn('\x1b[33m%s\x1b[0m', 'Warning: .env.example file is missing');
  console.log('Consider creating one for other developers.');
}

// Load and parse both files
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const exampleConfig = fs.existsSync(exampleEnvPath)
  ? dotenv.parse(fs.readFileSync(exampleEnvPath))
  : {};

// Check for missing variables
const missingVars = Object.keys(exampleConfig).filter(key => !(key in envConfig));
if (missingVars.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Missing environment variables:');
  missingVars.forEach(variable => {
    console.log(`- ${variable}`);
  });
  process.exit(1);
}

// Validate Supabase URL
if (!envConfig.EXPO_PUBLIC_SUPABASE_URL?.startsWith('https://')) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Invalid SUPABASE_URL');
  console.log('EXPO_PUBLIC_SUPABASE_URL must be a valid HTTPS URL');
  process.exit(1);
}

// Validate Supabase key format
if (!envConfig.EXPO_PUBLIC_SUPABASE_ANON_KEY?.includes('.')) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Invalid SUPABASE_ANON_KEY');
  console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY appears to be invalid');
  process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', '✓ Environment variables look good!'); 