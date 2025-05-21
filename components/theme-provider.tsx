"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Добавляем обработчик события смены темы
  useEffect(() => {
    const handleThemeChange = () => {
      // Добавляем класс для анимации перехода
      document.documentElement.classList.add("transitioning")

      // Удаляем класс после завершения анимации
      setTimeout(() => {
        document.documentElement.classList.remove("transitioning")
      }, 200)
    }

    // Добавляем слушатель события
    window.addEventListener("themeChange", handleThemeChange)

    return () => {
      // Удаляем слушатель при размонтировании
      window.removeEventListener("themeChange", handleThemeChange)
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
