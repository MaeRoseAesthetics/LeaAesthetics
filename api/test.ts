export default function handler(req: any, res: any) {
  try {
    return res.status(200).json({
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        hasSupabaseUrl: !!(process.env.DATABASE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasSupabaseKey: !!(process.env.DATABASE_SUPABASE_SERVICE_ROLE_KEY || process.env.DATABASE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        hasDatabaseUrl: !!(process.env.DATABASE_URL || process.env.DATABASE_POSTGRES_URL),
        // Debug: show which format is being used
        usingDatabasePrefix: !!(process.env.DATABASE_SUPABASE_URL),
        usingNextPublicPrefix: !!(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasServiceRoleKey: !!(process.env.DATABASE_SUPABASE_SERVICE_ROLE_KEY)
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Test API failed',
      message: error.message,
      stack: error.stack
    });
  }
}
