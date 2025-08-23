import { VercelRequest, VercelResponse } from '@vercel/node';

interface Treatment {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  targetAudience: "client" | "practitioner" | "both";
  requirements?: string;
  aftercare?: string;
  contraindications?: string;
  equipment?: string;
  createdAt: string;
  updatedAt: string;
}

// Empty treatments array - ready for client to add their own data
let treatments: Treatment[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        const { category, targetAudience } = req.query;
        let filteredTreatments = treatments;

        if (category) {
          filteredTreatments = filteredTreatments.filter(t => t.category === category);
        }

        if (targetAudience) {
          filteredTreatments = filteredTreatments.filter(t => 
            t.targetAudience === targetAudience || t.targetAudience === 'both'
          );
        }

        return res.status(200).json({
          treatments: filteredTreatments,
          total: filteredTreatments.length,
          categories: [...new Set(treatments.map(t => t.category))],
          stats: {
            totalValue: treatments.reduce((sum, t) => sum + t.price, 0),
            averageDuration: Math.round(treatments.reduce((sum, t) => sum + t.duration, 0) / treatments.length),
            clientServices: treatments.filter(t => t.targetAudience === "client").length,
            trainingCourses: treatments.filter(t => t.targetAudience === "practitioner").length,
          }
        });

      case 'POST':
        const newTreatment: Treatment = {
          id: Date.now().toString(),
          ...req.body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (!newTreatment.name || !newTreatment.category || !newTreatment.description) {
          return res.status(400).json({ 
            error: 'Name, category, and description are required' 
          });
        }

        treatments.push(newTreatment);
        return res.status(201).json({ treatment: newTreatment });

      case 'PUT':
        const { id } = req.query;
        const treatmentIndex = treatments.findIndex(t => t.id === id);
        
        if (treatmentIndex === -1) {
          return res.status(404).json({ error: 'Treatment not found' });
        }

        treatments[treatmentIndex] = {
          ...treatments[treatmentIndex],
          ...req.body,
          updatedAt: new Date().toISOString(),
        };

        return res.status(200).json({ treatment: treatments[treatmentIndex] });

      case 'DELETE':
        const { id: deleteId } = req.query;
        const deleteIndex = treatments.findIndex(t => t.id === deleteId);
        
        if (deleteIndex === -1) {
          return res.status(404).json({ error: 'Treatment not found' });
        }

        const deletedTreatment = treatments.splice(deleteIndex, 1)[0];
        return res.status(200).json({ 
          message: 'Treatment deleted successfully',
          treatment: deletedTreatment 
        });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error: any) {
    console.error('Treatments API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
