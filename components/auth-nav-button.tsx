"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export function AuthNavButton() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Button variant="ghost" size="sm" disabled>Загрузка...</Button>;
  }

  if (user) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href="/profile">
          <User className="h-4 w-4 mr-2" />
          Профиль
        </Link>
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" asChild>
      <Link href="/login">
        <User className="h-4 w-4 mr-2" />
        Войти
      </Link>
    </Button>
  );
}