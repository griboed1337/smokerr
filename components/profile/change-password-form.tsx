"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: "Текущий пароль должен содержать не менее 6 символов",
    }),
    newPassword: z.string().min(6, {
      message: "Новый пароль должен содержать не менее 6 символов",
    }),
    confirmPassword: z.string().min(6, {
      message: "Подтверждение пароля должно содержать не менее 6 символов",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    setIsLoading(true);
    try {
      await changePassword(values.currentPassword, values.newPassword);
      toast({
        title: "Пароль успешно изменен",
        description: "Ваш пароль был успешно обновлен",
      });
      form.reset();
    } catch (error) {
      console.error("Ошибка при смене пароля:", error);
      let errorMessage = "Произошла ошибка при смене пароля";
      
      if (error instanceof Error) {
        // Обработка конкретных ошибок Firebase
        if (error.message.includes("auth/wrong-password")) {
          errorMessage = "Неверный текущий пароль";
        } else if (error.message.includes("auth/weak-password")) {
          errorMessage = "Новый пароль слишком слабый";
        } else if (error.message.includes("auth/requires-recent-login")) {
          errorMessage = "Требуется повторная авторизация. Пожалуйста, выйдите и войдите снова";
        }
      }
      
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Текущий пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Введите текущий пароль" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Новый пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Введите новый пароль" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Подтвердите новый пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Подтвердите новый пароль" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Изменение пароля...
            </>
          ) : (
            "Изменить пароль"
          )}
        </Button>
      </form>
    </Form>
  );
}
