# Supabase Setup Guide - Step by Step

This guide will walk you through setting up your Supabase database in 10 minutes or less.

## 📋 Prerequisites

- [ ] Supabase account created at [supabase.com](https://supabase.com)
- [ ] Your project created in Supabase dashboard

## Step 1: Access Your Supabase Project

1. **Login to Supabase**: Go to [app.supabase.com](https://app.supabase.com)
2. **Select your project** from the dashboard
3. **Note your project name** - you'll need this

## Step 2: Run the Database Migration

### 2.1 Open SQL Editor
1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button (+ icon)

### 2.2 Copy and Execute Migration Script
1. **Open the file** `supabase-migration.sql` from your project
2. **Copy ALL content** (Ctrl+A, then Ctrl+C)
3. **Paste into Supabase SQL Editor**
4. **Click "Run"** button (or Ctrl+Enter)

**Expected Result**: ✅ Query completed successfully
**Time**: ~30 seconds

### 2.3 Verify Tables Created
1. Click **"Table Editor"** in left sidebar
2. You should see these 11 tables:
   - `user_profiles`
   - `clients`
   - `students` 
   - `treatments`
   - `courses`
   - `bookings`
   - `enrollments`
   - `consent_forms`
   - `payments`
   - `course_content`
   - `assessments`

## Step 3: Seed the Database with Initial Data

### 3.1 Run Seeding Script
1. **Back to SQL Editor** → **"New Query"**
2. **Open the file** `seed-database.sql`
3. **Copy ALL content** and paste
4. **Click "Run"**

**Expected Result**: 
- ✅ Query completed successfully
- You'll see notices: "Created 10 treatments", "Created 10 courses", etc.

### 3.2 Verify Data Loaded
1. Go to **"Table Editor"**
2. Click on `treatments` table - should show 10 rows
3. Click on `courses` table - should show 10 rows
4. Click on `course_content` table - should show 14 rows

## Step 4: Get Your Connection Details

### 4.1 Get API Credentials
1. Click **"Settings"** in left sidebar
2. Click **"API"** 
3. **Copy these values**:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon/Public Key**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`

### 4.2 Get Database URL
1. Still in **Settings**, click **"Database"**
2. Scroll down to **"Connection string"**
3. Select **"Pooled Connection"** → **"Transaction mode"**
4. **Copy the connection string**: `postgresql://postgres.xxx:[PASSWORD]@aws...`
5. **Replace [PASSWORD]** with your actual database password

## Step 5: Configure Vercel Environment Variables

### 5.1 Go to Vercel Dashboard
1. Login to [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Select your LeaAesthetics project**
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in left menu

### 5.2 Add Required Variables
Click **"Add New"** for each:

**Variable 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://your-project.supabase.co` (from Step 4.1)
- Environment: Production

**Variable 2:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- Value: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...` (from Step 4.1)
- Environment: Production

**Variable 3:**
- Name: `DATABASE_URL`
- Value: `postgresql://postgres.xxx:your-password@aws...` (from Step 4.2)
- Environment: Production

**Variable 4:**
- Name: `NODE_ENV`
- Value: `production`
- Environment: Production

## Step 6: Redeploy Your Application

### 6.1 Trigger New Deployment
1. Still in Vercel dashboard
2. Go to **"Deployments"** tab  
3. Click **"Redeploy"** on the latest deployment
4. **OR** push a new commit to trigger deployment

### 6.2 Wait for Deployment
- ⏳ Deployment typically takes 2-3 minutes
- ✅ Look for "Deployment completed" status

## Step 7: Test Your Setup

### 7.1 Test the Admin Setup Route
1. **Visit**: `https://your-app.vercel.app/admin-setup`
2. **Expected**: You should see the admin setup form
3. **If you see 404**: Wait 2 more minutes and try again

### 7.2 Run Verification Script (Optional)
```bash
node verify-deployment.js https://your-app.vercel.app
```

### 7.3 Create Your Admin Account
1. Fill out the admin setup form:
   - **Email**: Your business email
   - **Password**: Strong password (8+ characters)
   - **Names**: Your professional name
2. **Click "Create Admin Account"**
3. **Expected**: Success message and redirect

## Step 8: Test Admin Login

1. **Go to**: `https://your-app.vercel.app/practitioner`
2. **Login** with your admin credentials
3. **Expected**: Redirect to dashboard
4. **Check**: You should see the admin dashboard

## 🎉 Success Checklist

- [ ] ✅ Migration script executed successfully
- [ ] ✅ 11 tables created in Supabase
- [ ] ✅ Seeding script completed
- [ ] ✅ 10 treatments and 10 courses loaded
- [ ] ✅ Environment variables set in Vercel
- [ ] ✅ Application redeployed
- [ ] ✅ Admin setup page accessible
- [ ] ✅ Admin account created successfully
- [ ] ✅ Admin login working
- [ ] ✅ Dashboard accessible

## 🚨 Troubleshooting

### Issue: "Database connection failed"
**Solution**: 
1. Double-check `DATABASE_URL` format
2. Ensure password is correct in connection string
3. Verify Supabase project is not paused

### Issue: "Admin setup route 404"
**Solution**:
1. Wait 2-3 minutes after redeployment
2. Clear browser cache
3. Check Vercel deployment status

### Issue: "Failed to create admin user"
**Solution**:
1. Check Supabase logs in dashboard
2. Verify RLS policies are not blocking admin creation
3. Check that migration script completed successfully

### Issue: Environment variables not working
**Solution**:
1. Ensure you set variables for "Production" environment
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

## 📞 Need Help?

If you encounter any issues:

1. **Check Supabase Logs**: Dashboard → Logs → Check for errors
2. **Check Vercel Logs**: Dashboard → Functions → View function logs  
3. **Browser Console**: F12 → Console → Look for JavaScript errors
4. **Double-check**: All steps completed exactly as written

---

**Estimated Total Time**: 10-15 minutes

**🎯 After completion**: You'll have a fully functional aesthetic clinic management system with:
- ✅ Database with 10 treatments and 10 courses
- ✅ Admin account created
- ✅ All features accessible
- ✅ Ready for real clients and students

**Next Step**: Read the `ADMIN_USER_GUIDE.md` to learn how to use all the features!
