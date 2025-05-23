import Constants from 'expo-constants';

// Define the shape of our environment variables
interface Env {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

// Get environment variables from Expo config
const env: Env = {
  supabaseUrl: Constants.expoConfig?.extra?.supabaseUrl,
  supabaseAnonKey: Constants.expoConfig?.extra?.supabaseAnonKey,
};

// Validate environment variables
function validateEnv() {
  const requiredVars: (keyof Env)[] = ['supabaseUrl', 'supabaseAnonKey'];
  const missingVars = requiredVars.filter(key => !env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Make sure you have created a .env file with all required variables.'
    );
  }

  // Validate Supabase URL format
  if (!env.supabaseUrl.startsWith('https://')) {
    throw new Error('EXPO_PUBLIC_SUPABASE_URL must be a valid HTTPS URL');
  }

  // Validate Supabase key format (basic check)
  if (!env.supabaseAnonKey || !env.supabaseAnonKey.includes('.')) {
    throw new Error('EXPO_PUBLIC_SUPABASE_ANON_KEY appears to be invalid');
  }
}

// Run validation
validateEnv();

// Export environment variables
export default env; 