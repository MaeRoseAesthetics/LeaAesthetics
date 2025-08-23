# ✅ Manual Database Setup - Copy & Paste Method

Since your Supabase connection works but automated setup isn't available, here's the simplest manual approach:

## 🎯 Quick Setup (5 minutes)

### Step 1: Go to Supabase Dashboard
1. Visit [app.supabase.com](https://app.supabase.com)
2. Open your project: **srugjqoxrqlqyfqngqnr**
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Copy & Paste This SQL (Part 1 - Tables)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  role VARCHAR DEFAULT 'practitioner',
  stripe_customer_id VARCHAR,
  stripe_subscription_id VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  date_of_birth TIMESTAMP WITH TIME ZONE,
  medical_history TEXT,
  allergies TEXT,
  current_medications TEXT,
  age_verified BOOLEAN DEFAULT false,
  consent_status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  qualification_level VARCHAR,
  prior_experience TEXT,
  cpd_hours INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treatments table
CREATE TABLE IF NOT EXISTS public.treatments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  duration INTEGER,
  price DECIMAL(10, 2) NOT NULL,
  requires_consent BOOLEAN DEFAULT true,
  age_restriction INTEGER DEFAULT 18,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  level VARCHAR,
  duration INTEGER,
  price DECIMAL(10, 2) NOT NULL,
  max_students INTEGER,
  ofqual_compliant BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  treatment_id UUID REFERENCES public.treatments(id) NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) NOT NULL,
  course_id UUID REFERENCES public.courses(id) NOT NULL,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR DEFAULT 'active',
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consent forms table
CREATE TABLE IF NOT EXISTS public.consent_forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  treatment_id UUID REFERENCES public.treatments(id) NOT NULL,
  form_type VARCHAR NOT NULL,
  content TEXT NOT NULL,
  signed BOOLEAN DEFAULT false,
  signed_date TIMESTAMP WITH TIME ZONE,
  signature_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id),
  student_id UUID REFERENCES public.students(id),
  booking_id UUID REFERENCES public.bookings(id),
  enrollment_id UUID REFERENCES public.enrollments(id),
  stripe_payment_intent_id VARCHAR,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR DEFAULT 'pending',
  age_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course content table
