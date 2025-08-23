# Master Aesthetics Suite - UK Compliant Platform

## Overview

Master Aesthetics Suite is a comprehensive single-tenant application designed for dual-role aesthetic practitioners and tutors in the UK. The platform integrates clinical practice management with regulated Learning Management System (LMS) capabilities, ensuring full compliance with UK regulatory frameworks including JCCP, Ofqual, CQC, VTCT, and the 2025 aesthetic licensing scheme.

The system serves as a unified solution for solo or small aesthetic businesses that offer both treatments (injectables, skin therapies) and professional training (Level 4-7 diplomas), with built-in compliance monitoring, patient management, and educational content delivery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for build tooling
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: TailwindCSS with custom design tokens for medical/professional theming
- **State Management**: React Query for server state, React Hook Form for form handling
- **Routing**: Wouter for client-side routing
- **Authentication**: Custom hook-based auth system with session management

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Authentication**: OpenID Connect (OIDC) integration with Replit Auth
- **Session Management**: PostgreSQL-backed session storage with express-session

### Database Design
- **User Management**: Multi-role system (practitioner, admin, client, student)
- **Client/Patient Data**: Medical histories, consent forms, treatment records
- **Student Management**: Academic records, course enrollments, CPD tracking
- **Booking System**: Treatment appointments and course scheduling
- **Payment Processing**: Stripe integration with compliance tracking
- **Content Management**: Course materials, assessments, and learning paths

### Key Features Architecture
- **Dual-Mode Interface**: Switchable views between treatment practice and training delivery
- **Compliance Engine**: Automated monitoring of regulatory requirements (JCCP, CQC, Ofqual)
- **LMS Components**: Course creation, assessment delivery, progress tracking
- **Consent Management**: Digital forms with e-signature capabilities
- **Payment Processing**: Age verification, face-to-face mandate compliance
- **CPD Tracking**: Continuing Professional Development hour monitoring

### Security & Compliance
- **Data Protection**: GDPR-compliant data handling with explicit consent mechanisms
- **Medical Standards**: JCCP/CPSA template integration for consent forms
- **Age Verification**: Built-in checks for treatment eligibility
- **Audit Trails**: Comprehensive logging for CQC inspection readiness

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit OIDC provider for user authentication
- **File Storage**: Local file system (ready for cloud storage integration)

### Payment Processing
- **Stripe**: Payment processing with Elements integration
- **Age Verification**: Built-in compliance checks for treatment payments
- **Subscription Management**: Stripe customer and subscription handling

### UI/UX Libraries
- **Radix UI**: Accessible component primitives for form controls and overlays
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form validation and state management
- **Zod**: Runtime type validation for form schemas

### Development Tools
- **TypeScript**: Full type safety across client and server
- **Vite**: Fast development server and build tool
- **TailwindCSS**: Utility-first styling framework
- **ESLint/Prettier**: Code quality and formatting tools

### Compliance & Regulatory
- **JCCP Templates**: Integrated consent form templates
- **Ofqual Framework**: Course structure alignment for accredited training
- **CQC Reporting**: Built-in metrics for healthcare inspection requirements
- **DBS Integration**: Background check status tracking (ready for API integration)

### Communication (Ready for Integration)
- **Email Service**: Prepared for SendGrid integration
- **SMS Service**: Prepared for Twilio integration
- **Notifications**: Built-in toast system for user feedback

The architecture is designed to be modular and extensible, with clear separation between treatment practice functionality and educational/training features, while maintaining shared user and compliance management across both domains.