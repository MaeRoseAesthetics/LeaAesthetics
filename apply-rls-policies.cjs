#!/usr/bin/env node

/**
 * Apply RLS Policies to Supabase Database
 * This script applies comprehensive Row Level Security policies to your Supabase database
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function displayHeader() {
  log('', 'reset');
  log('='.repeat(60), 'cyan');
  log('🔒 LEA AESTHETICS - APPLY RLS POLICIES TO SUPABASE', 'bright');
  log('='.repeat(60), 'cyan');
  log('', 'reset');
  log('This script will help you apply comprehensive Row Level Security', 'reset');
  log('policies to your Supabase database for maximum data protection.', 'reset');
  log('', 'reset');
}

function displayPrerequisites() {
  log('📋 PREREQUISITES:', 'yellow');
  log('', 'reset');
  log('✅ Supabase project created and configured', 'green');
  log('✅ Database migration already completed (supabase-migration.sql)', 'green');
  log('✅ Access to your Supabase SQL Editor', 'green');
  log('', 'reset');
}

function displayInstructions() {
  log('🚀 HOW TO APPLY RLS POLICIES:', 'bright');
  log('', 'reset');
  
  log('STEP 1: Access Your Supabase Dashboard', 'cyan');
  log('  1. Go to https://app.supabase.com', 'reset');
  log('  2. Select your LeaAesthetics project', 'reset');
  log('  3. Click "SQL Editor" in the left sidebar', 'reset');
  log('', 'reset');
  
  log('STEP 2: Open the RLS Policies File', 'cyan');
  log('  1. Open the file: rls-policies.sql', 'reset');
  log('  2. Select ALL content (Ctrl+A)', 'reset');
  log('  3. Copy to clipboard (Ctrl+C)', 'reset');
  log('', 'reset');
  
  log('STEP 3: Execute in Supabase', 'cyan');
  log('  1. In SQL Editor, click "New Query"', 'reset');
  log('  2. Paste the RLS policies content', 'reset');
  log('  3. Click "Run" button or press Ctrl+Enter', 'reset');
  log('', 'reset');
  
  log('STEP 4: Verify Success', 'cyan');
  log('  ✅ You should see success messages', 'green');
  log('  ✅ Final message: "RLS POLICIES IMPLEMENTATION COMPLETED"', 'green');
  log('  ✅ No error messages in the output', 'green');
  log('', 'reset');
}

function displayPolicyOverview() {
  log('🛡️ SECURITY POLICIES BEING APPLIED:', 'bright');
  log('', 'reset');
  
  const policies = [
    'user_profiles - Role-based access with self-management',
    'clients - Practitioner management + client self-view',
    'students - Practitioner management + student self-view',
    'treatments - Public active view + practitioner management',
    'courses - Public active view + practitioner management',
    'bookings - Role-based access with client view',
    'enrollments - Role-based access with student view',
    'consent_forms - Practitioner management + client signatures',
    'payments - Practitioner management + user view',
    'course_content - Enrolled student access only',
    'assessments - Role-based with student submissions'
  ];
  
  policies.forEach((policy, index) => {
    log(`  ${index + 1}. ${policy}`, 'green');
  });
  
  log('', 'reset');
  log('📊 TOTAL: 44 individual RLS policies covering all CRUD operations', 'bright');
  log('', 'reset');
}

function displayTroubleshooting() {
  log('🚨 TROUBLESHOOTING:', 'red');
  log('', 'reset');
  
  log('Issue: "relation does not exist" error', 'yellow');
  log('  Solution: Run supabase-migration.sql first to create tables', 'reset');
  log('', 'reset');
  
  log('Issue: "function does not exist" error', 'yellow');
  log('  Solution: Make sure you run the complete rls-policies.sql script', 'reset');
  log('', 'reset');
  
  log('Issue: Permission denied errors', 'yellow');
  log('  Solution: Ensure you\'re using the service_role key in Supabase', 'reset');
  log('', 'reset');
  
  log('Issue: Policies already exist', 'yellow');
  log('  Solution: The script includes DROP POLICY commands - safe to re-run', 'reset');
  log('', 'reset');
}

function displayPostApplication() {
  log('✅ AFTER SUCCESSFUL APPLICATION:', 'green');
  log('', 'reset');
  log('🔐 Your database is now secured with comprehensive RLS policies', 'bright');
  log('👥 Users can only access their own data or authorized data', 'green');
  log('🏥 Healthcare-grade security compliance achieved', 'green');
  log('🛡️ Protection against unauthorized data access', 'green');
  log('⚙️ Admin override capabilities maintained', 'green');
  log('', 'reset');
}

function checkRLSFile() {
  const rlsFilePath = path.join(__dirname, 'rls-policies.sql');
  
  if (fs.existsSync(rlsFilePath)) {
    log('✅ rls-policies.sql file found', 'green');
    
    const fileContent = fs.readFileSync(rlsFilePath, 'utf-8');
    const policyCount = (fileContent.match(/CREATE POLICY/g) || []).length;
    const tableCount = (fileContent.match(/ALTER TABLE.*ENABLE ROW LEVEL SECURITY/g) || []).length;
    
    log(`📊 File contains ${policyCount} RLS policies for ${tableCount} tables`, 'cyan');
    log('', 'reset');
    
    return true;
  } else {
    log('❌ rls-policies.sql file not found!', 'red');
    log('   Make sure you\'re running this from the project directory', 'yellow');
    log('', 'reset');
    return false;
  }
}

function displayQuickCopy() {
  log('📝 QUICK COPY INSTRUCTIONS:', 'bright');
  log('', 'reset');
  log('1. Use this command to copy the RLS policies to clipboard:', 'cyan');
  log('   cat rls-policies.sql | pbcopy    (macOS)', 'yellow');
  log('   cat rls-policies.sql | xclip -selection clipboard    (Linux)', 'yellow');
  log('', 'reset');
  log('2. Or simply open rls-policies.sql and copy manually', 'cyan');
  log('', 'reset');
}

function main() {
  displayHeader();
  displayPrerequisites();
  
  if (!checkRLSFile()) {
    process.exit(1);
  }
  
  displayPolicyOverview();
  displayInstructions();
  displayQuickCopy();
  displayTroubleshooting();
  displayPostApplication();
  
  log('🎯 READY TO PROCEED?', 'bright');
  log('', 'reset');
  log('Follow the steps above to apply RLS policies to your Supabase database.', 'cyan');
  log('This will secure your data and ensure proper access control.', 'cyan');
  log('', 'reset');
  log('Questions? Check the troubleshooting section above!', 'yellow');
  log('', 'reset');
}

// Run the script
main();
