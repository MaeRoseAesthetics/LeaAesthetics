-- Comprehensive Row Level Security (RLS) Policies for Lea Aesthetics
-- This file contains complete RLS policies for all tables in the database
-- Run this after the main migration to implement comprehensive security

-- First, ensure RLS is enabled on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to allow re-running this script)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Practitioners can view clients" ON public.clients;
DROP POLICY IF EXISTS "Practitioners can manage clients" ON public.clients;
DROP POLICY IF EXISTS "Practitioners can view students" ON public.students;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.user_profiles 
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin or practitioner
CREATE OR REPLACE FUNCTION is_admin_or_practitioner(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(user_id) IN ('admin', 'practitioner');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- USER_PROFILES TABLE POLICIES
-- ==========================================

-- Users can view their own profile, admins can view all profiles
CREATE POLICY "user_profiles_select" ON public.user_profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    is_admin_or_practitioner(auth.uid())
  );

-- Users can insert their own profile, admins can insert any profile
CREATE POLICY "user_profiles_insert" ON public.user_profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id OR 
    is_admin_or_practitioner(auth.uid())
  );

-- Users can update their own profile, admins can update any profile
CREATE POLICY "user_profiles_update" ON public.user_profiles
  FOR UPDATE USING (
    auth.uid() = id OR 
    is_admin_or_practitioner(auth.uid())
  );

-- Only admins can delete profiles
CREATE POLICY "user_profiles_delete" ON public.user_profiles
  FOR DELETE USING (
    get_user_role(auth.uid()) = 'admin'
  );

-- ==========================================
-- CLIENTS TABLE POLICIES
-- ==========================================

-- Practitioners and admins can view all clients, clients can view their own record
CREATE POLICY "clients_select" ON public.clients
  FOR SELECT USING (
    is_admin_or_practitioner(auth.uid()) OR
    user_id = auth.uid()
  );

-- Practitioners and admins can create clients
CREATE POLICY "clients_insert" ON public.clients
  FOR INSERT WITH CHECK (
    is_admin_or_practitioner(auth.uid())
  );

-- Practitioners and admins can update clients, clients can update their own record
CREATE POLICY "clients_update" ON public.clients
  FOR UPDATE USING (
    is_admin_or_practitioner(auth.uid()) OR
    user_id = auth.uid()
  );

-- Only admins can delete clients
CREATE POLICY "clients_delete" ON public.clients
  FOR DELETE USING (
    get_user_role(auth.uid()) = 'admin'
  );

-- ==========================================
-- STUDENTS TABLE POLICIES
-- ==========================================

-- Practitioners and admins can view all students, students can view their own record
CREATE POLICY "students_select" ON public.students
  FOR SELECT USING (
    is_admin_or_practitioner(auth.uid()) OR
    user_id = auth.uid()
  );

-- Practitioners and admins can create students
CREATE POLICY "students_insert" ON public.students
  FOR INSERT WITH CHECK (
    is_admin_or_practitioner(auth.uid())
  );

-- Practitioners and admins can update students, students can update their own record
CREATE POLICY "students_update" ON public.students
  FOR UPDATE USING (
    is_admin_or_practitioner(auth.uid()) OR
    user_id = auth.uid()
  );

-- Only admins can delete students
CREATE POLICY "students_delete" ON public.students
  FOR DELETE USING (
    get_user_role(auth.uid()) = 'admin'
  );

-- ==========================================
-- TREATMENTS TABLE POLICIES
-- ==========================================

-- Everyone can view active treatments, practitioners and admins can view all
CREATE POLICY "treatments_select" ON public.treatments
  FOR SELECT USING (
    active = true OR 
    is_admin_or_practitioner(auth.uid())
  );

-- Only practitioners and admins can manage treatments
CREATE POLICY "treatments_insert" ON public.treatments
  FOR INSERT WITH CHECK (
    is_admin_or_practitioner(auth.uid())
  );

CREATE POLICY "treatments_update" ON public.treatments
  FOR UPDATE USING (
    is_admin_or_practitioner(auth.uid())
  );

CREATE POLICY "treatments_delete" ON public.treatments
  FOR DELETE USING (
    get_user_role(auth.uid()) = 'admin'
  );

-- ==========================================
-- COURSES TABLE POLICIES
-- ==========================================

-- Everyone can view active courses, practitioners and admins can view all
CREATE POLICY "courses_select" ON public.courses
  FOR SELECT USING (
    active = true OR 
    is_admin_or_practitioner(auth.uid())
  );

