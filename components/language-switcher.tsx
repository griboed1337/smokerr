"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const switchLanguage = (locale: string) => {
    // In a real app, this would use next-intl or similar to switch languages
    // For now, we'll just simulate the language switch
    setOpen(false)
    // router.push(`/${locale}${pathname}`)
    console.log(`Switching to ${locale}`)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLanguage("ru")}>Русский</DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage("en")}>English</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
