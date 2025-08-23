const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock API endpoints for development
app.get('/api/auth/user', async (req, res) => {
  // Mock user data
  res.json({
    id: 'mock-user-123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'practitioner'
  });
});

app.get('/api/clients', async (req, res) => {
  // Mock clients data
  res.json([
    {
      id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '+44 123 456789',
      ageVerified: true,
      consentStatus: 'signed'
    },
    {
      id: '2', 
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '+44 987 654321',
      ageVerified: true,
      consentStatus: 'pending'
    }
  ]);
});

app.post('/api/clients', async (req, res) => {
  // Mock client creation
  const newClient = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.json(newClient);
});

app.get('/api/treatments', async (req, res) => {
  // Mock treatments data
  res.json([
    {
      id: '1',
      name: 'Botox Treatment',
      description: 'Anti-wrinkle injections',
      duration: 30,
      price: '250.00',
      requiresConsent: true,
      ageRestriction: 18,
      active: true
    },
    {
      id: '2',
      name: 'Dermal Fillers',
      description: 'Lip and cheek enhancement',
      duration: 45,
      price: '350.00',
      requiresConsent: true,
      ageRestriction: 18,
      active: true
    }
  ]);
});

app.post('/api/treatments', async (req, res) => {
  // Mock treatment creation
  const newTreatment = {
    id: Date.now().toString(),
    ...req.body,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.json(newTreatment);
});

app.get('/api/courses', async (req, res) => {
  // Mock courses data
  res.json([
    {
      id: '1',
      name: 'Level 4 Botox Training',
      description: 'Comprehensive botox training course',
      level: 'Level 4',
      duration: 2,
      price: '1200.00',
      maxStudents: 12,
      ofqualCompliant: true,
      active: true
    },
    {
      id: '2',
      name: 'Advanced Dermal Fillers',
      description: 'Advanced techniques for experienced practitioners',
      level: 'Level 5',
      duration: 3,
      price: '1800.00',
      maxStudents: 8,
      ofqualCompliant: true,
      active: true
    }
  ]);
});

app.post('/api/create-payment-intent', async (req, res) => {
  // Mock Stripe payment intent
  res.json({
    clientSecret: 'pi_mock_client_secret_123',
    paymentId: 'payment_mock_' + Date.now()
  });
});

// Admin setup endpoint
app.post('/api/admin/setup', async (req, res) => {
  console.log('Admin setup request received:', req.body);
  
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
  
  // Mock successful admin creation
  const adminUser = {
    id: 'admin-' + Date.now(),
    email: email,
    firstName: firstName,
    lastName: lastName,
    role: 'admin',
    createdAt: new Date().toISOString()
  };
  
  console.log(`👑 ADMIN USER CREATED: ${firstName} ${lastName} (${email})`);
  
  res.json({
    success: true,
    message: 'Admin user created successfully',
    user: adminUser
  });
});

// Mock authentication endpoints
app.post('/api/auth/signin', async (req, res) => {
  res.json({
    user: {
      id: 'mock-user-123',
      email: req.body.email,
      role: 'practitioner'
    },
    session: {
      access_token: 'mock_access_token_123'
    }
  });
});

app.post('/api/auth/signup', async (req, res) => {
  res.json({
    user: {
      id: 'mock-user-' + Date.now(),
      email: req.body.email,
      role: 'practitioner'
    },
    session: {
      access_token: 'mock_access_token_' + Date.now()
    }
  });
});

app.post('/api/auth/signout', async (req, res) => {
  res.json({ message: 'Signed out successfully' });
});

// Bookings endpoints
app.get('/api/bookings', async (req, res) => {
  // Mock bookings data with today's date
  const today = new Date();
  const todayBookings = [
    {
      id: '1',
      clientId: 'client-1',
      treatmentId: 'treatment-1',
      scheduledDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0).toISOString(),
      status: 'confirmed',
      notes: 'Regular appointment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      clientId: 'client-2', 
      treatmentId: 'treatment-2',
      scheduledDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30).toISOString(),
      status: 'scheduled',
      notes: 'First consultation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      clientId: 'client-1',
      treatmentId: 'treatment-1', 
      scheduledDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0).toISOString(),
      status: 'completed',
      notes: 'Follow-up treatment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  res.json(todayBookings);
});

