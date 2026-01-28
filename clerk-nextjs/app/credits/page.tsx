"use client";

import { useUser } from '@clerk/nextjs';

export default function Credits() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">My Credits</h1>
        <p>Please <a href="/sign-in" className="text-green-700 hover:underline">sign in</a> to view your credits.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Credits</h1>
      <div className="max-w-2xl">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Available Credits</h2>
          <div className="text-3xl font-bold text-green-700 mb-4">150.00 MAD</div>
          <p className="text-gray-600 mb-4">
            You can use your credits on future purchases. Credits never expire.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total earned:</span>
              <span>200.00 MAD</span>
            </div>
            <div className="flex justify-between">
              <span>Used:</span>
              <span>50.00 MAD</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Available:</span>
              <span>150.00 MAD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
