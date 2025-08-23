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

// Mock treatments data - in production this would come from a database
let treatments: Treatment[] = [
  {
    id: "1",
    name: "Advanced Hydrating Facial",
    category: "Facial Treatments",
    description: "A deeply nourishing facial treatment using premium serums and advanced techniques to restore skin hydration and luminosity.",
    price: 120,
    duration: 90,
    targetAudience: "client",
    aftercare: "Avoid direct sunlight for 24 hours. Apply provided SPF daily.",
    contraindications: "Active skin infections, recent chemical peels",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Chemical Peel Certification Course",
    category: "Training Courses",
    description: "Comprehensive 3-day certification course covering all aspects of chemical peel application, safety protocols, and client assessment.",
    price: 850,
    duration: 1440,
    targetAudience: "practitioner",
    requirements: "Level 3 Beauty Therapy qualification",
    equipment: "Training models, peel solutions, safety equipment provided",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Microneedling Treatment",
    category: "Microneedling",
    description: "Professional microneedling treatment to improve skin texture, reduce scarring, and stimulate collagen production.",
    price: 200,
    duration: 75,
    targetAudience: "client",
    aftercare: "No makeup for 12 hours. Use provided healing serum twice daily.",
    contraindications: "Active acne, keloid scarring, blood thinning medications",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Advanced Botox & Dermal Fillers Course",
    category: "Training Courses",
    description: "Expert-level training in botulinum toxin and dermal filler injection techniques, including facial anatomy and complication management.",
    price: 1200,
    duration: 2160,
    targetAudience: "practitioner",
    requirements: "Medical or Level 7 qualification, insurance coverage",
    equipment: "Practice models, injection equipment, products provided",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Anti-Aging Consultation",
    category: "Consultation Services",
    description: "Comprehensive skin analysis and treatment planning session with personalized anti-aging recommendations.",
    price: 75,
    duration: 45,
    targetAudience: "client",
    aftercare: "Follow provided skincare regimen recommendations",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

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