app.post('/api/bookings', async (req, res) => {
  // Mock booking creation
  const newBooking = {
    id: Date.now().toString(),
    ...req.body,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.json(newBooking);
});

// Client registration
app.post('/api/clients/register', async (req, res) => {
  console.log('Client registration received:', req.body);
  
  // Simulate validation
  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      missingFields
    });
  }
  
  // Mock successful registration
  const newClient = {
    id: 'client_' + Date.now(),
    ...req.body,
    userType: 'client',
    registeredAt: new Date().toISOString(),
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Log registration for practitioner to see
  console.log(`📋 NEW CLIENT REGISTERED: ${newClient.firstName} ${newClient.lastName} (${newClient.email})`);
  console.log(`   Address: ${newClient.address}, ${newClient.city}, ${newClient.state} ${newClient.zipCode}`);
  console.log(`   Phone: ${newClient.phone}`);
  console.log(`   Skin Type: ${newClient.skinType}`);
  console.log(`   Skin Concerns: ${newClient.skinConcerns?.join(', ')}`);
  if (newClient.allergies) console.log(`   Allergies: ${newClient.allergies}`);
  if (newClient.medications) console.log(`   Medications: ${newClient.medications}`);
  if (newClient.emergencyContactName) console.log(`   Emergency Contact: ${newClient.emergencyContactName} (${newClient.emergencyContactPhone})`);
  
  res.status(201).json({
    success: true,
    client: newClient,
    message: 'Registration successful! Welcome to our practice.'
  });
});

// Student registration
app.post('/api/students/register', async (req, res) => {
  console.log('Student registration received:', req.body);
  
  // Simulate validation
  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      missingFields
    });
  }
  
  // Mock successful registration
  const newStudent = {
    id: 'student_' + Date.now(),
    ...req.body,
    userType: 'student',
    registeredAt: new Date().toISOString(),
    status: 'enrolled',
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Log registration for practitioner to see
  console.log(`🎓 NEW STUDENT REGISTERED: ${newStudent.firstName} ${newStudent.lastName} (${newStudent.email})`);
  console.log(`   Address: ${newStudent.address}, ${newStudent.city}, ${newStudent.state} ${newStudent.zipCode}`);
  console.log(`   Phone: ${newStudent.phone}`);
  console.log(`   Education Level: ${newStudent.educationLevel}`);
  console.log(`   Career Goals: ${newStudent.careerGoals?.join(', ')}`);
  console.log(`   Time Commitment: ${newStudent.timeCommitment}`);
  console.log(`   Learning Style: ${newStudent.learningStyle}`);
  if (newStudent.cosmetologyLicense === 'yes') console.log(`   License: ${newStudent.licenseNumber} (${newStudent.licenseState})`);
  if (newStudent.emergencyContactName) console.log(`   Emergency Contact: ${newStudent.emergencyContactName} (${newStudent.emergencyContactPhone})`);
  
  res.status(201).json({
    success: true,
    student: newStudent,
    message: 'Registration successful! Welcome to your learning journey.'
  });
});

// Get all registrations for practitioner dashboard
app.get('/api/registrations', async (req, res) => {
  // Mock recent registrations
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const recentRegistrations = [
    {
      id: 'reg_1',
      type: 'client',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '(555) 123-4567',
      registeredAt: yesterday.toISOString(),
      skinType: 'combination',
      primaryConcerns: ['Fine Lines/Wrinkles', 'Hyperpigmentation']
    },
    {
      id: 'reg_2', 
      type: 'student',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@example.com',
      phone: '(555) 987-6543',
      registeredAt: today.toISOString(),
      educationLevel: 'bachelors',
      careerGoals: ['Open own aesthetics practice', 'Work in medical spa']
    }
  ];
  
  res.json(recentRegistrations);
});

// Dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  res.json({
    todayAppointments: 3,
    monthlyRevenue: '£4,250.00',
    activeStudents: 8,
    complianceScore: '98%',
    newClientsThisWeek: 5,
    newStudentsThisWeek: 2,
    pendingRegistrations: 3
  });
});

// Catch-all for unimplemented API routes
app.all('/api/*', (req, res) => {
  res.json({ message: `Mock API: ${req.method} ${req.path} - Not implemented yet` });
});

app.listen(PORT, () => {
  console.log(`🔧 Development API server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/*`);
});
