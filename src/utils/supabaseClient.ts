
import { createClient } from '@supabase/supabase-js';

// Use the Supabase project configuration
const supabaseUrl = 'https://kjbpvjyxdjciyobnbhrw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYnB2anl4ZGpjaXlvYm5iaHJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0OTMxODIsImV4cCI6MjA2MTA2OTE4Mn0.dTROxzYh9Nnn90u7oN6fiFGCco6EOKgLDCIia2vbqRo';

// Initialize the Supabase client
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// This function checks if the Supabase client is connected
export const isSupabaseConnected = () => {
  return !!supabaseClient && !!supabaseUrl && !!supabaseKey;
};

// This function gets the Supabase client
export const getSupabaseClient = () => {
  if (!supabaseClient) {
    console.error("Supabase client is not initialized");
    return null;
  }
  return supabaseClient;
};

// This function initializes the Supabase client (legacy compatibility)
export const initSupabaseClient = (url: string, key: string) => {
  // Already initialized with the project configuration
  return true;
};

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabaseClient
      .from('schemes')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return false;
  }
};

export default supabaseClient;
