"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { GrenadeForm } from "@/components/grenade-form"
import { TestUpload } from "@/components/test-upload"

export default function AddGrenadePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="text-base font-light tracking-wider uppercase">smokerr</div>
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Назад к картам
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Добавить новую раскидку</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Заполните форму ниже, чтобы добавить новую раскидку гранаты
          </p>
        </div>

        <div className="space-y-8">
          <TestUpload />
          <GrenadeForm />
        </div>
      </div>
    </main>
  )
}
