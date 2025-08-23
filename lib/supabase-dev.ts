import * as mockSupabase from './supabase-mock';

// For local development without real Supabase setup
const isDevelopment = process.env.NODE_ENV === 'development';
const hasRealSupabaseConfig = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co' &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key-here';

if (isDevelopment && !hasRealSupabaseConfig) {
  console.log('🔧 Using mock Supabase client for local development');
  
  // Export mock implementations
  export const supabase = mockSupabase.supabase;
  export const db = mockSupabase.db;
  export const getCurrentUser = mockSupabase.getCurrentUser;
  export const signIn = mockSupabase.signIn;
  export const signUp = mockSupabase.signUp;
  export const signOut = mockSupabase.signOut;
  export const resetPassword = mockSupabase.resetPassword;
  export const getProfile = mockSupabase.getProfile;
  export const upsertProfile = mockSupabase.upsertProfile;
  export type Profile = mockSupabase.Profile;
} else {
  // Use real Supabase client
  try {
    const realSupabase = require('./supabase');
    export const supabase = realSupabase.supabase;
    export const db = realSupabase.db;
    export const getCurrentUser = realSupabase.getCurrentUser;
    export const signIn = realSupabase.signIn;
    export const signUp = realSupabase.signUp;
    export const signOut = realSupabase.signOut;
    export const resetPassword = realSupabase.resetPassword;
    export const getProfile = realSupabase.getProfile;
    export const upsertProfile = realSupabase.upsertProfile;
    export type Profile = realSupabase.Profile;
  } catch (error) {
    console.warn('⚠️ Real Supabase config failed, falling back to mock:', error);
    // Fallback to mock if real config fails
    export const supabase = mockSupabase.supabase;
    export const db = mockSupabase.db;
    export const getCurrentUser = mockSupabase.getCurrentUser;
    export const signIn = mockSupabase.signIn;
    export const signUp = mockSupabase.signUp;
    export const signOut = mockSupabase.signOut;
    export const resetPassword = mockSupabase.resetPassword;
    export const getProfile = mockSupabase.getProfile;
    export const upsertProfile = mockSupabase.upsertProfile;
    export type Profile = mockSupabase.Profile;
  }
}
