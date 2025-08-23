import { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling, withCors } from '../_middleware';
import { supabase } from '../../lib/supabase';

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields: email, password' 
      });
    }

    // Attempt to sign in with Supabase
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
};

export default withErrorHandling(withCors(handler));
