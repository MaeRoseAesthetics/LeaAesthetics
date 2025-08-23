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
    // Log environment variables for debugging
    console.log('Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      hasDbSupabaseUrl: !!process.env.DATABASE_SUPABASE_URL,
      hasDbServiceKey: !!process.env.DATABASE_SUPABASE_SERVICE_ROLE_KEY,
      hasDbNextPublicUrl: !!process.env.DATABASE_NEXT_PUBLIC_SUPABASE_URL,
      hasDbNextPublicKey: !!process.env.DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY
    });

    // Basic input validation
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        message: 'Missing required fields: email, password, firstName, lastName' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    
    // Sanitize name inputs
    const sanitizedFirstName = firstName.trim().replace(/[<>"']/g, '');
    const sanitizedLastName = lastName.trim().replace(/[<>"']/g, '');
    
    if (!sanitizedFirstName || !sanitizedLastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    // Check Supabase configuration
    const supabaseUrl = process.env.DATABASE_SUPABASE_URL || 
                       process.env.DATABASE_NEXT_PUBLIC_SUPABASE_URL || 
                       process.env.NEXT_PUBLIC_SUPABASE_URL;
                       
    const supabaseKey = process.env.DATABASE_SUPABASE_SERVICE_ROLE_KEY || 
                       process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Supabase config check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlStart: supabaseUrl?.substring(0, 30),
      keyStart: supabaseKey?.substring(0, 20)
    });
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        message: 'Supabase configuration missing',
        debug: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          availableKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('DATABASE'))
        }
      });
    }

    // Import Supabase dynamically
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test the connection first
    try {
      const { data: testData, error: testError } = await supabase.auth.admin.listUsers();
      console.log('Supabase connection test:', { 
        success: !testError, 
        userCount: testData?.users?.length || 0,
        error: testError?.message 
      });
      
      if (testError) {
        console.error('Supabase connection failed:', testError);
        return res.status(500).json({ 
          message: 'Failed to connect to Supabase', 
          error: testError.message 
        });
      }
    } catch (connError: any) {
      console.error('Supabase connection error:', connError);
      return res.status(500).json({ 
        message: 'Supabase connection error', 
        error: connError.message 
      });
    }

    // Check if users already exist
    const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers();
    
    if (checkError) {
      console.error('Error checking users:', checkError);
      return res.status(500).json({ 
        message: 'Failed to check existing users',
        error: checkError.message 
      });
    }

    if (existingUsers && existingUsers.users.length > 0) {
      return res.status(400).json({ 
        message: 'Admin user already exists. Use the login system to access your account.' 
      });
    }

    // Create the admin user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: sanitizedFirstName,
        last_name: sanitizedLastName,
        role: 'admin'
      }
    });

    if (authError) {
      console.error('User creation error:', authError);
      return res.status(400).json({ 
        message: 'Failed to create admin user', 
        error: authError.message 
      });
    }

    if (!authData.user) {
      return res.status(500).json({ message: 'User creation failed - no user returned' });
    }

    console.log('Admin user created successfully:', { 
      userId: authData.user.id, 
      email: authData.user.email 
    });

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
    console.error('Setup error:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
