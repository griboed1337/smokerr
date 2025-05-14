"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full w-16 h-8 relative bg-gray-700 border-0"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-4 w-4 absolute left-2 text-yellow-300" />
      <Moon className="h-4 w-4 absolute right-2 text-gray-300" />
      <div
        className={`absolute w-6 h-6 rounded-full bg-gray-200 transition-all duration-300 ${
          theme === "dark" ? "translate-x-[calc(100%-4px)]" : "translate-x-[-4px]"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
