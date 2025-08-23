import { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling, withCors } from '../_middleware';

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Basic input validation and sanitization
    const { email, password, firstName, lastName } = req.body;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate password strength (minimum requirements)
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    
    // Sanitize name inputs
    const sanitizedFirstName = firstName.trim().replace(/[<>"']/g, '');
    const sanitizedLastName = lastName.trim().replace(/[<>"']/g, '');
    
    if (!sanitizedFirstName || !sanitizedLastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.DATABASE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.DATABASE_SUPABASE_SERVICE_ROLE_KEY || process.env.DATABASE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('mock-project')) {
      return res.status(500).json({ 
        message: 'Supabase not configured properly. Please set up your Supabase environment variables.',
        debug: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          isMock: supabaseUrl?.includes('mock-project') 
        }
      });
    }

    // Import Supabase dynamically to avoid import issues
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if any users already exist (prevent multiple admin creation)
    const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers();
    
    if (checkError) {
      console.error('Error checking existing users:', checkError);
      return res.status(500).json({ message: 'Failed to check existing users' });
    }

    if (existingUsers.users.length > 0) {
      return res.status(400).json({ 
        message: 'Admin user already exists. Use the login system to access your account.' 
      });
    }

    // Create the admin user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for admin setup
      user_metadata: {
        first_name: sanitizedFirstName,
        last_name: sanitizedLastName,
        role: 'admin'
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return res.status(400).json({ 
        message: 'Failed to create admin user', 
        error: authError.message 
      });
    }

    if (!authData.user) {
      return res.status(500).json({ message: 'User creation failed - no user data returned' });
    }

    // For now, skip the database profile creation since it might be causing issues
    // TODO: Add database profile creation once the core functionality works

    return res.status(200).json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
        role: 'admin'
      }
    });

  } catch (error: any) {
    console.error('Admin setup error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

export default withErrorHandling(withCors(handler));
