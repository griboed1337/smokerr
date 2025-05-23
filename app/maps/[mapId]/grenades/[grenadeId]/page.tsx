import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { db } from "@/lib/firebase"
import { maps } from "@/lib/maps"

interface Grenade {
  id: string
  map: string
  title: string
  description: string
  difficulty: number
  grenadeType: string
  imageUrl: string
  gifUrl: string
  createdAt: string
}

interface PageProps {
  params: {
    mapId: string
    grenadeId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const grenadeDoc = await getDoc(doc(db, "grenades", params.grenadeId))

    if (!grenadeDoc.exists()) {
      return {
        title: "Grenade Not Found",
      }
    }

    const grenadeData = grenadeDoc.data() as Omit<Grenade, "id">

    return {
      title: `${grenadeData.title} - The Throw Guide`,
      description: grenadeData.description,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Grenade Details - The Throw Guide",
    }
  }
}

export default async function GrenadePage({ params }: PageProps) {
  const map = maps.find((m) => m.id === params.mapId)

  if (!map) {
    notFound()
  }

  let grenade: Grenade | null = null

  try {
    const grenadeDoc = await getDoc(doc(db, "grenades", params.grenadeId))

    if (!grenadeDoc.exists()) {
      notFound()
    }

    grenade = {
      id: grenadeDoc.id,
      ...grenadeDoc.data(),
    } as Grenade
  } catch (error) {
    console.error("Error fetching grenade:", error)
    notFound()
  }

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="text-base font-light tracking-wider uppercase">smokerr</div>
            <Link href={`/maps/${params.mapId}`}>
              <Button variant="ghost" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to {map.name}
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
              <Image src={grenade.imageUrl || "/placeholder.svg"} alt={grenade.title} fill className="object-cover" />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Тип:</span>
                <span className="text-sm px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-300">
                  {grenade.grenadeType === "smoke"
                    ? "Дымовая"
                    : grenade.grenadeType === "flash"
                      ? "Световая"
                      : "Зажигательная"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Сложность:</span>
                <span className="text-sm">
                  {"★".repeat(grenade.difficulty)}
                  {"☆".repeat(3 - grenade.difficulty)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-4">{grenade.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
              {grenade.description}
            </p>

            <div className="aspect-video relative overflow-hidden rounded-lg">
              <Image
                src={grenade.gifUrl || "/placeholder.svg"}
                alt={`${grenade.title} demonstration`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
