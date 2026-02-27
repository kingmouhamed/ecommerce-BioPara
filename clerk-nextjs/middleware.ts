import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from 'next/server';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/api/webhook(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/products(.*)',
    '/category(.*)',
    '/cart(.*)',
    '/about(.*)',
    '/contact(.*)',
    '/faq(.*)',
    '/delivery(.*)',
    '/terms(.*)',
    '/privacy(.*)',
    '/auth/login(.*)',
    '/auth/signup(.*)',
    '/auth/terms(.*)',
    '/promotions(.*)',
    '/wishlist(.*)',
    '/help(.*)',
    '/payment(.*)',
    '/returns(.*)',
    '/consultation(.*)',
    '/order-success(.*)',
    '/checkout(.*)',
  ],
  afterAuth(auth, req) {
    // Handle admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!auth.userId) {
        return redirectToSignIn({ returnBackUrl: req.url });
      }

      const role = (auth.sessionClaims?.metadata as any)?.role;
      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
