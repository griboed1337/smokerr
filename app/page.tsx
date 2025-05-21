import { MapGrid } from "@/components/map-grid"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-base font-light tracking-wider uppercase">smokerr</div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <h1 className="sr-only">The Throw Guide - CS2 Maps</h1>
        <MapGrid />
      </div>
    </main>
  )
}
