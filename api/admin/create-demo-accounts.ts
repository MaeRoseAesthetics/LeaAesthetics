import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('=== CREATE DEMO ACCOUNTS START ===');

    // Get Supabase configuration
    const supabaseUrl = process.env.DATABASE_SUPABASE_URL || 
                       process.env.DATABASE_NEXT_PUBLIC_SUPABASE_URL || 
                       process.env.NEXT_PUBLIC_SUPABASE_URL;
                       
    const supabaseKey = process.env.DATABASE_SUPABASE_SERVICE_ROLE_KEY || 
                       process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        message: 'Supabase configuration missing'
      });
    }

    // Create Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const createdAccounts = [];
    const errors = [];

    // Demo Client Account
    try {
      console.log('Creating demo client account...');
      const { data: clientData, error: clientError } = await supabase.auth.admin.createUser({
        email: 'client@demo.com',
        password: 'DemoClient123!',
        email_confirm: true,
        user_metadata: {
          first_name: 'Emma',
          last_name: 'Johnson',
          role: 'client',
          phone: '+1 (555) 123-4567',
          date_of_birth: '1985-03-15',
          preferred_treatments: ['Facial', 'Microdermabrasion'],
          skin_type: 'Combination',
          allergies: 'None known',
          medical_history: 'No significant medical history'
        }
      });

      if (clientError) {
        console.error('Client creation error:', clientError);
        if (clientError.message.includes('already registered')) {
          errors.push({ type: 'client', error: 'Demo client already exists' });
        } else {
          errors.push({ type: 'client', error: clientError.message });
        }
      } else {
        console.log('Demo client created:', clientData.user?.email);
        createdAccounts.push({
          type: 'client',
          user: {
            id: clientData.user?.id,
            email: clientData.user?.email,
            name: 'Emma Johnson',
            role: 'client'
          }
        });
      }
    } catch (error: any) {
      console.error('Client creation exception:', error);
      errors.push({ type: 'client', error: error.message });
    }

    // Demo Student/Practitioner Account
    try {
      console.log('Creating demo student account...');
      const { data: studentData, error: studentError } = await supabase.auth.admin.createUser({
        email: 'student@demo.com',
        password: 'DemoStudent123!',
        email_confirm: true,
        user_metadata: {
          first_name: 'Sarah',
          last_name: 'Williams',
          role: 'practitioner',
          phone: '+1 (555) 987-6543',
          qualification: 'Level 3 Beauty Therapy Diploma',
          specializations: ['Advanced Facials', 'Chemical Peels', 'Microneedling'],
          experience_years: 2,
          certification_date: '2022-06-15',
          about: 'Passionate beauty therapist specializing in advanced skincare treatments. Committed to helping clients achieve their best skin.',
          available_days: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
          hourly_rate: 75
        }
      });

      if (studentError) {
        console.error('Student creation error:', studentError);
        if (studentError.message.includes('already registered')) {
          errors.push({ type: 'student', error: 'Demo student already exists' });
        } else {
          errors.push({ type: 'student', error: studentError.message });
        }
      } else {
        console.log('Demo student created:', studentData.user?.email);
        createdAccounts.push({
          type: 'practitioner',
          user: {
            id: studentData.user?.id,
            email: studentData.user?.email,
            name: 'Sarah Williams',
            role: 'practitioner'
          }
        });
      }
    } catch (error: any) {
      console.error('Student creation exception:', error);
      errors.push({ type: 'student', error: error.message });
    }

    console.log(`=== DEMO ACCOUNTS COMPLETE: Created ${createdAccounts.length} accounts ===`);

    return res.status(200).json({
      success: true,
      message: `Created ${createdAccounts.length} demo accounts`,
      accounts: createdAccounts,
      errors: errors.length > 0 ? errors : undefined,
      loginCredentials: {
        client: {
          email: 'client@demo.com',
          password: 'DemoClient123!',
          name: 'Emma Johnson (Client)'
        },
        practitioner: {
          email: 'student@demo.com', 
          password: 'DemoStudent123!',
          name: 'Sarah Williams (Practitioner)'
        }
      }
    });

  } catch (error: any) {
    console.error('=== DEMO ACCOUNTS ERROR ===', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message
    });
  }
}
