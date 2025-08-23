import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, getCurrentUser } from '../lib/supabase';

export interface AuthenticatedRequest extends VercelRequest {
  user: {
    id: string;
    email?: string;
    role?: string;
  };
}

// Authentication middleware
export const withAuth = (handler: (req: AuthenticatedRequest, res: VercelResponse) => Promise<void | VercelResponse>) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      // CORS headers
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
      res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

      if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
      }

      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      const token = authHeader.split(' ')[1];
      
      // Verify token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }

      // Attach user to request
      (req as AuthenticatedRequest).user = {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'practitioner',
      };

      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

// CORS middleware for non-authenticated routes
export const withCors = (handler: (req: VercelRequest, res: VercelResponse) => Promise<void | VercelResponse>) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    return handler(req, res);
  };
};

// Error handling wrapper
export const withErrorHandling = (handler: Function) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      return await handler(req, res);
    } catch (error: any) {
      console.error('API Error:', error);
      return res.status(500).json({ 
        message: 'Internal server error', 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
  };
};
