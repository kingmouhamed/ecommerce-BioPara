import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-12">
            <UserProfile path="/settings" routing="path" />
        </div>
    );
}
