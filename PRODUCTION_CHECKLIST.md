# Production Deployment Checklist

## ✅ Prerequisites Completed
- [x] Fixed Vercel routing configuration for SPA
- [x] Database schema and migration script ready
- [x] Seeding script prepared

## 🚧 Steps to Complete Production Setup

### 1. Database Setup (CRITICAL)
1. **Go to Supabase Dashboard** → Your Project → SQL Editor
2. **Run migration script**: Copy and paste all content from `supabase-migration.sql` and execute
3. **Run seeding script**: Copy and paste all content from `seed-database.sql` and execute
4. **Verify tables**: Check that all tables are created in the Table Editor

### 2. Environment Variables Setup
Configure these in your Vercel deployment settings:

#### Required Variables:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Database (Supabase provides this in Settings → Database)
DATABASE_URL=postgresql://postgres:password@host:port/postgres

# Production Environment
NODE_ENV=production
```

#### Optional (if using Stripe):
```bash
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### 3. Supabase Configuration
1. **Get your credentials** from Supabase Dashboard → Settings → API
2. **Copy Project URL** and **anon/public key**
3. **Get Database URL** from Settings → Database → Connection string

### 4. Vercel Deployment
1. Push your changes to Git
2. Deploy to Vercel: `vercel --prod`
3. Set environment variables in Vercel Dashboard
4. Redeploy after setting environment variables

### 5. Test Your Deployment
1. **Test routing**: Visit `https://your-app.vercel.app/admin-setup`
2. **Test API**: Use the verification script: `node verify-deployment.js https://your-app.vercel.app`
3. **Create admin user**: Complete the admin setup process

## 🔧 Troubleshooting

### Admin Setup Not Working?
- Check that database tables exist in Supabase
- Verify environment variables are set correctly
- Check Vercel function logs for errors
- Ensure Supabase RLS policies allow admin creation

### Database Connection Issues?
- Verify DATABASE_URL format is correct
- Check that Supabase project is not paused
- Ensure connection string includes SSL parameters if required

### API Routes 404?
- Confirm vercel.json is deployed with routing fixes
- Check that API functions are in the correct `/api` directory structure
- Verify TypeScript compilation is working

## 📋 Production Readiness Checklist

- [ ] Database tables created in Supabase
- [ ] Initial data seeded (treatments, courses)
- [ ] Environment variables configured in Vercel
- [ ] Admin setup route accessible (`/admin-setup`)
- [ ] API endpoints responding correctly
- [ ] Admin user creation working
- [ ] Dashboard accessible after admin login
- [ ] RLS policies properly configured

## 🎯 Post-Launch Tasks

1. **Create your admin account** via `/admin-setup`
2. **Test core functionality**:
   - Client management
   - Booking system
   - Course enrollment
   - Payment processing (if enabled)
3. **Review and customize**:
   - Treatments and pricing
   - Course content and pricing
   - RLS policies for your specific needs
4. **Backup strategy**: Set up regular database backups
5. **Monitoring**: Set up error tracking and performance monitoring

## 🔒 Security Notes

- The admin setup route should only be used once to create the first admin
- After creating admin, consider adding additional security measures
- Review and test RLS policies thoroughly before handling real data
- Use HTTPS only in production (Vercel handles this automatically)

---

**Need Help?** 
- Check Vercel function logs in the dashboard
- Review Supabase logs for database issues
- Use the verification script to test deployment health
