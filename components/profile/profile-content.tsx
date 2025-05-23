"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProfileContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Назад
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Профиль пользователя</CardTitle>
          <CardDescription>Управление вашим аккаунтом</CardDescription>
        </CardHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Информация</TabsTrigger>
            <TabsTrigger value="security">Безопасность</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Email</h3>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">ID пользователя</h3>
                  <p className="text-xs text-muted-foreground">{user?.uid}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={handleLogout}>
                Выйти
              </Button>
            </CardFooter>
          </TabsContent>

          <TabsContent value="security">
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Смена пароля</h3>
                <ChangePasswordForm />
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}