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
    // Get all environment variables related to database and Supabase
    const relevantEnvVars = Object.keys(process.env)
      .filter(key => key.includes('SUPABASE') || key.includes('DATABASE') || key.includes('POSTGRES'))
      .reduce((acc, key) => {
        acc[key] = process.env[key] ? 'SET' : 'NOT SET';
        return acc;
      }, {} as Record<string, string>);

    const debug = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      
      // Key environment variables status
      keyVariables: {
        DATABASE_SUPABASE_URL: !!process.env.DATABASE_SUPABASE_URL,
        DATABASE_SUPABASE_SERVICE_ROLE_KEY: !!process.env.DATABASE_SUPABASE_SERVICE_ROLE_KEY,
        DATABASE_NEXT_PUBLIC_SUPABASE_URL: !!process.env.DATABASE_NEXT_PUBLIC_SUPABASE_URL,
        DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY,
        // Legacy variables
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      },

      // Partial values for verification (safe to show)
      partialValues: {
        DATABASE_SUPABASE_URL: process.env.DATABASE_SUPABASE_URL?.substring(0, 30) + '...',
        DATABASE_SUPABASE_SERVICE_ROLE_KEY: process.env.DATABASE_SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...'
      },

      // All relevant environment variables
      allRelevantVars: relevantEnvVars,

      // Count of all env vars
      totalEnvVars: Object.keys(process.env).length
    };

    return res.status(200).json(debug);

  } catch (error: any) {
    console.error('Debug error:', error);
    return res.status(500).json({ 
      message: 'Debug error', 
      error: error.message,
      stack: error.stack
    });
  }
}
