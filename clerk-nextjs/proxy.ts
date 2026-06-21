import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/login',
  '/products(.*)',
  '/categories(.*)',
  '/about',
  '/contact',
  '/faq',
  '/blog(.*)',
  '/terms',
  '/privacy',
  '/shipping',
  '/returns',
  '/delivery',
  '/guarantee',
  '/help',
  '/promotions',
  '/weekly-offer',
  '/join-us',
  '/consultation',
  '/api/products(.*)',
  '/api/categories(.*)',
  '/api/search(.*)',
  '/api/reviews(.*)',
  '/api/shipping(.*)',
  '/api/payments/webhook',
  '/api/newsletter(.*)',
  '/api/contact(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (isAdminRoute(request)) {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    const role = (sessionClaims?.metadata as any)?.role;
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
