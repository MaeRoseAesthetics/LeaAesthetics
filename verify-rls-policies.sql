-- Verification Script for RLS Policies
-- Run this in Supabase SQL Editor to verify RLS policies are working correctly

-- Display header
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RLS POLICIES VERIFICATION SCRIPT';
    RAISE NOTICE '========================================';
END $$;

-- 1. Check if RLS is enabled on all tables
DO $$
DECLARE
    table_rec RECORD;
    rls_count INTEGER := 0;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '1. CHECKING RLS STATUS ON TABLES:';
    RAISE NOTICE '================================';
    
    FOR table_rec IN 
        SELECT schemaname, tablename, rowsecurity 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'user_profiles', 'clients', 'students', 'treatments', 'courses',
            'bookings', 'enrollments', 'consent_forms', 'payments', 
            'course_content', 'assessments'
        )
        ORDER BY tablename
    LOOP
        IF table_rec.rowsecurity THEN
            RAISE NOTICE '✅ % - RLS ENABLED', table_rec.tablename;
            rls_count := rls_count + 1;
        ELSE
            RAISE NOTICE '❌ % - RLS DISABLED', table_rec.tablename;
        END IF;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE 'RLS Summary: %/11 tables have RLS enabled', rls_count;
END $$;

-- 2. Check helper functions exist
DO $$
DECLARE
    func_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '2. CHECKING HELPER FUNCTIONS:';
    RAISE NOTICE '============================';
    
    -- Check get_user_role function
    SELECT COUNT(*) INTO func_count 
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'get_user_role';
    
    IF func_count > 0 THEN
        RAISE NOTICE '✅ get_user_role() function exists';
    ELSE
        RAISE NOTICE '❌ get_user_role() function missing';
    END IF;
    
    -- Check is_admin_or_practitioner function
    SELECT COUNT(*) INTO func_count 
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'is_admin_or_practitioner';
    
    IF func_count > 0 THEN
        RAISE NOTICE '✅ is_admin_or_practitioner() function exists';
    ELSE
        RAISE NOTICE '❌ is_admin_or_practitioner() function missing';
    END IF;
END $$;

-- 3. Count RLS policies
DO $$
DECLARE
    policy_count INTEGER;
    table_rec RECORD;
    table_policy_count INTEGER;
    total_policies INTEGER := 0;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '3. CHECKING RLS POLICIES COUNT:';
    RAISE NOTICE '==============================';
    
    FOR table_rec IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'user_profiles', 'clients', 'students', 'treatments', 'courses',
            'bookings', 'enrollments', 'consent_forms', 'payments', 
            'course_content', 'assessments'
        )
        ORDER BY tablename
    LOOP
        SELECT COUNT(*) INTO table_policy_count
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = table_rec.tablename;
        
        total_policies := total_policies + table_policy_count;
        
        RAISE NOTICE '📋 % - % policies', table_rec.tablename, table_policy_count;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Total Policies: % (Expected: 44)', total_policies;
    
    IF total_policies = 44 THEN
        RAISE NOTICE '✅ All expected policies are in place!';
    ELSE
        RAISE NOTICE '⚠️  Policy count mismatch - expected 44, found %', total_policies;
    END IF;
END $$;

-- 4. Test policy types coverage
DO $$
DECLARE
    select_policies INTEGER;
    insert_policies INTEGER;
    update_policies INTEGER;
    delete_policies INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '4. CHECKING POLICY TYPES COVERAGE:';
    RAISE NOTICE '=================================';
    
    -- Count policies by command type
    SELECT COUNT(*) INTO select_policies FROM pg_policies WHERE cmd = 'SELECT';
    SELECT COUNT(*) INTO insert_policies FROM pg_policies WHERE cmd = 'INSERT';
    SELECT COUNT(*) INTO update_policies FROM pg_policies WHERE cmd = 'UPDATE';
    SELECT COUNT(*) INTO delete_policies FROM pg_policies WHERE cmd = 'DELETE';
    
    RAISE NOTICE '📖 SELECT policies: % (Expected: 11)', select_policies;
    RAISE NOTICE '➕ INSERT policies: % (Expected: 11)', insert_policies;
    RAISE NOTICE '✏️  UPDATE policies: % (Expected: 11)', update_policies;
    RAISE NOTICE '🗑️  DELETE policies: % (Expected: 11)', delete_policies;
    
    IF select_policies >= 11 AND insert_policies >= 11 AND update_policies >= 11 AND delete_policies >= 11 THEN
        RAISE NOTICE '✅ All CRUD operations are covered!';
    ELSE
        RAISE NOTICE '⚠️  Some CRUD operations may be missing policies';
    END IF;
