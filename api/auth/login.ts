import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Login attempt started');
    const { email, password } = req.body;

    console.log('Login request:', { email, hasPassword: !!password });

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields: email, password' 
      });
    }

    // Get Supabase configuration
    const supabaseUrl = process.env.DATABASE_SUPABASE_URL || 
                       process.env.DATABASE_NEXT_PUBLIC_SUPABASE_URL || 
                       process.env.NEXT_PUBLIC_SUPABASE_URL;
                       
    const supabaseKey = process.env.DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Supabase config for login:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    });
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        message: 'Supabase configuration missing for login'
      });
    }

    // Create Supabase client dynamically
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Attempt to sign in with Supabase
    console.log('Attempting Supabase sign in...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return res.status(401).json({ 
        message: 'Invalid email or password',
        error: authError?.message 
      });
    }

    // Return the session data
    res.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName: authData.user.user_metadata?.first_name,
        lastName: authData.user.user_metadata?.last_name,
        role: authData.user.user_metadata?.role || 'practitioner'
      },
      session: {
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
        expires_at: authData.session?.expires_at
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
}
