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
    console.log('=== DIAGNOSTIC ADMIN SETUP START ===');

    // Basic input validation
    const { email, password, firstName, lastName } = req.body;
    
    console.log('Request body received:', { email, firstName, lastName, hasPassword: !!password });
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        message: 'Missing required fields: email, password, firstName, lastName' 
      });
    }

    // Check Supabase configuration
    const supabaseUrl = process.env.DATABASE_SUPABASE_URL || 
                       process.env.DATABASE_NEXT_PUBLIC_SUPABASE_URL || 
                       process.env.NEXT_PUBLIC_SUPABASE_URL;
                       
    const supabaseKey = process.env.DATABASE_SUPABASE_SERVICE_ROLE_KEY || 
                       process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Supabase config:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlStart: supabaseUrl?.substring(0, 30)
    });
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        message: 'Supabase configuration missing',
        debug: { hasUrl: !!supabaseUrl, hasKey: !!supabaseKey }
      });
    }

    // Import and create Supabase client
    console.log('Creating Supabase client...');
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client created successfully');

    // Test connection and get detailed user info
    console.log('Testing Supabase connection and fetching users...');
    try {
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
      
      console.log('Supabase listUsers response:', {
        success: !userError,
        error: userError?.message,
        userCount: userData?.users?.length || 0,
        users: userData?.users?.map(u => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          email_confirmed_at: u.email_confirmed_at
        })) || []
      });
      
      if (userError) {
        console.error('Error fetching users:', userError);
        return res.status(500).json({ 
          message: 'Failed to connect to Supabase auth', 
          error: userError.message,
          details: userError
        });
      }

      // Check if users exist
      const existingUsers = userData?.users || [];
      console.log(`Found ${existingUsers.length} existing users`);
      
      if (existingUsers.length > 0) {
        return res.status(400).json({ 
          message: 'Admin user already exists. Use the login system to access your account.',
          debug: {
            userCount: existingUsers.length,
            users: existingUsers.map(u => ({
              id: u.id,
              email: u.email,
              created: u.created_at
            }))
          }
        });
      }

      console.log('No existing users found, proceeding with admin creation...');

      // Create the admin user
      const createUserData = {
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          role: 'admin'
        }
      };

      console.log('Creating user with data:', {
        email: createUserData.email,
        email_confirm: createUserData.email_confirm,
        user_metadata: createUserData.user_metadata
      });

      const { data: authData, error: authError } = await supabase.auth.admin.createUser(createUserData);

      if (authError) {
        console.error('User creation failed:', authError);
        return res.status(400).json({ 
          message: 'Failed to create admin user', 
          error: authError.message,
          details: authError
        });
      }

      if (!authData.user) {
        console.error('No user returned after creation');
        return res.status(500).json({ 
          message: 'User creation failed - no user returned',
          authData: authData
        });
      }

      console.log('Admin user created successfully:', {
        id: authData.user.id,
        email: authData.user.email,
        created_at: authData.user.created_at
      });

      return res.status(200).json({
        success: true,
        message: 'Admin user created successfully',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role: 'admin',
          created_at: authData.user.created_at
        }
      });

    } catch (supabaseError: any) {
      console.error('Supabase operation error:', supabaseError);
      return res.status(500).json({ 
        message: 'Supabase operation failed', 
        error: supabaseError.message,
        stack: supabaseError.stack
      });
    }

  } catch (error: any) {
    console.error('=== DIAGNOSTIC ERROR ===', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message,
      stack: error.stack
    });
  } finally {
    console.log('=== DIAGNOSTIC ADMIN SETUP END ===');
  }
}