-- Only practitioners and admins can manage courses
CREATE POLICY "courses_insert" ON public.courses
  FOR INSERT WITH CHECK (
    is_admin_or_practitioner(auth.uid())
  );

CREATE POLICY "courses_update" ON public.courses
  FOR UPDATE USING (
    is_admin_or_practitioner(auth.uid())
  );

CREATE POLICY "courses_delete" ON public.courses
  FOR DELETE USING (
    get_user_role(auth.uid()) = 'admin'
  );

-- ==========================================
-- BOOKINGS TABLE POLICIES
-- ==========================================

-- Practitioners and admins can view all bookings, clients can view their own bookings
CREATE POLICY "bookings_select" ON public.bookings
  FOR SELECT USING (
    is_admin_or_practitioner(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = bookings.client_id 
      AND clients.user_id = auth.uid()
    )
  );

-- Only practitioners and admins can create bookings
CREATE POLICY "bookings_insert" ON public.bookings
  FOR INSERT WITH CHECK (
    is_admin_or_practitioner(auth.uid())
  );

-- Practitioners and admins can update bookings, clients can update their own bookings
CREATE POLICY "bookings_update" ON public.bookings
  FOR UPDATE USING (
    is_admin_or_practitioner(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = bookings.client_id 
      AND clients.user_id = auth.uid()
    )
  );

-- Only admins can delete bookings
CREATE POLICY "bookings_delete" ON public.bookings
  FOR DELETE USING (
    get_user_role(auth.uid()) = 'admin'
  );

-- ==========================================
-- ENROLLMENTS TABLE POLICIES
-- ==========================================

-- Practitioners and admins can view all enrollments, students can view their own enrollments
CREATE POLICY "enrollments_select" ON public.enrollments
  FOR SELECT USING (
    is_admin_or_practitioner(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.students 
      WHERE students.id = enrollments.student_id 
      AND students.user_id = auth.uid()
    )
  );

-- Only practitioners and admins can create enrollments
CREATE POLICY "enrollments_insert" ON public.enrollments
  FOR INSERT WITH CHECK (
    is_admin_or_practitioner(auth.uid())
  );

-- Practitioners and admins can update enrollments, students can update their own progress
CREATE POLICY "enrollments_update" ON public.enrollments
  FOR UPDATE USING (
    is_admin_or_practitioner(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.students 
      WHERE students.id = enrollments.student_id 
      AND students.user_id = auth.uid()
    )
  );

-- Only admins can delete enrollments
CREATE POLICY "enrollments_delete" ON public.enrollments
  FOR DELETE USING (
    get_user_role(auth.uid()) = 'admin'
  );

-- ==========================================
-- CONSENT_FORMS TABLE POLICIES
-- ==========================================

-- Practitioners and admins can view all consent forms, clients can view their own
CREATE POLICY "consent_forms_select" ON public.consent_forms
  FOR SELECT USING (
    is_admin_or_practitioner(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = consent_forms.client_id 
      AND clients.user_id = auth.uid()
    )
  );

-- Only practitioners and admins can create consent forms
CREATE POLICY "consent_forms_insert" ON public.consent_forms
  FOR INSERT WITH CHECK (
    is_admin_or_practitioner(auth.uid())
  );

-- Practitioners and admins can update consent forms, clients can sign their own forms
CREATE POLICY "consent_forms_update" ON public.consent_forms
  FOR UPDATE USING (
    is_admin_or_practitioner(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = consent_forms.client_id 
      AND clients.user_id = auth.uid()
    )
  );

-- Only admins can delete consent forms
CREATE POLICY "consent_forms_delete" ON public.consent_forms
  FOR DELETE USING (
    get_user_role(auth.uid()) = 'admin'
  );

-- ==========================================
-- PAYMENTS TABLE POLICIES
-- ==========================================

-- Practitioners and admins can view all payments, users can view their own payments
CREATE POLICY "payments_select" ON public.payments
  FOR SELECT USING (
    is_admin_or_practitioner(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = payments.client_id 
      AND clients.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.students 
      WHERE students.id = payments.student_id 
      AND students.user_id = auth.uid()
    )
  );

-- Only practitioners and admins can create payments
CREATE POLICY "payments_insert" ON public.payments
  FOR INSERT WITH CHECK (
    is_admin_or_practitioner(auth.uid())
  );

-- Only practitioners and admins can update payments
CREATE POLICY "payments_update" ON public.payments
  FOR UPDATE USING (
    is_admin_or_practitioner(auth.uid())
  );

