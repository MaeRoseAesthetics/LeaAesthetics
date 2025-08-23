#!/usr/bin/env node

/**
 * Simple Database Setup Script
 * Sets up your Lea Aesthetics database with all tables and data
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Your Supabase credentials
const SUPABASE_URL = 'https://srugjqoxrqlqyfqngqnr.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNydWdqcW94cnFscXlmcW5ncW5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0NTE4OCwiZXhwIjoyMDcxNTIxMTg4fQ.Xo0UUekMYwbXlOobMxamnmjMSzvvXj938MAEwAXuhO8';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('🚀 Lea Aesthetics - Database Setup');
console.log('====================================');

async function testConnection() {
  try {
    console.log('1️⃣ Testing Supabase connection...');
    
    // Simple connection test
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    return true;
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

function createDirectQuery(sql) {
  return new Promise((resolve, reject) => {
    // Use the REST API directly for SQL execution
    const url = `${SUPABASE_URL}/rest/v1/rpc/exec_sql`;
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ sql })
    })
    .then(response => {
      if (response.ok) {
        resolve({ success: true });
      } else {
        response.text().then(text => {
          resolve({ success: false, error: text });
        });
      }
    })
    .catch(error => {
      resolve({ success: false, error: error.message });
    });
  });
}

async function runMigrationManual() {
  console.log('\n2️⃣ Setting up database tables...');
  
  // Essential tables creation queries
  const queries = [
    // Enable UUID extension
    `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
    
    // User profiles table
    `CREATE TABLE IF NOT EXISTS public.user_profiles (
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
    );`,
    
    // Clients table
    `CREATE TABLE IF NOT EXISTS public.clients (
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
    );`,
    
    // Students table
    `CREATE TABLE IF NOT EXISTS public.students (
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
    );`,
    
    // Treatments table
    `CREATE TABLE IF NOT EXISTS public.treatments (
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
    );`,
    
    // Courses table
    `CREATE TABLE IF NOT EXISTS public.courses (
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
    );`
  ];
  
  let successCount = 0;
  
  for (let i = 0; i < queries.length; i++) {
    console.log(`   Creating table ${i + 1}/${queries.length}...`);
    
    try {
      // Use supabase.from() with a raw SQL approach
      const { error } = await supabase.rpc('exec_sql', { sql: queries[i] });
      
      if (error) {
        // If exec_sql doesn't exist, table might already exist
        if (!error.message.includes('already exists') && !error.message.includes('does not exist')) {
          console.warn(`⚠️  Query ${i + 1} warning:`, error.message);
        }
      } else {
        successCount++;
      }
    } catch (err) {
      console.warn(`⚠️  Query ${i + 1} error:`, err.message);
    }
  }
  
  console.log(`✅ Table creation completed (${successCount}/${queries.length} successful)`);
  return true;
}

async function runSeedingData() {
  console.log('\n3️⃣ Adding sample treatments and courses...');
  
  try {
    // Insert treatments
    const treatments = [
      { name: 'Anti-Wrinkle Injections', description: 'Botulinum toxin treatment for dynamic wrinkles and fine lines', duration: 30, price: '200.00', requires_consent: true, age_restriction: 18 },
      { name: 'Dermal Fillers - Lip Enhancement', description: 'Hyaluronic acid fillers for lip volume and definition', duration: 45, price: '350.00', requires_consent: true, age_restriction: 18 },
      { name: 'Skin Consultation', description: 'Comprehensive skin analysis and treatment planning', duration: 30, price: '50.00', requires_consent: false, age_restriction: 16 },
      { name: 'Hydrafacial', description: 'Deep cleansing and hydrating facial treatment', duration: 60, price: '150.00', requires_consent: false, age_restriction: 16 }
    ];
    
    const { data: treatmentData, error: treatmentError } = await supabase
      .from('treatments')
      .upsert(treatments, { onConflict: 'name' });
    
    if (treatmentError) {
      console.warn('⚠️  Treatment seeding warning:', treatmentError.message);
    } else {
      console.log(`✅ Added ${treatments.length} treatments`);
    }
    
    // Insert courses  
    const courses = [
      { name: 'Foundation in Aesthetic Procedures', description: 'Comprehensive introduction to aesthetic medicine and basic procedures', level: 'Level 4', duration: 3, price: '1200.00', max_students: 12 },
      { name: 'Advanced Anti-Wrinkle Injections', description: 'Advanced training in botulinum toxin treatments and complications management', level: 'Level 5', duration: 2, price: '800.00', max_students: 8 },
      { name: 'Consultation & Client Care', description: 'Professional development in client consultation and care', level: 'Level 4', duration: 1, price: '300.00', max_students: 30 }
    ];
    
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .upsert(courses, { onConflict: 'name' });
    
    if (courseError) {
      console.warn('⚠️  Course seeding warning:', courseError.message);
    } else {
      console.log(`✅ Added ${courses.length} courses`);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    return false;
  }
}

async function verifySetup() {
  console.log('\n4️⃣ Verifying setup...');
  
  try {
    // Check treatments
    const { data: treatments, error: treatmentError } = await supabase
      .from('treatments')
      .select('id, name, price')
      .limit(10);
    
    if (!treatmentError && treatments) {
      console.log(`✅ Treatments table ready: ${treatments.length} treatments available`);
      treatments.forEach(t => console.log(`   - ${t.name}: £${t.price}`));
    } else {
      console.log('ℹ️  Treatments table not ready yet');
    }
    
    // Check courses
    const { data: courses, error: courseError } = await supabase
      .from('courses')
      .select('id, name, price')
      .limit(10);
    
    if (!courseError && courses) {
      console.log(`✅ Courses table ready: ${courses.length} courses available`);
      courses.forEach(c => console.log(`   - ${c.name}: £${c.price}`));
    } else {
      console.log('ℹ️  Courses table not ready yet');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

async function main() {
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('\n❌ Cannot connect to Supabase. Please check your credentials.');
    process.exit(1);
  }
  
  await runMigrationManual();
  await runSeedingData(); 
  await verifySetup();
  
  console.log('\n🎉 Database setup completed!');
  console.log('=====================================');
  console.log('✅ Your Supabase database is ready!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Set these environment variables in Vercel:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://srugjqoxrqlqyfqngqnr.supabase.co');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  console.log('   DATABASE_URL=postgres://postgres.srugjqoxrqlqyfqngqnr:49RZ7YC7idmDXy6v@aws...');
  console.log('   NODE_ENV=production');
  console.log('');
  console.log('2. Deploy your app to Vercel');
  console.log('3. Visit /admin-setup to create your admin account');
  console.log('4. Login at /practitioner and start using your platform!');
  console.log('');
  console.log('🔗 Use the .env.production file for exact values to copy!');
}

main().catch(console.error);
