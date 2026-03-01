'use client';

import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-12">
            <UserProfile path="/profile" routing="path" />
        </div>
    );
}
