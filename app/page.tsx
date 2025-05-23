import Link from "next/link"
import { Plus } from "lucide-react"
import { MapGrid } from "@/components/map-grid"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { AuthNavButton } from "@/components/auth-nav-button"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-base font-light tracking-wider uppercase">smokerr</div>
          <div className="flex items-center gap-2">
            <AuthNavButton />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Карты CS2</h1>
          <Link href="/add-grenade">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Добавить раскидку
            </Button>
          </Link>
        </div>
        <MapGrid />
      </div>
    </main>
  )
}
