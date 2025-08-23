// Application Constants for Master Aesthetics Suite

// Color Scheme (Medical Professional)
export const COLORS = {
  MEDICAL_BLUE: '#0066CC',
  CLINICAL_GREY: '#F8F9FA',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
} as const;

// Compliance Organizations
export const COMPLIANCE_ORGANIZATIONS = {
  JCCP: 'Joint Council for Cosmetic Practitioners',
  CQC: 'Care Quality Commission',
  OFQUAL: 'Office of Qualifications and Examinations Regulation',
  VTCT: 'Vocational Training Charitable Trust',
  CPSA: 'Cosmetic Practice Standards Authority',
  DBS: 'Disclosure and Barring Service',
} as const;

// Treatment Categories
export const TREATMENT_CATEGORIES = {
  INJECTABLES: 'Injectable Treatments',
  SKIN_THERAPY: 'Skin Therapy',
  BODY_CONTOURING: 'Body Contouring',
  LASER_TREATMENTS: 'Laser Treatments',
  CONSULTATION: 'Consultation Services',
} as const;

// Course Levels (Ofqual Framework)
export const COURSE_LEVELS = {
  LEVEL_3: 'Level 3',
  LEVEL_4: 'Level 4',
  LEVEL_5: 'Level 5',
  LEVEL_6: 'Level 6',
  LEVEL_7: 'Level 7',
} as const;

// Booking Status Options
export const BOOKING_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const;

// Payment Status Options
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  DISPUTED: 'disputed',
} as const;

// Consent Form Types
export const CONSENT_FORM_TYPES = {
  TREATMENT: 'treatment',
  PSYCHOLOGICAL_SCREENING: 'psychological_screening',
  MEDICAL_HISTORY: 'medical_history',
  AGE_VERIFICATION: 'age_verification',
  PHOTOGRAPHY: 'photography',
} as const;

// Content Types for LMS
export const CONTENT_TYPES = {
  TEXT: 'text',
  VIDEO: 'video',
  PDF: 'pdf',
  QUIZ: 'quiz',
  PRESENTATION: 'presentation',
  AUDIO: 'audio',
} as const;

// Assessment Types
export const ASSESSMENT_TYPES = {
  QUIZ: 'quiz',
  PRACTICAL: 'practical',
  PORTFOLIO: 'portfolio',
  OSCE: 'osce',
  WRITTEN_EXAM: 'written_exam',
  VIVA: 'viva',
} as const;

// User Roles
export const USER_ROLES = {
  PRACTITIONER: 'practitioner',
  ADMIN: 'admin',
  CLIENT: 'client',
  STUDENT: 'student',
  TUTOR: 'tutor',
} as const;

// Age Verification Requirements
export const AGE_VERIFICATION = {
  MINIMUM_AGE: 18,
  FACE_TO_FACE_REQUIRED: true,
  DOCUMENTATION_REQUIRED: ['passport', 'driving_license', 'national_id'],
} as const;

// CPD Requirements
export const CPD_REQUIREMENTS = {
  ANNUAL_MINIMUM_HOURS: 20,
  VERIFIABLE_HOURS_MINIMUM: 10,
  ASSESSMENT_REQUIRED: true,
} as const;

// Licensing Tiers (2025 UK Scheme)
export const LICENSING_TIERS = {
  GREEN: {
    level: 'green',
    name: 'Basic Treatments',
    description: 'Low-risk treatments (topical, basic injections)',
    ageRestriction: 18,
  },
  AMBER: {
    level: 'amber',
    name: 'Moderate Risk Treatments',
    description: 'Moderate-risk treatments (dermal fillers, advanced techniques)',
    ageRestriction: 21,
  },
  RED: {
    level: 'red',
    name: 'High Risk Treatments',
    description: 'High-risk treatments (surgical procedures, complex injections)',
    ageRestriction: 25,
  },
} as const;

// File Upload Limits
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 50,
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    VIDEOS: ['video/mp4', 'video/webm', 'video/ogg'],
    AUDIO: ['audio/mp3', 'audio/wav', 'audio/ogg'],
  },
} as const;

