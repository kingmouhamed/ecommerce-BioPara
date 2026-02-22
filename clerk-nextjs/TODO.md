# Fix Plan: React Hydration Errors (#418 & #423)

## Issues Identified:
1 ❌ Products page has syntax errors in hardcoded product data  
2 ❌ Multiple pages/components call Supabase directly without proper loading states  
3 ❌ Some components may render differently based on auth state  

## Fixes Needed:
- [ ] Fix syntax errors in products/page.tsx 
- [ ] Add Suspense boundaries where needed  
- [ ] Ensure all async operations have proper loading states  
- [ ] Verify all 'use client' directives are properly placed  

## Files to Check/Edit:
1 clerk-nextjs/app/products/page.tsx - Syntax errors + supabase calls need guards
