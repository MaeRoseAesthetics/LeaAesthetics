# Vercel Deployment Setup for Lea Aesthetics

## Environment Variables Required

Go to your Vercel project dashboard → Settings → Environment Variables and add:

### Required for Admin Setup:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres
NODE_ENV=production
```

### Optional (for payments):
```
STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_... for testing)
```

## How to get Supabase credentials:

1. Go to https://app.supabase.com
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy:
   - Project URL → NEXT_PUBLIC_SUPABASE_URL
   - Project API keys → anon/public key → NEXT_PUBLIC_SUPABASE_ANON_KEY
5. Go to Settings → Database
6. Copy the connection string → DATABASE_URL

## After setting environment variables:

1. Redeploy your Vercel project (or it will auto-deploy)
2. Wait for deployment to complete
3. Try the admin setup again at your-domain.vercel.app/admin-setup

## Troubleshooting:

If you still get JSON parse errors:
1. Check Vercel function logs for actual error messages
2. Ensure all environment variables are set correctly
3. Verify Supabase project is active and accessible
4. Check that DATABASE_URL connection string is correct
