import { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ProfileContent } from "@/components/profile/profile-content";

export const metadata: Metadata = {
  title: "Профиль - The Throw Guide",
  description: "Управление профилем в The Throw Guide",
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="container py-12">
        <ProfileContent />
      </div>
    </ProtectedRoute>
  );
}