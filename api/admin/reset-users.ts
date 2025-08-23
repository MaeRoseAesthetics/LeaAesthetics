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
    console.log('=== RESET USERS START ===');

    // Safety check - require confirmation
    const { confirm } = req.body;
    
    if (confirm !== 'DELETE_ALL_USERS') {
      return res.status(400).json({ 
        message: 'Safety check required. Send {"confirm": "DELETE_ALL_USERS"} to proceed.',
        warning: 'This will permanently delete all users from Supabase Auth!'
      });
    }

    // Get Supabase configuration
    const supabaseUrl = process.env.DATABASE_SUPABASE_URL || 
                       process.env.DATABASE_NEXT_PUBLIC_SUPABASE_URL || 
                       process.env.NEXT_PUBLIC_SUPABASE_URL;
                       
    const supabaseKey = process.env.DATABASE_SUPABASE_SERVICE_ROLE_KEY || 
                       process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        message: 'Supabase configuration missing'
      });
    }

    // Create Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all users
    const { data: userData, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return res.status(500).json({ 
        message: 'Failed to list users', 
        error: listError.message 
      });
    }

    const users = userData?.users || [];
    console.log(`Found ${users.length} users to delete`);

    if (users.length === 0) {
      return res.status(200).json({
        message: 'No users to delete',
        deletedCount: 0
      });
    }

    // Delete all users
    let deletedCount = 0;
    const errors = [];

    for (const user of users) {
      try {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
        
        if (deleteError) {
          console.error(`Failed to delete user ${user.email}:`, deleteError);
          errors.push({ email: user.email, error: deleteError.message });
        } else {
          console.log(`Deleted user: ${user.email}`);
          deletedCount++;
        }
      } catch (error: any) {
        console.error(`Error deleting user ${user.email}:`, error);
        errors.push({ email: user.email, error: error.message });
      }
    }

    console.log(`=== RESET COMPLETE: Deleted ${deletedCount}/${users.length} users ===`);

    return res.status(200).json({
      success: true,
      message: `Deleted ${deletedCount} users successfully`,
      deletedCount,
      totalUsers: users.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error: any) {
    console.error('=== RESET ERROR ===', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message
    });
  }
}
