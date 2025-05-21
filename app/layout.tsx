import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "The Throw Guide - CS2 Grenade Throws",
  description: "Learn CS2 grenade throws with interactive 2D maps and filters",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="min-h-screen transition-colors duration-300 ease-in-out bg-white dark:bg-black text-black dark:text-white">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
