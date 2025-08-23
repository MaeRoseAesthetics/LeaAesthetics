import { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling, withCors } from '../_middleware';
import { supabase } from '../../lib/supabase';
import { storage } from '../../lib/storage';

const handler = async (req: VercelRequest, res: VercelResponse) => {
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
    
    // Verify token with Supabase
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !authUser) {
      return res.status(401).json({ message: 'Invalid or expired token', user: null });
    }

    // Get or create user profile
    let user = await storage.getUser(authUser.id);
    
    if (!user) {
      // Create a basic profile if it doesn't exist
      user = await storage.upsertUser({
        id: authUser.id,
        email: authUser.email || '',
        firstName: authUser.user_metadata?.first_name || '',
        lastName: authUser.user_metadata?.last_name || '',
        role: authUser.user_metadata?.role || 'practitioner',
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user", error: error instanceof Error ? error.message : String(error) });
  }
};

export default withErrorHandling(withCors(handler));
