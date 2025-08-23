import { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling, withCors } from '../_middleware';

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const debug = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
      supabaseKeyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      databaseUrlExists: !!process.env.DATABASE_URL,
      environmentVariables: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        // Legacy variables
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
        // DATABASE_ prefixed variables
        DATABASE_SUPABASE_URL: process.env.DATABASE_SUPABASE_URL ? 'SET' : 'NOT SET',
        DATABASE_NEXT_PUBLIC_SUPABASE_URL: process.env.DATABASE_NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
        DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
        DATABASE_SUPABASE_SERVICE_ROLE_KEY: process.env.DATABASE_SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
        DATABASE_POSTGRES_URL: process.env.DATABASE_POSTGRES_URL ? 'SET' : 'NOT SET',
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
      },
      allSupabaseVars: Object.keys(process.env)
        .filter(key => key.includes('SUPABASE') || key.includes('DATABASE'))
        .map(key => ({ name: key, isSet: !!process.env[key] }))
    };

    res.json(debug);
  } catch (error: any) {
    console.error('Debug error:', error);
    res.status(500).json({ 
      message: 'Debug error', 
      error: error.message,
      stack: error.stack
    });
  }
};

export default withErrorHandling(withCors(handler));
