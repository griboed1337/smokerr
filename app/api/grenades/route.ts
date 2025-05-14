import { type NextRequest, NextResponse } from "next/server"
import { collection, getDocs, query, where, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const map = searchParams.get("map")
  const type = searchParams.get("type")
  const difficulty = searchParams.get("difficulty")

  try {
    let q = collection(db, "grenades")

    if (map) {
      q = query(q, where("map", "==", map))
    }

    if (type) {
      q = query(q, where("grenadeType", "==", type))
    }

    if (difficulty) {
      q = query(q, where("difficulty", "==", Number.parseInt(difficulty)))
    }

    const querySnapshot = await getDocs(q)
    const grenades: any[] = []

    querySnapshot.forEach((doc) => {
      grenades.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return NextResponse.json(grenades)
  } catch (error) {
    console.error("Error fetching grenades:", error)
    return NextResponse.json({ error: "Failed to fetch grenades" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.map || !data.title || !data.grenadeType || data.difficulty === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate map
    if (!["mirage", "dust2", "inferno", "anubis", "ancient", "nuke", "train"].includes(data.map)) {
      return NextResponse.json({ error: "Invalid map" }, { status: 400 })
    }

    // Validate grenade type
    if (!["smoke", "flash", "molotov"].includes(data.grenadeType)) {
      return NextResponse.json({ error: "Invalid grenade type" }, { status: 400 })
    }

    // Validate difficulty
    if (![1, 2, 3].includes(data.difficulty)) {
      return NextResponse.json({ error: "Invalid difficulty" }, { status: 400 })
    }

    const docRef = await addDoc(collection(db, "grenades"), {
      ...data,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      id: docRef.id,
      ...data,
    })
  } catch (error) {
    console.error("Error adding grenade:", error)
    return NextResponse.json({ error: "Failed to add grenade" }, { status: 500 })
  }
}
