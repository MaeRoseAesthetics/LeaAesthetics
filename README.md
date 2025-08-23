# Master Aesthetics Suite

A comprehensive platform for aesthetic practitioners, combining treatment management, student training, and client services. Built specifically for UK compliance including JCCP, CQC, and Ofqual requirements.

## 🌟 Features

### Multi-User Platform
- **Practitioner Portal**: Complete practice management system
- **Client Portal**: Online booking, treatment history, and profile management  
- **Student Portal**: Learning management system with courses and assessments

### Treatment Management
- Online booking system with calendar integration
- Client medical history and consent management
- Treatment protocols and aftercare tracking
- Age verification compliance
- Payment processing with Stripe integration

### Learning Management System (LMS)
- Ofqual-aligned course delivery (Levels 4-7)
- Assessment submissions and portfolio tracking
- CPD (Continuing Professional Development) management
- OSCE (Objective Structured Clinical Examination) support
- RPL/APEL processing

### Compliance & Regulation
- JCCP (Joint Council for Cosmetic Practitioners) compliance
- CQC (Care Quality Commission) audit preparation
- DBS integration for background checks
- Licensing tier management for 2025 UK regulations
- Full audit trails and reporting

## 🏗️ Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Wouter** for lightweight routing
- **React Query** for data fetching and caching
- **React Hook Form** with Zod validation
- **Tailwind CSS** for styling
- **Radix UI** components for accessibility

### Backend (Production)
- **Vercel** serverless functions
- **Supabase** PostgreSQL database
- **Supabase Auth** for authentication
- **Stripe** for payment processing

### Development
- **Express.js** mock API server for local development
- **Concurrently** for running frontend and API simultaneously
- **TypeScript** for type safety

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MaeRoseAesthetics/MaeRose.git
cd MaeRose
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start the development servers:
```bash
npm run dev:full
```

This will start:
- Frontend development server on `http://localhost:5175`
- Mock API server on `http://localhost:3001`

### Development Scripts

```bash
# Start frontend development server only
npm run dev

# Start mock API server only  
npm run dev:api

# Start both frontend and API servers
npm run dev:full

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check
```

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/           # Utilities and configurations
│   │   └── types/         # TypeScript type definitions
│   └── public/            # Static assets
├── api/                   # Vercel serverless functions
├── supabase/              # Database migrations and schemas
├── dev-server.cjs         # Mock API server for development
├── vercel.json           # Vercel deployment configuration
└── README.md
```

## 🌐 Routes & Access

### Public Routes
- `/multi-user` - Multi-user landing page with role selection
- `/client-registration` - Comprehensive client registration form
- `/student-registration` - Detailed student registration form
- `/client-portal` - Client dashboard and booking system
- `/student-portal` - Student learning management system

### Practitioner Routes (Authentication Required)
- `/` - Main practitioner dashboard
- `/bookings` - Appointment and booking management
- `/clients` - Client database and profiles
- `/payments` - Payment processing and history
- `/courses` - Course creation and management
- `/students` - Student tracking and progress
- `/compliance` - Regulatory compliance dashboard

## 👥 User Registration System

### Client Registration
Comprehensive 4-step registration process collecting:
- Personal information (name, contact, demographics)
- Address and emergency contact details
- Medical history, allergies, and skin information
- Treatment preferences and communication settings

### Student Registration  
Detailed 4-step process capturing:
- Personal and contact information
- Educational background and experience
- Career goals and specialty interests
- Learning preferences and time commitment

### Practitioner Benefits
- Immediate access to complete client/student profiles
- Automatic notifications for new registrations
- Full contact information and medical history
- Customized treatment/learning recommendations

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (for payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Application Settings
VITE_APP_URL=http://localhost:5175
```

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy to Vercel
vercel --prod
```

## 🧪 Testing

### Registration Flow Testing

1. Visit `http://localhost:5175/multi-user`
2. Test client registration:
   - Click "Register Now" under Client Portal
   - Complete all 4 steps of registration
   - Check console logs for registration data
3. Test student registration:
   - Click "Register for Courses" under Student Portal
   - Complete all 4 steps of registration
   - Check console logs for registration data

### Mock API Testing

The development server includes mock endpoints that log all registration data to the console, allowing you to see exactly what information is being captured from new clients and students.

## 📋 Compliance Features

### UK Regulatory Compliance
- **JCCP Registration**: Track practitioner registrations and renewals
- **CQC Standards**: Audit preparation and quality metrics
- **Ofqual Alignment**: Course structure matching qualification frameworks
- **Age Verification**: Mandatory age checks for treatments
- **Consent Management**: Digital consent forms with versioning
- **Data Protection**: GDPR-compliant data handling

### Audit Trail
- Complete logging of all user actions
- Treatment history with timestamps
- Student progress tracking
- Payment and booking records
- Compliance status monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is proprietary software developed for Mae Rose Aesthetics.

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact: [support email]

## 🏥 About Mae Rose Aesthetics

Professional aesthetic practice offering both treatments and training, fully compliant with UK regulations and committed to the highest standards of care and education.

---

**Built with ❤️ for the UK aesthetics industry**
