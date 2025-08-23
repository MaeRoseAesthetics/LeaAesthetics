import { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest, withErrorHandling } from '../_middleware';
import { storage } from '../../lib/storage';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = req.user.id;
    const user = await storage.getUser(userId);
    
    if (!user) {
      // Create a basic profile if it doesn't exist
      const newUser = await storage.upsertUser({
        id: userId,
        email: req.user.email || '',
        firstName: '',
        lastName: '',
        role: req.user.role || 'practitioner',
      });
      return res.json(newUser);
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export default withErrorHandling(withAuth(handler));
