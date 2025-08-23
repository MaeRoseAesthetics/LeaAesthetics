export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }
    
    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long'
      });
    }
    
    // Mock successful admin creation (without actually creating anything)
    const adminUser = {
      id: 'test-admin-' + Date.now(),
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    
    return res.status(200).json({
      success: true,
      message: 'Admin user would be created successfully (TEST MODE)',
      user: adminUser,
      note: 'This is a test endpoint - no actual user was created'
    });
    
  } catch (error: any) {
    console.error('Admin setup test error:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message,
      stack: error.stack
    });
  }
}
