import { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, withCors, AuthenticatedRequest, withErrorHandling } from './_middleware';
import { storage } from '../lib/storage';
import { insertTreatmentSchema } from '../shared/schema';

const handler = async (req: VercelRequest | AuthenticatedRequest, res: VercelResponse) => {
  if (req.method === 'POST') {
    // POST requires authentication
    const authReq = req as AuthenticatedRequest;
    try {
      const treatmentData = insertTreatmentSchema.parse(req.body);
      const treatment = await storage.createTreatment(treatmentData);
      res.json(treatment);
    } catch (error) {
      res.status(400).json({ message: "Failed to create treatment", error });
    }
  } 
  else if (req.method === 'GET') {
    // GET is public
    try {
      const treatments = await storage.getAllTreatments();
      res.json(treatments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch treatments", error });
    }
  }
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

// Apply different middleware based on method
const wrappedHandler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'POST') {
    return withErrorHandling(withAuth(handler))(req, res);
  } else {
    return withErrorHandling(withCors(handler))(req, res);
  }
};

export default wrappedHandler;