END $$;

-- 5. Check specific critical policies
DO $$
DECLARE
    policy_exists BOOLEAN;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '5. CHECKING CRITICAL POLICIES:';
    RAISE NOTICE '=============================';
    
    -- Check user_profiles policies
    SELECT EXISTS(
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'user_profiles' 
        AND policyname = 'user_profiles_select'
    ) INTO policy_exists;
    
    IF policy_exists THEN
        RAISE NOTICE '✅ User profiles SELECT policy exists';
    ELSE
        RAISE NOTICE '❌ User profiles SELECT policy missing';
    END IF;
    
    -- Check clients policies
    SELECT EXISTS(
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'clients' 
        AND policyname = 'clients_select'
    ) INTO policy_exists;
    
    IF policy_exists THEN
        RAISE NOTICE '✅ Clients SELECT policy exists';
    ELSE
        RAISE NOTICE '❌ Clients SELECT policy missing';
    END IF;
    
    -- Check treatments policies
    SELECT EXISTS(
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'treatments' 
        AND policyname = 'treatments_select'
    ) INTO policy_exists;
    
    IF policy_exists THEN
        RAISE NOTICE '✅ Treatments SELECT policy exists';
    ELSE
        RAISE NOTICE '❌ Treatments SELECT policy missing';
    END IF;
END $$;

-- 6. Final verification summary
DO $$
DECLARE
    rls_enabled_count INTEGER;
    total_policies INTEGER;
    functions_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VERIFICATION SUMMARY';
    RAISE NOTICE '========================================';
    
    -- Count RLS enabled tables
    SELECT COUNT(*) INTO rls_enabled_count
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND rowsecurity = true
    AND tablename IN (
        'user_profiles', 'clients', 'students', 'treatments', 'courses',
        'bookings', 'enrollments', 'consent_forms', 'payments', 
        'course_content', 'assessments'
    );
    
    -- Count total policies
    SELECT COUNT(*) INTO total_policies
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename IN (
        'user_profiles', 'clients', 'students', 'treatments', 'courses',
        'bookings', 'enrollments', 'consent_forms', 'payments', 
        'course_content', 'assessments'
    );
    
    -- Count helper functions
    SELECT COUNT(*) INTO functions_count 
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' 
    AND p.proname IN ('get_user_role', 'is_admin_or_practitioner');
    
    RAISE NOTICE '📊 Tables with RLS enabled: %/11', rls_enabled_count;
    RAISE NOTICE '📊 Total RLS policies: % (Expected: 44)', total_policies;
    RAISE NOTICE '📊 Helper functions: %/2', functions_count;
    RAISE NOTICE '';
    
    IF rls_enabled_count = 11 AND total_policies = 44 AND functions_count = 2 THEN
        RAISE NOTICE '🎉 SUCCESS: RLS POLICIES FULLY IMPLEMENTED!';
        RAISE NOTICE '🔐 Your database is now comprehensively secured';
        RAISE NOTICE '✅ All tables, policies, and functions are in place';
    ELSE
        RAISE NOTICE '⚠️  WARNING: RLS IMPLEMENTATION INCOMPLETE';
        RAISE NOTICE '❗ Please review the results above and re-run rls-policies.sql';
    END IF;
    
    RAISE NOTICE '========================================';
END $$;
