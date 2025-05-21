"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function GrenadeFilters() {
  const [grenadeType, setGrenadeType] = useState("all")
  const [difficulty, setDifficulty] = useState("all")

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-300" />
        <Input
          placeholder="Поиск раскидок..."
          className="pl-10 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300"
        />
      </div>

      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300"
            >
              Тип гранаты
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 transition-colors duration-300">
            <DropdownMenuRadioGroup value={grenadeType} onValueChange={setGrenadeType}>
              <DropdownMenuRadioItem value="all">Все</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="smoke">Дымовые</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="flash">Световые</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="molotov">Зажигательные</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300"
            >
              Сложность
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 transition-colors duration-300">
            <DropdownMenuRadioGroup value={difficulty} onValueChange={setDifficulty}>
              <DropdownMenuRadioItem value="all">Все</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="1">★☆☆</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="2">★★☆</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="3">★★★</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
