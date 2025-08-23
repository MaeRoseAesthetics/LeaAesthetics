-- Database Seeding Script for Lea Aesthetics
-- Run this after the main migration to populate with initial data

-- Insert sample treatments
INSERT INTO public.treatments (name, description, duration, price, requires_consent, age_restriction, active) VALUES
('Anti-Wrinkle Injections', 'Botulinum toxin treatment for dynamic wrinkles and fine lines', 30, 200.00, true, 18, true),
('Dermal Fillers - Lip Enhancement', 'Hyaluronic acid fillers for lip volume and definition', 45, 350.00, true, 18, true),
('Dermal Fillers - Cheek Enhancement', 'Hyaluronic acid fillers for cheek volume and contouring', 60, 450.00, true, 18, true),
('Chemical Peel - Superficial', 'Light chemical peel for skin texture improvement', 45, 120.00, true, 16, true),
('Microneedling', 'Collagen induction therapy for skin rejuvenation', 60, 180.00, true, 18, true),
('PRP Facial Treatment', 'Platelet-rich plasma therapy for skin regeneration', 75, 280.00, true, 18, true),
('Thread Lift - PDO', 'Non-surgical lifting treatment using PDO threads', 90, 650.00, true, 21, true),
('Skin Consultation', 'Comprehensive skin analysis and treatment planning', 30, 50.00, false, 16, true),
('Hydrafacial', 'Deep cleansing and hydrating facial treatment', 60, 150.00, false, 16, true),
('LED Light Therapy', 'Photodynamic therapy for various skin conditions', 30, 80.00, false, 16, true);

-- Insert sample courses
INSERT INTO public.courses (name, description, level, duration, price, max_students, ofqual_compliant, active) VALUES
('Foundation in Aesthetic Procedures', 'Comprehensive introduction to aesthetic medicine and basic procedures', 'Level 4', 3, 1200.00, 12, true, true),
('Advanced Anti-Wrinkle Injections', 'Advanced training in botulinum toxin treatments and complications management', 'Level 5', 2, 800.00, 8, true, true),
('Dermal Filler Masterclass', 'Expert-level training in hyaluronic acid filler techniques', 'Level 5', 3, 1500.00, 10, true, true),
('Chemical Peel Certification', 'Complete training in chemical peel procedures and aftercare', 'Level 4', 2, 650.00, 15, true, true),
('Microneedling & Skin Therapies', 'Training in microneedling and advanced skin treatment protocols', 'Level 4', 1, 400.00, 20, true, true),
('PRP & Regenerative Medicine', 'Advanced course in platelet-rich plasma and regenerative treatments', 'Level 6', 2, 900.00, 12, true, true),
('Thread Lift Techniques', 'Specialized training in PDO thread lift procedures', 'Level 6', 2, 1100.00, 6, true, true),
('Anatomy & Physiology for Aesthetics', 'Essential anatomical knowledge for aesthetic practitioners', 'Level 4', 2, 500.00, 25, true, true),
('Consultation & Client Care', 'Professional development in client consultation and care', 'Level 4', 1, 300.00, 30, true, true),
('Complication Management', 'Advanced training in recognizing and managing treatment complications', 'Level 7', 1, 750.00, 15, true, true);

-- Insert sample course content for the Foundation course
DO $$
DECLARE
    foundation_course_id UUID;
BEGIN
    -- Get the Foundation course ID
    SELECT id INTO foundation_course_id FROM public.courses WHERE name = 'Foundation in Aesthetic Procedures' LIMIT 1;
    
    IF foundation_course_id IS NOT NULL THEN
        INSERT INTO public.course_content (course_id, title, content, content_type, order_index) VALUES
        (foundation_course_id, 'Introduction to Aesthetic Medicine', 'Overview of aesthetic medicine, history, and current practice standards', 'text', 1),
        (foundation_course_id, 'Facial Anatomy & Physiology', 'Detailed study of facial anatomy relevant to aesthetic procedures', 'text', 2),
        (foundation_course_id, 'Client Consultation Principles', 'Best practices for client consultation, assessment, and treatment planning', 'text', 3),
        (foundation_course_id, 'Safety & Hygiene Protocols', 'Essential safety measures and hygiene protocols for aesthetic practice', 'text', 4),
        (foundation_course_id, 'Introduction to Injectables', 'Basic principles of injectable treatments and product knowledge', 'text', 5),
        (foundation_course_id, 'Practical Skills Assessment', 'Hands-on assessment of basic injection techniques', 'quiz', 6),
        (foundation_course_id, 'Regulatory Compliance', 'Understanding UK regulations and compliance requirements', 'text', 7),
        (foundation_course_id, 'Final Assessment', 'Comprehensive assessment covering all course modules', 'quiz', 8);
    END IF;
END $$;

-- Insert sample course content for Anti-Wrinkle course
DO $$
DECLARE
    antiwrinkle_course_id UUID;
BEGIN
    SELECT id INTO antiwrinkle_course_id FROM public.courses WHERE name = 'Advanced Anti-Wrinkle Injections' LIMIT 1;
    
    IF antiwrinkle_course_id IS NOT NULL THEN
        INSERT INTO public.course_content (course_id, title, content, content_type, order_index) VALUES
        (antiwrinkle_course_id, 'Botulinum Toxin Pharmacology', 'Advanced understanding of botulinum toxin mechanism and effects', 'text', 1),
        (antiwrinkle_course_id, 'Advanced Injection Techniques', 'Sophisticated injection techniques for optimal results', 'text', 2),
        (antiwrinkle_course_id, 'Complication Recognition', 'Identifying and managing complications from botulinum toxin treatments', 'text', 3),
        (antiwrinkle_course_id, 'Patient Selection Criteria', 'Advanced patient assessment and selection for optimal outcomes', 'text', 4),
        (antiwrinkle_course_id, 'Practical Workshop', 'Intensive hands-on practice with live models', 'text', 5),
        (antiwrinkle_course_id, 'Final Practical Assessment', 'Comprehensive practical examination', 'quiz', 6);
    END IF;
END $$;

-- Create a sample admin user profile (you'll need to create the auth user first through Supabase)
-- This is just a placeholder - replace with actual admin user ID from Supabase auth
-- INSERT INTO public.user_profiles (id, email, first_name, last_name, role) VALUES
-- ('00000000-0000-0000-0000-000000000000', 'admin@leaaesthetics.com', 'Admin', 'User', 'admin');

-- Grant permissions for the service role to bypass RLS for admin operations
-- This is needed for the admin setup to work properly
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE 'Database seeding completed successfully!';
    RAISE NOTICE 'Created % treatments', (SELECT COUNT(*) FROM public.treatments);
    RAISE NOTICE 'Created % courses', (SELECT COUNT(*) FROM public.courses);
    RAISE NOTICE 'Created % course content items', (SELECT COUNT(*) FROM public.course_content);
END $$;
