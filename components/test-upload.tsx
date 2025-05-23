"use client"

import { useState, useRef } from "react"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"
import { Button } from "@/components/ui/button"

export function TestUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Пожалуйста, выберите файл")
      return
    }

    setUploading(true)
    setError(null)
    setDownloadUrl(null)

    try {
      console.log("Начало тестовой загрузки...")
      console.log("Firebase Storage:", storage)
      console.log("Firebase Storage bucket:", storage?.app?.options?.storageBucket)

      // Создаем уникальное имя файла
      const fileName = `test_${Date.now()}_${Math.floor(Math.random() * 10000)}.txt`
      const storageRef = ref(storage, `test/${fileName}`)

      console.log("Создана ссылка на файл:", fileName)

      // Создаем простой текстовый файл для теста
      const testContent = "Это тестовый файл для проверки загрузки в Firebase Storage."
      const testBlob = new Blob([testContent], { type: "text/plain" })

      console.log("Создан тестовый файл размером:", testBlob.size, "байт")

      // Загружаем файл
      const snapshot = await uploadBytes(storageRef, testBlob)
      console.log("Файл успешно загружен:", snapshot)

      // Получаем URL файла
      const url = await getDownloadURL(snapshot.ref)
      console.log("Получен URL файла:", url)

      setDownloadUrl(url)
    } catch (err) {
      console.error("Ошибка при тестовой загрузке:", err)
      setError(`Ошибка загрузки: ${err instanceof Error ? err.message : "неизвестная ошибка"}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-4 border rounded-md space-y-4">
      <h3 className="text-lg font-medium">Тест загрузки файлов</h3>
      
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
        >
          Выбрать файл
        </Button>
        {file && <span className="text-sm">{file.name}</span>}
      </div>
      
      <Button 
        onClick={handleUpload} 
        disabled={!file || uploading}
      >
        {uploading ? "Загрузка..." : "Загрузить тестовый файл"}
      </Button>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {downloadUrl && (
        <div className="p-3 bg-green-50 text-green-600 rounded-md text-sm">
          Файл успешно загружен! <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="underline">Открыть файл</a>
        </div>
      )}
    </div>
  )
}
