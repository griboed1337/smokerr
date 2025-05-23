"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Используем состояние для отслеживания монтирования компонента
  const [mounted, setMounted] = useState(false)

  // Устанавливаем mounted в true после монтирования компонента
  useEffect(() => {
    setMounted(true)
  }, [])

  // Добавляем обработчик события смены темы
  useEffect(() => {
    if (!mounted) return

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
  }, [mounted])

  // Если компонент не смонтирован, возвращаем только дочерние элементы без провайдера темы
  // Это предотвращает гидратацию на сервере
  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
