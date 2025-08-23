import { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling, withCors } from '../_middleware';
import { supabase } from '../../lib/supabase';
import { storage } from '../../lib/storage';
import { handleAPIError } from '../../lib/monitoring';

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

    // Create the user profile in your database
    try {
      await storage.upsertUser({
        id: authData.user.id,
        email: authData.user.email!,
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
        role: 'admin',
        profileImageUrl: null
      });
    } catch (dbError) {
      console.error('Error creating user profile:', dbError);
      // If profile creation fails, clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ 
        message: 'Failed to create user profile. Auth user cleaned up.' 
      });
    }

    res.json({
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
