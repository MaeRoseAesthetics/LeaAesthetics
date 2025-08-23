#!/bin/bash

# Lea Aesthetics - Production Deployment Script
# This script automates the entire production deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if we're in the right directory
    if [[ ! -f "package.json" ]] || [[ ! -d "api" ]] || [[ ! -f "vercel.json" ]]; then
        error "Please run this script from the LeaAesthetics project root directory"
    fi
    
    # Check for required files
    if [[ ! -f "supabase-migration.sql" ]]; then
        error "supabase-migration.sql not found. Make sure you have the database migration script."
    fi
    
    if [[ ! -f "seed-database.sql" ]]; then
        error "seed-database.sql not found. Make sure you have the database seeding script."
    fi
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        error "Vercel CLI is not installed. Install it with: npm install -g vercel"
    fi
    
    success "Prerequisites check passed"
}

# Build and test locally
build_and_test() {
    log "Building and testing the application..."
    
    # Install dependencies
    log "Installing dependencies..."
    npm install
    
    # Run build
    log "Building application..."
    npm run build
    
    # Check if build was successful
    if [[ ! -f "dist/public/index.html" ]]; then
        error "Build failed - index.html not found in dist/public/"
    fi
    
    success "Build completed successfully"
}

# Deploy to Vercel
deploy_to_vercel() {
    log "Deploying to Vercel..."
    
    # Deploy to production
    vercel --prod --yes
    
    if [[ $? -eq 0 ]]; then
        success "Deployment to Vercel completed"
    else
        error "Vercel deployment failed"
    fi
}

# Get deployment URL
get_deployment_url() {
    log "Getting deployment URL..."
    
    # Get the deployment URL from Vercel
    DEPLOYMENT_URL=$(vercel ls --prod 2>/dev/null | grep -E 'https://.*\.vercel\.app' | head -1 | awk '{print $2}' || echo "")
    
    if [[ -z "$DEPLOYMENT_URL" ]]; then
        warning "Could not automatically detect deployment URL"
        echo "Please check your Vercel dashboard for the deployment URL"
        echo "Then manually run: node verify-deployment.js <your-url>"
        return 1
    fi
    
    echo "Deployment URL: $DEPLOYMENT_URL"
    return 0
}

# Verify deployment
verify_deployment() {
    if [[ -n "$DEPLOYMENT_URL" ]]; then
        log "Verifying deployment..."
        
        # Wait a moment for deployment to be ready
        sleep 10
        
        # Run verification script
        if [[ -f "verify-deployment.js" ]]; then
            node verify-deployment.js "$DEPLOYMENT_URL"
        else
            warning "Verification script not found, skipping automated verification"
        fi
    fi
}

# Display post-deployment instructions
show_post_deployment() {
    echo ""
    echo "🎉 Deployment Complete!"
    echo "=================================================================================="
    echo ""
    echo "📋 NEXT STEPS:"
    echo ""
    echo "1. 🗄️  DATABASE SETUP (CRITICAL):"
    echo "   - Go to your Supabase Dashboard → SQL Editor"
    echo "   - Run the migration script: supabase-migration.sql"
    echo "   - Run the seeding script: seed-database.sql"
    echo ""
    echo "2. ⚙️  ENVIRONMENT VARIABLES:"
    echo "   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables"
    echo "   - Add the following variables:"
    echo "     * NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo "     * NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
    echo "     * DATABASE_URL=postgresql://postgres:password@host:port/postgres"
    echo "     * NODE_ENV=production"
    echo ""
    echo "3. 🔄 REDEPLOY after setting environment variables:"
    echo "   vercel --prod"
    echo ""
    if [[ -n "$DEPLOYMENT_URL" ]]; then
        echo "4. 👤 CREATE ADMIN USER:"
        echo "   - Visit: $DEPLOYMENT_URL/admin-setup"
        echo "   - Complete the admin setup form"
        echo ""
        echo "5. 🧪 TEST YOUR PLATFORM:"
        echo "   - Admin dashboard: $DEPLOYMENT_URL/dashboard"
        echo "   - Client portal: $DEPLOYMENT_URL/client-portal"
        echo "   - Student portal: $DEPLOYMENT_URL/student-portal"
        echo ""
    fi
    echo "📚 Documentation:"
    echo "   - Read PRODUCTION_CHECKLIST.md for detailed instructions"
    echo "   - Use verify-deployment.js to test your deployment"
    echo ""
    echo "🔒 Security Reminder:"
    echo "   - Only use /admin-setup once to create the first admin"
    echo "   - Review RLS policies before handling real client data"
    echo ""
    echo "=================================================================================="
}

# Main execution
main() {
    echo "🚀 Lea Aesthetics - Production Deployment"
    echo "=========================================="
    echo ""
    
    check_prerequisites
    build_and_test
    deploy_to_vercel
    
    # Try to get deployment URL and verify
    if get_deployment_url; then
        verify_deployment
    fi
    
    show_post_deployment
}

# Run main function
main "$@"