// Navigation Menu Items
export const NAVIGATION = {
  TREATMENT_MODE: [
    { path: '/', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/bookings', icon: 'fas fa-calendar-alt', label: 'Bookings' },
    { path: '/clients', icon: 'fas fa-users', label: 'Clients' },
    { path: '/payments', icon: 'fas fa-credit-card', label: 'Payments' },
    { path: '/compliance', icon: 'fas fa-shield-alt', label: 'Compliance' },
  ],
  TRAINING_MODE: [
    { path: '/courses', icon: 'fas fa-graduation-cap', label: 'Courses' },
    { path: '/students', icon: 'fas fa-user-graduate', label: 'Students' },
    { path: '/assessments', icon: 'fas fa-tasks', label: 'Assessments' },
    { path: '/content', icon: 'fas fa-book-open', label: 'Content' },
  ],
} as const;

// Time Slots for Booking
export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00'
] as const;

// Default Treatment Durations (in minutes)
export const DEFAULT_DURATIONS = {
  CONSULTATION: 30,
  BOTOX: 45,
  DERMAL_FILLERS: 60,
  SKIN_TREATMENT: 90,
  LASER_SESSION: 45,
  TRAINING_SESSION: 180,
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_REMINDER: 'booking_reminder',
  PAYMENT_RECEIVED: 'payment_received',
  CONSENT_REQUIRED: 'consent_required',
  COURSE_ENROLLED: 'course_enrolled',
  ASSESSMENT_DUE: 'assessment_due',
  COMPLIANCE_ALERT: 'compliance_alert',
  CPD_REMINDER: 'cpd_reminder',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You are not authorized to access this resource',
  AGE_VERIFICATION_REQUIRED: 'Age verification is required for this treatment',
  CONSENT_REQUIRED: 'Valid consent form must be signed before treatment',
  PAYMENT_FAILED: 'Payment processing failed. Please try again',
  BOOKING_CONFLICT: 'This time slot is already booked',
  FILE_TOO_LARGE: `File size exceeds ${FILE_UPLOAD.MAX_SIZE_MB}MB limit`,
  INVALID_FILE_TYPE: 'File type not supported',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Booking created successfully',
  PAYMENT_PROCESSED: 'Payment processed successfully',
  CONSENT_SIGNED: 'Consent form signed successfully',
  COURSE_ENROLLED: 'Student enrolled in course successfully',
  CONTENT_UPLOADED: 'Course content uploaded successfully',
  ASSESSMENT_SUBMITTED: 'Assessment submitted successfully',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  CLIENTS: '/api/clients',
  STUDENTS: '/api/students',
  TREATMENTS: '/api/treatments',
  COURSES: '/api/courses',
  BOOKINGS: '/api/bookings',
  ENROLLMENTS: '/api/enrollments',
  PAYMENTS: '/api/payments',
  CONSENT_FORMS: '/api/consent-forms',
  COURSE_CONTENT: '/api/course-content',
  ASSESSMENTS: '/api/assessments',
  DASHBOARD_STATS: '/api/dashboard/stats',
  AUTH_USER: '/api/auth/user',
  LOGIN: '/api/login',
  LOGOUT: '/api/logout',
  CREATE_PAYMENT_INTENT: '/api/create-payment-intent',
} as const;

// Date/Time Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  API: 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'',
} as const;

// Responsive Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

// Feature Flags
export const FEATURES = {
  STRIPE_PAYMENTS: true,
  VIDEO_CALLS: false,
  AI_RECOMMENDATIONS: false,
  MOBILE_APP: false,
  MULTI_LANGUAGE: false,
} as const;

// Default Values
export const DEFAULTS = {
  PAGINATION_SIZE: 20,
  SESSION_TIMEOUT_MINUTES: 60,
  AUTO_SAVE_INTERVAL_SECONDS: 30,
  TOAST_DURATION_SECONDS: 5,
} as const;

export default {
  COLORS,
  COMPLIANCE_ORGANIZATIONS,
  TREATMENT_CATEGORIES,
  COURSE_LEVELS,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  CONSENT_FORM_TYPES,
  CONTENT_TYPES,
  ASSESSMENT_TYPES,
  USER_ROLES,
  AGE_VERIFICATION,
  CPD_REQUIREMENTS,
  LICENSING_TIERS,
  FILE_UPLOAD,
  NAVIGATION,
  TIME_SLOTS,
  DEFAULT_DURATIONS,
  NOTIFICATION_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  API_ENDPOINTS,
  DATE_FORMATS,
  BREAKPOINTS,
  FEATURES,
  DEFAULTS,
};
