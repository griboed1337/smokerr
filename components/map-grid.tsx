import Image from "next/image"
import Link from "next/link"
import { maps } from "@/lib/maps"

export function MapGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {maps.map((map) => (
        <Link
          key={map.id}
          href={`/maps/${map.id}`}
          className="relative group overflow-hidden rounded-lg transition-all duration-300"
        >
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={map.imageUrl || "/placeholder.svg"}
              alt={map.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-center">
              {map.logo && (
                <div className="w-16 h-16 mb-2 transition-transform duration-300">
                  <Image src={map.logo || "/placeholder.svg"} alt={`${map.name} logo`} width={64} height={64} />
                </div>
              )}
              <h2 className="text-xl font-bold text-center uppercase tracking-wider text-white">{map.name}</h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
