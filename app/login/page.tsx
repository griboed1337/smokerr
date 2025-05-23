import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вход - The Throw Guide",
  description: "Войдите в свой аккаунт The Throw Guide",
};

export default function LoginPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <LoginForm />
    </div>
  );
}