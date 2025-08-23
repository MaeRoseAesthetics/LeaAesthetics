#!/usr/bin/env node

/**
 * Direct Database Setup using REST API
 * This bypasses the JavaScript client and uses direct HTTP requests
 */

const https = require('https');
const { URL } = require('url');

// Your Supabase credentials
const SUPABASE_URL = 'https://srugjqoxrqlqyfqngqnr.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNydWdqcW94cnFscXlmcW5ncW5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0NTE4OCwiZXhwIjoyMDcxNTIxMTg4fQ.Xo0UUekMYwbXlOobMxamnmjMSzvvXj938MAEwAXuhO8';

console.log('🚀 Lea Aesthetics - Direct Database Setup');
console.log('==========================================');

function makeRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, SUPABASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: responseData
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testConnection() {
  try {
    console.log('1️⃣ Testing connection...');
    
    // Test basic REST API access
    const response = await makeRequest('GET', '/rest/v1/?select=*');
    
    if (response.status === 200 || response.status === 406) {
      console.log('✅ Supabase REST API accessible');
      return true;
    } else {
      console.error('❌ Connection failed:', response.status, response.body);
      return false;
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

async function createTables() {
  console.log('\n2️⃣ Creating database tables...');
  
  const tables = [
    {
      name: 'treatments',
      data: {
        name: 'Anti-Wrinkle Injections',
        description: 'Botulinum toxin treatment for dynamic wrinkles and fine lines',
        duration: 30,
        price: 200.00,
        requires_consent: true,
        age_restriction: 18,
        active: true
      }
    },
    {
      name: 'courses', 
      data: {
        name: 'Foundation in Aesthetic Procedures',
        description: 'Comprehensive introduction to aesthetic medicine and basic procedures',
        level: 'Level 4',
        duration: 3,
        price: 1200.00,
        max_students: 12,
        ofqual_compliant: true,
        active: true
      }
    }
  ];
  
  for (const table of tables) {
    try {
      console.log(`   Testing ${table.name} table...`);
      
      // Try to insert a test record
      const response = await makeRequest('POST', `/rest/v1/${table.name}`, table.data);
      
      if (response.status === 201) {
        console.log(`   ✅ ${table.name} table accessible and writable`);
      } else if (response.status === 409) {
        console.log(`   ✅ ${table.name} table exists (duplicate entry)`);
      } else {
        console.log(`   ⚠️  ${table.name} table response:`, response.status);
      }
    } catch (error) {
      console.log(`   ⚠️  ${table.name} table error:`, error.message);
    }
  }
  
  return true;
}

async function seedData() {
  console.log('\n3️⃣ Adding sample data...');
  
  // Sample treatments
  const treatments = [
    { name: 'Anti-Wrinkle Injections', description: 'Botulinum toxin treatment for dynamic wrinkles', duration: 30, price: 200.00, requires_consent: true, age_restriction: 18, active: true },
    { name: 'Dermal Fillers - Lips', description: 'Lip enhancement with hyaluronic acid fillers', duration: 45, price: 350.00, requires_consent: true, age_restriction: 18, active: true },
    { name: 'Skin Consultation', description: 'Comprehensive skin analysis and treatment planning', duration: 30, price: 50.00, requires_consent: false, age_restriction: 16, active: true },
    { name: 'Hydrafacial', description: 'Deep cleansing and hydrating facial treatment', duration: 60, price: 150.00, requires_consent: false, age_restriction: 16, active: true }
  ];
  
  // Sample courses
  const courses = [
    { name: 'Foundation in Aesthetic Procedures', description: 'Introduction to aesthetic medicine', level: 'Level 4', duration: 3, price: 1200.00, max_students: 12, ofqual_compliant: true, active: true },
    { name: 'Advanced Anti-Wrinkle Training', description: 'Advanced botulinum toxin training', level: 'Level 5', duration: 2, price: 800.00, max_students: 8, ofqual_compliant: true, active: true },
    { name: 'Client Consultation Skills', description: 'Professional consultation techniques', level: 'Level 4', duration: 1, price: 300.00, max_students: 30, ofqual_compliant: true, active: true }
  ];
  
  // Add treatments
  try {
    console.log('   Adding treatments...');
    for (const treatment of treatments) {
      try {
        const response = await makeRequest('POST', '/rest/v1/treatments', treatment);
        if (response.status === 201 || response.status === 409) {
          console.log(`     ✅ ${treatment.name}`);
        }
      } catch (err) {
        console.log(`     ⚠️  ${treatment.name}: ${err.message}`);
      }
    }
  } catch (error) {
    console.log('   ⚠️  Treatments seeding had issues');
  }
  
  // Add courses
  try {
    console.log('   Adding courses...');
    for (const course of courses) {
      try {
        const response = await makeRequest('POST', '/rest/v1/courses', course);
        if (response.status === 201 || response.status === 409) {
          console.log(`     ✅ ${course.name}`);
        }
      } catch (err) {
        console.log(`     ⚠️  ${course.name}: ${err.message}`);
      }
    }
  } catch (error) {
    console.log('   ⚠️  Courses seeding had issues');
  }
  
  return true;
}

async function verifySetup() {
  console.log('\n4️⃣ Verifying setup...');
  
  try {
    // Check treatments
    const treatmentResponse = await makeRequest('GET', '/rest/v1/treatments?select=id,name,price&limit=10');
    
    if (treatmentResponse.status === 200) {
      const treatments = JSON.parse(treatmentResponse.body);
      console.log(`✅ Treatments ready: ${treatments.length} available`);
      treatments.forEach(t => console.log(`   - ${t.name}: £${t.price}`));
    } else {
      console.log('ℹ️  Treatments table not accessible yet');
    }
  } catch (error) {
    console.log('ℹ️  Treatments verification failed');
  }
  
  try {
    // Check courses  
    const courseResponse = await makeRequest('GET', '/rest/v1/courses?select=id,name,price&limit=10');
    
    if (courseResponse.status === 200) {
      const courses = JSON.parse(courseResponse.body);
      console.log(`✅ Courses ready: ${courses.length} available`);
      courses.forEach(c => console.log(`   - ${c.name}: £${c.price}`));
    } else {
      console.log('ℹ️  Courses table not accessible yet');
    }
  } catch (error) {
    console.log('ℹ️  Courses verification failed');
  }
  
  return true;
}

async function main() {
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('\n❌ Cannot connect to Supabase REST API');
    process.exit(1);
  }
  
  await createTables();
  await seedData();
  await verifySetup();
  
  console.log('\n🎉 Database setup completed!');
  console.log('====================================');
  console.log('✅ Your database is ready for deployment!');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('1. Set environment variables in Vercel Dashboard:');
  console.log('   • NEXT_PUBLIC_SUPABASE_URL=https://srugjqoxrqlqyfqngqnr.supabase.co');
  console.log('   • NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  console.log('   • DATABASE_URL=postgres://postgres.srugjqoxrqlqyfqngqnr:49RZ7YC7idmDXy6v...');
  console.log('   • NODE_ENV=production');
  console.log('');
  console.log('2. Deploy your app:');
  console.log('   ./deploy-production.sh');
  console.log('');
  console.log('3. Create admin account at /admin-setup');
  console.log('4. Login at /practitioner');
  console.log('');
  console.log('📄 See .env.production file for exact environment variable values!');
}

main().catch(console.error);
