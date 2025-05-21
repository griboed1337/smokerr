"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Предотвращаем проблемы с гидратацией
  useEffect(() => {
    setMounted(true)
  }, [])

  // Функция для переключения темы с событием
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"

    // Вызываем событие перед сменой темы
    window.dispatchEvent(new Event("themeChange"))

    // Устанавливаем новую тему
    setTheme(newTheme)
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="rounded-full w-16 h-8 relative bg-gray-700 border-0">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  // Явно определяем текущую тему как "dark" или "light"
  const isDark = theme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full w-16 h-8 relative bg-gray-700 border-0 p-0"
      onClick={toggleTheme}
    >
      {/* Иконки */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun className="h-4 w-4 text-yellow-300 z-10" />
        <Moon className="h-4 w-4 text-gray-300 z-10" />
      </div>

      {/* Ползунок */}
      <div
        className={`absolute top-1 w-7 h-6 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${
          isDark ? "left-[calc(100%-28px)]" : "left-1"
        }`}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
