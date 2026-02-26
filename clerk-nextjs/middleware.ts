import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
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
]);

const isAdminRoute = createRouteMatcher([
    '/admin(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
    // If the route matches the admin paths, check the role
    if (isAdminRoute(req)) {
        const authObject = await auth();
        // Protect the route: if user is not signed in or not an admin
        if (!authObject.userId) {
            return authObject.redirectToSignIn({ returnBackUrl: req.url });
        }

        // Role-based Access Control (Fallback to primary email if needed)
        // Here we check if `role` is defined in public metadata, otherwise restrict
        const role = (authObject.sessionClaims?.metadata as any)?.role;

        // In many setups, if role isn't defined, you might want a hardcoded admin email list for a workaround until clerk roles are configured
        // ex: const isAdmin = (authObject.sessionClaims?.email === "admin@myecommerce.com");
        // We enforce only role === "admin"
        if (role !== 'admin') {
            // Redirect to home or show a 403 Forbidden
            const unauthorizedUrl = new URL('/', req.url);
            return NextResponse.redirect(unauthorizedUrl);
        }
    }

    if (!isPublicRoute(req)) {
        await auth.protect();
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
