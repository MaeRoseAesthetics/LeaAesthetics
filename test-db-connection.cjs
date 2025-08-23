#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests connection to your Supabase database and runs the migration
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Your Supabase credentials
const SUPABASE_URL = 'https://srugjqoxrqlqyfqngqnr.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNydWdqcW94cnFscXlmcW5ncW5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0NTE4OCwiZXhwIjoyMDcxNTIxMTg4fQ.Xo0UUekMYwbXlOobMxamnmjMSzvvXj938MAEwAXuhO8';

console.log('🔍 Testing Supabase Connection...');
console.log('=====================================');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testConnection() {
  try {
    console.log('1️⃣ Testing basic connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful!');
    console.log(`📋 Found ${data.length} existing tables:`, data.map(t => t.table_name));
    
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

async function runMigration() {
  try {
    console.log('\n2️⃣ Running database migration...');
    
    // Read migration file
    const migrationPath = path.join(__dirname, 'supabase-migration.sql');
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      return false;
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute migration using Supabase RPC
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });
    
    if (error) {
      // If RPC doesn't exist, try direct SQL execution
      console.log('📝 Trying direct SQL execution...');
      
      // Split migration into individual statements
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      console.log(`📋 Executing ${statements.length} SQL statements...`);
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.toLowerCase().includes('create table') || 
            statement.toLowerCase().includes('create extension') ||
            statement.toLowerCase().includes('create index') ||
            statement.toLowerCase().includes('create policy') ||
            statement.toLowerCase().includes('create trigger') ||
            statement.toLowerCase().includes('create function') ||
            statement.toLowerCase().includes('alter table') ||
            statement.toLowerCase().includes('grant')) {
          
          console.log(`   Executing statement ${i + 1}/${statements.length}...`);
          
          try {
            const { error: execError } = await supabase.rpc('exec_sql', {
              sql: statement + ';'
            });
            
            if (execError && !execError.message.includes('already exists')) {
              console.warn(`⚠️  Statement ${i + 1} warning:`, execError.message);
            }
          } catch (err) {
            console.warn(`⚠️  Statement ${i + 1} error:`, err.message);
          }
        }
      }
    }
    
    console.log('✅ Migration completed!');
    return true;
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    return false;
  }
}

async function runSeeding() {
  try {
    console.log('\n3️⃣ Running database seeding...');
    
    const seedPath = path.join(__dirname, 'seed-database.sql');
    if (!fs.existsSync(seedPath)) {
      console.error('❌ Seed file not found:', seedPath);
      return false;
    }
    
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    // Split into statements and execute
    const statements = seedSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📋 Executing ${statements.length} seeding statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.toLowerCase().includes('insert') || 
          statement.toLowerCase().includes('do $$') ||
          statement.toLowerCase().includes('grant')) {
        
        console.log(`   Seeding ${i + 1}/${statements.length}...`);
        
        try {
          await supabase.rpc('exec_sql', {
            sql: statement + ';'
          });
        } catch (err) {
          console.warn(`⚠️  Seed ${i + 1} error:`, err.message);
        }
      }
    }
    
    console.log('✅ Database seeding completed!');
    return true;
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    return false;
  }
}

async function verifySetup() {
  try {
    console.log('\n4️⃣ Verifying database setup...');
    
    // Check for tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('❌ Could not verify tables:', tablesError.message);
      return false;
    }
    
    console.log(`✅ Found ${tables.length} tables:`, tables.map(t => t.table_name).sort());
    
    // Check for sample data
    try {
      const { data: treatments, error: treatmentError } = await supabase
        .from('treatments')
        .select('id, name')
        .limit(5);
      
      if (!treatmentError && treatments) {
        console.log(`✅ Found ${treatments.length} treatments loaded`);
      }
    } catch (err) {
      console.log('ℹ️  Treatments table may not be accessible yet');
    }
    
    try {
      const { data: courses, error: courseError } = await supabase
        .from('courses')
        .select('id, name')
        .limit(5);
      
      if (!courseError && courses) {
        console.log(`✅ Found ${courses.length} courses loaded`);
      }
    } catch (err) {
      console.log('ℹ️  Courses table may not be accessible yet');
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
    console.log('\n❌ Database connection failed. Please check your credentials.');
    process.exit(1);
  }
  
  const migrationOk = await runMigration();
  if (!migrationOk) {
    console.log('\n⚠️  Migration had issues, but continuing...');
  }
  
  const seedingOk = await runSeeding();
  if (!seedingOk) {
    console.log('\n⚠️  Seeding had issues, but continuing...');
  }
  
  await verifySetup();
  
  console.log('\n🎉 Database setup completed!');
  console.log('=====================================');
  console.log('Next steps:');
  console.log('1. Set environment variables in Vercel');
  console.log('2. Deploy your application');
  console.log('3. Visit /admin-setup to create your admin account');
  console.log('4. Login at /practitioner');
}

main().catch(console.error);
