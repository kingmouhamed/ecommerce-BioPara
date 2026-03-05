import { NextResponse, NextRequest } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

export default clerkMiddleware(async (auth, req) => {
  const authResult = await auth()
  const userId = authResult.userId
  const pathname = req.nextUrl.pathname
  
  // Protected routes that require authentication
  const protectedRoutes = ['/profile', '/orders', '/checkout', '/settings', '/wishlist']
  const adminRoutes = ['/admin']
  
  // Check if user is trying to access protected routes without authentication
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !userId) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', pathname)
    return NextResponse.redirect(signInUrl)
  }
  
  // Check if non-admin user is trying to access admin routes
  if (adminRoutes.some(route => pathname.startsWith(route)) && userId) {
    // You might want to check user role here
    // For now, redirect to home
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  // Handle trailing slashes
  if (pathname !== '/' && pathname.endsWith('/')) {
    const withoutTrailingSlash = pathname.slice(0, -1)
    return NextResponse.redirect(new URL(withoutTrailingSlash, req.url))
  }
  
  // Handle case-insensitive slugs for products and categories
  if (pathname.startsWith('/products/') || pathname.startsWith('/categories/')) {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length > 1) {
      const slug = segments[1]
      // Convert to lowercase for case-insensitive matching
      const normalizedSlug = slug.toLowerCase()
      
      if (slug !== normalizedSlug) {
        // Redirect to lowercase version
        const newPath = `${segments[0]}/${normalizedSlug}`
        return NextResponse.redirect(new URL(newPath, req.url))
      }
    }
  }
  
  // Continue with the request
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