CREATE TABLE IF NOT EXISTS public.course_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) NOT NULL,
  title VARCHAR NOT NULL,
  content TEXT,
  content_type VARCHAR NOT NULL,
  file_path VARCHAR,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) NOT NULL,
  student_id UUID REFERENCES public.students(id) NOT NULL,
  assessment_type VARCHAR NOT NULL,
  score INTEGER,
  max_score INTEGER,
  passed BOOLEAN DEFAULT false,
  feedback TEXT,
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON public.enrollments(student_id);
```

**Click "Run" (Ctrl+Enter) to execute this.**

### Step 3: Copy & Paste Sample Data (Part 2 - Data)

After the first query succeeds, create another **"New Query"** and paste:

```sql
-- Insert sample treatments
INSERT INTO public.treatments (name, description, duration, price, requires_consent, age_restriction, active) VALUES
('Anti-Wrinkle Injections', 'Botulinum toxin treatment for dynamic wrinkles and fine lines', 30, 200.00, true, 18, true),
('Dermal Fillers - Lip Enhancement', 'Hyaluronic acid fillers for lip volume and definition', 45, 350.00, true, 18, true),
('Dermal Fillers - Cheek Enhancement', 'Hyaluronic acid fillers for cheek volume and contouring', 60, 450.00, true, 18, true),
('Chemical Peel - Superficial', 'Light chemical peel for skin texture improvement', 45, 120.00, true, 16, true),
('Microneedling', 'Collagen induction therapy for skin rejuvenation', 60, 180.00, true, 18, true),
('PRP Facial Treatment', 'Platelet-rich plasma therapy for skin regeneration', 75, 280.00, true, 18, true),
('Thread Lift - PDO', 'Non-surgical lifting treatment using PDO threads', 90, 650.00, true, 21, true),
('Skin Consultation', 'Comprehensive skin analysis and treatment planning', 30, 50.00, false, 16, true),
('Hydrafacial', 'Deep cleansing and hydrating facial treatment', 60, 150.00, false, 16, true),
('LED Light Therapy', 'Photodynamic therapy for various skin conditions', 30, 80.00, false, 16, true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample courses
INSERT INTO public.courses (name, description, level, duration, price, max_students, ofqual_compliant, active) VALUES
('Foundation in Aesthetic Procedures', 'Comprehensive introduction to aesthetic medicine and basic procedures', 'Level 4', 3, 1200.00, 12, true, true),
('Advanced Anti-Wrinkle Injections', 'Advanced training in botulinum toxin treatments and complications management', 'Level 5', 2, 800.00, 8, true, true),
('Dermal Filler Masterclass', 'Expert-level training in hyaluronic acid filler techniques', 'Level 5', 3, 1500.00, 10, true, true),
('Chemical Peel Certification', 'Complete training in chemical peel procedures and aftercare', 'Level 4', 2, 650.00, 15, true, true),
('Microneedling & Skin Therapies', 'Training in microneedling and advanced skin treatment protocols', 'Level 4', 1, 400.00, 20, true, true),
('PRP & Regenerative Medicine', 'Advanced course in platelet-rich plasma and regenerative treatments', 'Level 6', 2, 900.00, 12, true, true),
('Thread Lift Techniques', 'Specialized training in PDO thread lift procedures', 'Level 6', 2, 1100.00, 6, true, true),
('Anatomy & Physiology for Aesthetics', 'Essential anatomical knowledge for aesthetic practitioners', 'Level 4', 2, 500.00, 25, true, true),
('Consultation & Client Care', 'Professional development in client consultation and care', 'Level 4', 1, 300.00, 30, true, true),
('Complication Management', 'Advanced training in recognizing and managing treatment complications', 'Level 7', 1, 750.00, 15, true, true)
ON CONFLICT (name) DO NOTHING;

-- Grant permissions for service role to bypass RLS
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
```

**Click "Run" to execute this.**

### Step 4: Verify Setup

Go to **"Table Editor"** and check:
- ✅ You should see 11 tables created
- ✅ `treatments` table should have 10 rows
- ✅ `courses` table should have 10 rows

## 🚀 Next: Deploy Your App

Now that your database is ready:

### 1. Set Environment Variables in Vercel

Go to your Vercel dashboard and add these **exact** environment variables:

**Variable 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://srugjqoxrqlqyfqngqnr.supabase.co`

**Variable 2:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNydWdqcW94cnFscXlmcW5ncW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NDUxODgsImV4cCI6MjA3MTUyMTE4OH0.wQnVN5LSY_V8PNpVEDsCB8jVZUPqDlDee88w4y7h9BI`

**Variable 3:**
- Name: `DATABASE_URL`
- Value: `postgres://postgres.srugjqoxrqlqyfqngqnr:49RZ7YC7idmDXy6v@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x`

**Variable 4:**
- Name: `NODE_ENV`
- Value: `production`

### 2. Deploy Your App

```bash
# Option 1: Use the automated script
./deploy-production.sh

# Option 2: Manual deployment
npm run build
vercel --prod
```

### 3. Test Your Platform

1. **Visit**: `https://your-app.vercel.app/admin-setup`
2. **Create admin account**
3. **Login at**: `https://your-app.vercel.app/practitioner`
4. **Check dashboard works**

## 🎉 You're Done!

Your Lea Aesthetics platform is now production-ready with:
- ✅ 11 database tables
- ✅ 10 professional treatments
- ✅ 10 Ofqual-compliant courses  
- ✅ Full booking and payment system
- ✅ Digital consent management
- ✅ Multi-user portals

**Total setup time**: ~10 minutes

**Need help?** Check the browser console (F12) for any errors and refer to the troubleshooting guides!
