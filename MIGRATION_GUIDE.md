# Migration Guide: Replit to Vercel + Supabase

This guide walks you through migrating your Master Aesthetics Suite from Replit hosting to Vercel and Supabase.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
3. **GitHub Repository**: Your code should be in a GitHub repository
4. **Stripe Account**: For payment processing

## Step 1: Set up Supabase

1. **Create a new Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: "aesthetics-suite" (or similar)
   - Enter database password (save this!)
   - Select region (choose closest to your users)
   - Click "Create new project"

2. **Run the database migration**:
   - Wait for your project to be ready
   - Go to the SQL editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-migration.sql`
   - Click "Run" to execute the migration
   - This creates all your tables with proper Row Level Security (RLS)

3. **Get your connection details**:
   - Go to Settings > Database
   - Copy the "Connection string" and save it as `DATABASE_URL`
   - Go to Settings > API
   - Copy the "Project URL" and save it as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the "anon public" key and save it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Configure authentication**:
   - Go to Authentication > Settings
   - Enable "Enable email confirmations" if desired
   - Configure email templates as needed
   - Add your domain to "Site URL" and "Redirect URLs"

## Step 2: Set up Vercel

1. **Connect your GitHub repository**:
   - Go to [vercel.com](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository containing your migrated code

2. **Configure build settings**:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set environment variables**:
   - In your Vercel project dashboard, go to Settings > Environment Variables
   - Add the following variables:

   ```
   DATABASE_URL=your_supabase_connection_string
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   NODE_ENV=production
   ```

4. **Deploy your application**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be available at your Vercel URL

## Step 3: Update Your Frontend

Since the authentication system has changed from Replit Auth to Supabase Auth, you'll need to update your frontend components:

1. **Replace authentication hooks**:
   - Remove any Replit-specific authentication code
   - Use Supabase authentication methods
   - Update login/logout flows

2. **Update API calls**:
   - The API endpoints are now serverless functions
   - Ensure you're passing authentication tokens properly
   - Update any hardcoded API URLs to use your Vercel domain

## Step 4: Data Migration

If you have existing data in your Neon database:

1. **Export data from Neon**:
   ```bash
   pg_dump your_neon_connection_string > backup.sql
   ```

2. **Import data to Supabase**:
   - Remove the schema creation parts from backup.sql (since we already created the schema)
   - Run the data-only import in Supabase SQL editor
   - Or use the Supabase migration tools

## Step 5: Update Domain and DNS

1. **Custom Domain (Optional)**:
   - In Vercel dashboard, go to your project > Settings > Domains
   - Add your custom domain
   - Configure DNS as instructed by Vercel

2. **Update Supabase URLs**:
   - Go to Supabase > Authentication > Settings
   - Update "Site URL" to your new Vercel domain
   - Update "Redirect URLs" to match your new domain

## Step 6: Testing

1. **Test authentication**:
   - Sign up for a new account
   - Test login/logout flows
   - Verify user profiles are created correctly

2. **Test database operations**:
   - Create clients, students, treatments, courses
   - Test booking and enrollment workflows
   - Verify payment processing with Stripe

3. **Test API endpoints**:
   - Verify all API routes work correctly
   - Test error handling and validation
   - Check CORS configuration for frontend calls

## Important Changes

### Authentication
- **Old**: Replit OIDC with Express sessions
- **New**: Supabase Auth with JWT tokens
- Users need to re-register (data can be migrated separately)

### Database
- **Old**: Neon PostgreSQL with custom user management
- **New**: Supabase PostgreSQL with built-in auth.users table
- Schema updated to reference `auth.users` instead of custom users table

### API Architecture
- **Old**: Express.js server with routes
- **New**: Vercel serverless functions
- Each endpoint is now a separate function file

### Environment Variables
- Remove all Replit-specific variables
- Add Supabase configuration variables
- Update Stripe configuration if needed

## Troubleshooting

### Build Errors
- Check that all dependencies are properly installed
- Verify TypeScript types are correct
- Ensure environment variables are set

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check that your IP is allowed in Supabase (if using connection pooling)
- Ensure database migrations ran successfully

### Authentication Issues
- Verify Supabase project URL and API keys
- Check CORS configuration in Supabase
- Ensure JWT tokens are being passed correctly

### API Function Errors
- Check Vercel function logs in the dashboard
- Verify all imports and dependencies
- Test functions locally with `vercel dev`

## Performance Optimizations

1. **Enable caching** in Vercel for static assets
2. **Configure database connection pooling** in Supabase
3. **Optimize API functions** by minimizing cold starts
4. **Use Supabase Edge Functions** for compute-heavy operations if needed

## Security Considerations

1. **Row Level Security (RLS)** is enabled on all tables
2. **API routes** are protected with authentication middleware
3. **Environment variables** are securely managed in Vercel
4. **Stripe webhooks** should be configured with endpoint secrets

## Next Steps

1. Monitor your application for any issues
2. Set up monitoring and alerting
3. Configure backups for your Supabase database
4. Consider implementing logging and analytics
5. Update any external integrations to use new URLs

Your Master Aesthetics Suite is now successfully migrated from Replit to a modern, scalable stack with Vercel and Supabase!
