import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Регистрация - The Throw Guide",
  description: "Создайте новый аккаунт в The Throw Guide",
};

export default function RegisterPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <RegisterForm />
    </div>
  );
}