"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"

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

export function GrenadeGrid({ mapId }: { mapId: string }) {
  const [grenades, setGrenades] = useState<Grenade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGrenades() {
      try {
        const q = query(collection(db, "grenades"), where("map", "==", mapId))
        const querySnapshot = await getDocs(q)
        const grenadesData: Grenade[] = []

        querySnapshot.forEach((doc) => {
          grenadesData.push({
            id: doc.id,
            ...doc.data(),
          } as Grenade)
        })

        setGrenades(grenadesData)
      } catch (error) {
        console.error("Error fetching grenades:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGrenades()
  }, [mapId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse transition-colors duration-300"
          />
        ))}
      </div>
    )
  }

  if (grenades.length === 0) {
    return (
      <div className="text-center py-12 transition-colors duration-300">
        <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">
          Раскидки для этой карты пока не добавлены
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-500">Скоро здесь появятся полезные раскидки гранат</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {grenades.map((grenade) => (
        <Link
          key={grenade.id}
          href={`/maps/${mapId}/grenades/${grenade.id}`}
          className="group transition-all duration-300"
        >
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <Image
              src={grenade.imageUrl || "/placeholder.svg"}
              alt={grenade.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-1 rounded bg-gray-800 text-white transition-colors duration-300">
                  {grenade.grenadeType === "smoke"
                    ? "Дымовая"
                    : grenade.grenadeType === "flash"
                      ? "Световая"
                      : "Зажигательная"}
                </span>
                <span className="text-xs text-white transition-colors duration-300">
                  {"★".repeat(grenade.difficulty)}
                  {"☆".repeat(3 - grenade.difficulty)}
                </span>
              </div>
              <h3 className="font-medium text-white transition-colors duration-300">{grenade.title}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
