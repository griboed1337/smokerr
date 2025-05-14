import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { GrenadeFilters } from "@/components/grenade-filters"
import { GrenadeGrid } from "@/components/grenade-grid"
import { maps } from "@/lib/maps"

export async function generateMetadata({
  params,
}: {
  params: { mapId: string }
}): Promise<Metadata> {
  const map = maps.find((m) => m.id === params.mapId)

  if (!map) {
    return {
      title: "Map Not Found",
    }
  }

  return {
    title: `${map.name} Grenade Throws - The Throw Guide`,
    description: `Learn ${map.name} grenade throws with interactive 2D maps and filters`,
  }
}

export default function MapPage({ params }: { params: { mapId: string } }) {
  const map = maps.find((m) => m.id === params.mapId)

  if (!map) {
    notFound()
  }

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Maps
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {map.logo && (
              <div className="w-12 h-12">
                <Image src={map.logo || "/placeholder.svg"} alt={`${map.name} logo`} width={48} height={48} />
              </div>
            )}
            <h1 className="text-3xl font-bold">{map.name}</h1>
          </div>

          <GrenadeFilters />
        </div>

        <GrenadeGrid mapId={map.id} />
      </div>
    </main>
  )
}
