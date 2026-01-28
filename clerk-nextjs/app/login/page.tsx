"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Clerk's sign-in page
    router.push('/sign-in');
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <p className="mb-4">Redirecting to sign-in page...</p>
      <p>
        Or <Link href="/sign-in" className="text-green-700 hover:underline">click here</Link> if not redirected.
      </p>
    </div>
  );
}
