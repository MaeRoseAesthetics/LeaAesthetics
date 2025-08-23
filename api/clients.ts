import { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest, withErrorHandling } from './_middleware';
import { storage } from '../lib/storage';
import { insertClientSchema } from '../shared/schema';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  const userId = req.user.id;

  if (req.method === 'POST') {
    try {
      const clientData = insertClientSchema.parse({
        ...req.body,
        userId: userId
      });
      const client = await storage.createClient(clientData);
      res.json(client);
    } catch (error) {
      res.status(400).json({ message: "Failed to create client", error });
    }
  } 
  else if (req.method === 'GET') {
    try {
      const clients = await storage.getClientsByUser(userId);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients", error });
    }
  }
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default withErrorHandling(withAuth(handler));