-- Only admins can delete payments
CREATE POLICY "payments_delete" ON public.payments
  FOR DELETE USING (
    get_user_role(auth.uid()) = 'admin'
  );

-- ==========================================
-- COURSE_CONTENT TABLE POLICIES
-- ==========================================

-- Enrolled students can view content for their courses, practitioners and admins can view all
CREATE POLICY "course_content_select" ON public.course_content
  FOR SELECT USING (
    is_admin_or_practitioner(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.students s ON e.student_id = s.id
      WHERE e.course_id = course_content.course_id
      AND s.user_id = auth.uid()
      AND e.status = 'active'
    )
  );

-- Only practitioners and admins can manage course content
CREATE POLICY "course_content_insert" ON public.course_content
  FOR INSERT WITH CHECK (
    is_admin_or_practitioner(auth.uid())
  );

CREATE POLICY "course_content_update" ON public.course_content
  FOR UPDATE USING (
    is_admin_or_practitioner(auth.uid())
  );

CREATE POLICY "course_content_delete" ON public.course_content
  FOR DELETE USING (
    get_user_role(auth.uid()) = 'admin'
  );

-- ==========================================
-- ASSESSMENTS TABLE POLICIES
-- ==========================================

-- Students can view their own assessments, practitioners and admins can view all
CREATE POLICY "assessments_select" ON public.assessments
  FOR SELECT USING (
    is_admin_or_practitioner(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.students 
      WHERE students.id = assessments.student_id 
      AND students.user_id = auth.uid()
    )
  );

-- Only practitioners and admins can create assessments
CREATE POLICY "assessments_insert" ON public.assessments
  FOR INSERT WITH CHECK (
    is_admin_or_practitioner(auth.uid())
  );

-- Practitioners and admins can update assessments, students can submit their own assessments
CREATE POLICY "assessments_update" ON public.assessments
  FOR UPDATE USING (
    is_admin_or_practitioner(auth.uid()) OR
    (
      EXISTS (
        SELECT 1 FROM public.students 
        WHERE students.id = assessments.student_id 
        AND students.user_id = auth.uid()
      ) 
      AND assessments.completed_date IS NULL -- Students can only update incomplete assessments
    )
  );

-- Only admins can delete assessments
CREATE POLICY "assessments_delete" ON public.assessments
  FOR DELETE USING (
    get_user_role(auth.uid()) = 'admin'
  );

-- ==========================================
-- SERVICE ROLE PERMISSIONS
-- ==========================================

-- Grant full access to service role for admin operations and bypassing RLS when needed
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- ==========================================
-- AUTHENTICATED ROLE PERMISSIONS
-- ==========================================

-- Grant appropriate permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin_or_practitioner(UUID) TO authenticated;

-- ==========================================
-- COMPLETION MESSAGE
-- ==========================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RLS POLICIES IMPLEMENTATION COMPLETED';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Row Level Security has been enabled and configured for all tables:';
    RAISE NOTICE '• user_profiles - Role-based access with self-management';
    RAISE NOTICE '• clients - Practitioner management with client self-view';
    RAISE NOTICE '• students - Practitioner management with student self-view';
    RAISE NOTICE '• treatments - Public active view, practitioner management';
    RAISE NOTICE '• courses - Public active view, practitioner management';
    RAISE NOTICE '• bookings - Role-based access with client view';
    RAISE NOTICE '• enrollments - Role-based access with student view';
    RAISE NOTICE '• consent_forms - Practitioner management with client signatures';
    RAISE NOTICE '• payments - Practitioner management with user view';
    RAISE NOTICE '• course_content - Enrolled student access';
    RAISE NOTICE '• assessments - Role-based with student submissions';
    RAISE NOTICE '';
    RAISE NOTICE 'Helper functions created:';
    RAISE NOTICE '• get_user_role(user_id) - Returns user role';
    RAISE NOTICE '• is_admin_or_practitioner(user_id) - Checks admin/practitioner status';
    RAISE NOTICE '';
    RAISE NOTICE 'Security Features:';
    RAISE NOTICE '• Comprehensive role-based access control';
    RAISE NOTICE '• Self-management capabilities for users';
    RAISE NOTICE '• Proper isolation between different user types';
    RAISE NOTICE '• Admin override capabilities where appropriate';
    RAISE NOTICE '• Service role bypass for system operations';
    RAISE NOTICE '========================================';
END $$;
