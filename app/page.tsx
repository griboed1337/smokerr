import { MapGrid } from "@/components/map-grid"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-8 gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <h1 className="sr-only">The Throw Guide - CS2 Maps</h1>
        <MapGrid />
      </div>
    </main>
  )
}
