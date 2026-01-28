"use client";

import { useUser } from '@clerk/nextjs';

export default function Addresses() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">My Addresses</h1>
        <p>Please <a href="/sign-in" className="text-green-700 hover:underline">sign in</a> to manage your addresses.</p>
      </div>
    );
  }

  const addresses = [
    {
      id: 1,
      type: 'Home',
      name: 'John Doe',
      address: '123 Main Street, Casablanca',
      phone: '+212 6XX XXX XXX',
      isDefault: true
    },
    {
      id: 2,
      type: 'Work',
      name: 'John Doe',
      address: '456 Business Avenue, Rabat',
      phone: '+212 6XX XXX XXX',
      isDefault: false
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Addresses</h1>
      <div className="max-w-4xl">
        <div className="mb-6">
          <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
            Add New Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <p className="text-gray-600">No addresses saved.</p>
        ) : (
          <div className="grid gap-4">
            {addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{address.type}</h3>
                      {address.isDefault && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="font-medium">{address.name}</p>
                    <p className="text-gray-600">{address.address}</p>
                    <p className="text-gray-600">{address.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
