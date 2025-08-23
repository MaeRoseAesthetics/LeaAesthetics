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
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasDatabaseUrl: !!process.env.DATABASE_URL
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
