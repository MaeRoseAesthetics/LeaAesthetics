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
    console.log('=== CREATE ADMIN DEMO ACCOUNT START ===');

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

    // Demo Admin Account
    try {
      console.log('Creating demo admin account...');
      const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
        email: 'admin@leaaesthetics.com',
        password: 'AdminLea2024!',
        email_confirm: true,
        user_metadata: {
          first_name: 'Lea',
          last_name: 'Admin',
          role: 'admin',
          phone: '+44 20 7946 0958',
          clinic_name: 'Lea Aesthetics Clinic',
          license_number: 'LAC-2024-001',
          specializations: ['Advanced Aesthetics', 'Training & Education', 'Practice Management'],
          years_experience: 10,
          qualifications: [
            'Level 7 Advanced Aesthetics Diploma',
            'JCCP Certified Practitioner',
            'CQC Registered Provider',
            'Ofqual Approved Training Provider'
          ],
          about: 'Leading aesthetic practitioner and educator with over 10 years of experience. Specializes in advanced non-surgical treatments and professional training.',
          clinic_address: '123 Harley Street, London W1G 6BA',
          services: [
            'Anti-Wrinkle Treatments',
            'Dermal Fillers',
            'Chemical Peels',
            'Thread Lifts',
            'Professional Training'
          ]
        }
      });

      if (adminError) {
        console.error('Admin creation error:', adminError);
        if (adminError.message.includes('already registered')) {
          return res.status(200).json({
            success: true,
            message: 'Demo admin account already exists',
            loginCredentials: {
              admin: {
                email: 'admin@leaaesthetics.com',
                password: 'AdminLea2024!',
                name: 'Lea Admin (Administrator)',
                note: 'Account already exists - use these credentials to login'
              }
            }
          });
        } else {
          return res.status(400).json({ 
            message: 'Failed to create admin account',
            error: adminError.message
          });
        }
      }

      console.log('Demo admin created:', adminData.user?.email);
      
      return res.status(200).json({
        success: true,
        message: 'Demo admin account created successfully',
        account: {
          type: 'admin',
          user: {
            id: adminData.user?.id,
            email: adminData.user?.email,
            name: 'Lea Admin',
            role: 'admin'
          }
        },
        loginCredentials: {
          admin: {
            email: 'admin@leaaesthetics.com',
            password: 'AdminLea2024!',
            name: 'Lea Admin (Administrator)'
          }
        }
      });

    } catch (error: any) {
      console.error('Admin creation exception:', error);
      return res.status(500).json({ 
        message: 'Failed to create admin account',
        error: error.message
      });
    }

  } catch (error: any) {
    console.error('=== ADMIN DEMO ACCOUNT ERROR ===', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message
    });
  }
}
