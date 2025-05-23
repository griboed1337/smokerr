import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">Страница не найдена</p>
      <Link href="/">
        <Button>Вернуться на главную</Button>
      </Link>
    </div>
  )
}
