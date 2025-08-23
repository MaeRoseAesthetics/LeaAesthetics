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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Try to get user from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No authentication provided - return null (not authenticated)
      return res.status(401).json({ message: 'Not authenticated', user: null });
    }

    const token = authHeader.split(' ')[1];
    
    // Get Supabase configuration and create client dynamically
    const supabaseUrl = process.env.DATABASE_SUPABASE_URL || 
                       process.env.DATABASE_NEXT_PUBLIC_SUPABASE_URL || 
                       process.env.NEXT_PUBLIC_SUPABASE_URL;
                       
    const supabaseKey = process.env.DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        message: 'Supabase configuration missing for user verification'
      });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verify token with Supabase
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !authUser) {
      return res.status(401).json({ message: 'Invalid or expired token', user: null });
    }

    // Return basic user info from auth metadata (simplified - no storage dependency)
    const user = {
      id: authUser.id,
      email: authUser.email || '',
      firstName: authUser.user_metadata?.first_name || '',
      lastName: authUser.user_metadata?.last_name || '',
      role: authUser.user_metadata?.role || 'practitioner',
      created_at: authUser.created_at
    };
    
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user", error: error instanceof Error ? error.message : String(error) });
  }
}
