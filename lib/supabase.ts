import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

// Supabase configuration - prioritize DATABASE_ prefixed variables
const supabaseUrl = process.env.DATABASE_SUPABASE_URL || 
                   process.env.DATABASE_NEXT_PUBLIC_SUPABASE_URL ||
                   process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   'https://mock-project.supabase.co';
                   
const supabaseKey = process.env.DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                   'mock-key';

let supabase: any = null;

try {
  if (supabaseUrl.includes('mock-project') || supabaseKey.includes('mock')) {
    console.warn('🛠️  Using mock Supabase configuration for local development');
    console.warn('   Set up real Supabase project for production use');
    // Create a mock client that won't fail on import
    supabase = {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Mock client') }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Mock client') }),
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Mock client') }),
        signOut: () => Promise.resolve({ error: null }),
        resetPasswordForEmail: () => Promise.resolve({ error: null })
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Mock client') }) }) }),
        upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Mock client') }) }) })
      })
    };
  } else {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (error) {
  console.warn('⚠️  Supabase client creation failed, using mock client');
  // Create mock client as fallback
  supabase = {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Failed to create client') }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Failed to create client') }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Failed to create client') }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Failed to create client') }) }) }),
      upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Failed to create client') }) }) })
    })
  };
}

export { supabase };

// Create Drizzle client for database operations
let db: any;

try {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Missing env.DATABASE_URL');
  }
  
  if (connectionString.includes('mock-host')) {
    console.warn('🛠️  Using mock database connection for local development');
    // Create a mock db that won't actually connect
    db = {
      select: () => ({ from: () => ({ where: () => Promise.resolve([]) }) }),
      insert: () => ({ values: () => ({ returning: () => Promise.resolve([{ id: 'mock-id' }]) }) }),
      update: () => ({ set: () => ({ where: () => ({ returning: () => Promise.resolve([{ id: 'mock-id' }]) }) }) })
    };
  } else {
    const client = postgres(connectionString);
    db = drizzle(client, { schema });
  }
} catch (error) {
  console.warn('⚠️  Database connection failed, using mock database for development');
  // Fallback to mock db
  db = {
    select: () => ({ from: () => ({ where: () => Promise.resolve([]) }) }),
    insert: () => ({ values: () => ({ returning: () => Promise.resolve([{ id: 'mock-id' }]) }) }),
    update: () => ({ set: () => ({ where: () => ({ returning: () => Promise.resolve([{ id: 'mock-id' }]) }) }) })
  };
}

export { db };

// Types for Supabase Auth
export type Profile = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  role?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at?: string;
  updated_at?: string;
};

// Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string, metadata?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
};

// Profile management
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw error;
  }
  
  return data;
};

export const upsertProfile = async (profile: Profile) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
