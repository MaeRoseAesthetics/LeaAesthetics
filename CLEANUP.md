# Files to Remove After Migration

These files are no longer needed after migrating to Vercel + Supabase:

## Replit-specific files:
- `.replit` - Replit configuration
- `replit.md` - Replit documentation  

## Server files (replaced by Vercel API functions):
- `server/index.ts` - Express server entry point
- `server/routes.ts` - Express routes (now API functions)
- `server/replitAuth.ts` - Replit authentication (replaced by Supabase Auth)
- `server/vite.ts` - Vite development server config (handled by Vercel)
- `server/db.ts` - Database connection (replaced by lib/supabase.ts)
- `server/storage.ts` - Storage utilities (replaced by lib/storage.ts)

## Commands to clean up:
```bash
# Remove Replit files
rm .replit replit.md

# Remove old server directory
rm -rf server/

# Remove any other Replit-specific files
rm -rf .config/ # if it exists
```

## Keep these files:
- `client/` - Frontend React app
- `shared/` - Shared types and schemas
- `api/` - New Vercel API functions
- `lib/` - Updated utilities
- All configuration files (vite.config.ts, tailwind.config.ts, etc.)
- Package files (package.json, package-lock.json)
- Migration files (supabase-migration.sql, MIGRATION_GUIDE.md)
