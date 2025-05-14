export interface Map {
  id: string
  name: string
  imageUrl: string
  logo: string
}

export interface Grenade {
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

export type GrenadeType = "smoke" | "flash" | "molotov"
export type DifficultyLevel = 1 | 2 | 3
