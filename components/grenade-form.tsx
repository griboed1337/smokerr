"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { maps } from "@/lib/maps"
import { Upload, X, Loader2 } from "lucide-react"
import { VideoCompressionInfo } from "@/components/video-compression-info"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Название должно содержать не менее 3 символов",
  }),
  description: z.string().min(10, {
    message: "Описание должно содержать не менее 10 символов",
  }),
  map: z.string({
    required_error: "Выберите карту",
  }),
  grenadeType: z.enum(["smoke", "flash", "molotov"], {
    required_error: "Выберите тип гранаты",
  }),
  difficulty: z.enum(["1", "2", "3"], {
    required_error: "Выберите сложность",
  }),
})

export function GrenadeForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [setupVideo, setSetupVideo] = useState<File | null>(null)
  const [resultVideo, setResultVideo] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const setupVideoRef = useRef<HTMLInputElement>(null)
  const resultVideoRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      grenadeType: "smoke",
      difficulty: "1",
    },
  })

  // Максимальный размер файла в байтах (10 МБ)
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const validateVideoFile = (file: File): { valid: boolean; message?: string } => {
    // Проверка типа файла
    if (!file.type.startsWith('video/')) {
      return { valid: false, message: "Файл должен быть видео" };
    }

    // Проверка размера файла
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        message: `Размер файла превышает ${MAX_FILE_SIZE / (1024 * 1024)} МБ. Пожалуйста, сожмите видео перед загрузкой.`
      };
    }

    return { valid: true };
  };

  const handleSetupVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validateVideoFile(file);

      if (validation.valid) {
        setSetupVideo(file);
        setError(null);
      } else {
        setError(validation.message);
      }
    }
  }

  const handleResultVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validateVideoFile(file);

      if (validation.valid) {
        setResultVideo(file);
        setError(null);
      } else {
        setError(validation.message);
      }
    }
  }

  const handleSetupVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateVideoFile(file);

      if (validation.valid) {
        setSetupVideo(file);
        setError(null);
      } else {
        setError(validation.message);
        if (setupVideoRef.current) {
          setupVideoRef.current.value = "";
        }
      }
    }
  }

  const handleResultVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateVideoFile(file);

      if (validation.valid) {
        setResultVideo(file);
        setError(null);
      } else {
        setError(validation.message);
        if (resultVideoRef.current) {
          resultVideoRef.current.value = "";
        }
      }
    }
  }

  const clearSetupVideo = () => {
    setSetupVideo(null)
    if (setupVideoRef.current) {
      setupVideoRef.current.value = ""
    }
  }

  const clearResultVideo = () => {
    setResultVideo(null)
    if (resultVideoRef.current) {
      resultVideoRef.current.value = ""
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Начало отправки формы", values);
    console.log("Видео наводки:", setupVideo ? `${setupVideo.name} (${setupVideo.size} байт)` : "отсутствует");
    console.log("Видео результата:", resultVideo ? `${resultVideo.name} (${resultVideo.size} байт)` : "отсутствует");

    if (!setupVideo || !resultVideo) {
      setError("Необходимо загрузить оба видео")
      return
    }

    // Проверка инициализации Firebase Storage
    if (!storage) {
      console.error("Firebase Storage не инициализирован");
      setError("Ошибка инициализации хранилища. Пожалуйста, обновите страницу и попробуйте снова.");
      return;
    }

    console.log("Firebase Storage инициализирован:", storage);
    console.log("Firebase Storage bucket:", storage.app.options.storageBucket);

    // Повторная проверка размера файлов перед загрузкой
    const setupVideoValidation = validateVideoFile(setupVideo);
    const resultVideoValidation = validateVideoFile(resultVideo);

    if (!setupVideoValidation.valid) {
      setError(setupVideoValidation.message);
      return;
    }

    if (!resultVideoValidation.valid) {
      setError(resultVideoValidation.message);
      return;
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Генерируем уникальные имена файлов с использованием timestamp и случайного числа
      const timestamp = Date.now();
      const randomId = Math.floor(Math.random() * 10000);

      // Получаем расширение файла из оригинального имени или используем .mp4 по умолчанию
      const getFileExtension = (filename: string) => {
        return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2) || "mp4";
      };

      const setupExtension = getFileExtension(setupVideo.name);
      const resultExtension = getFileExtension(resultVideo.name);

      // Используем совершенно другой подход к загрузке файлов
      try {
        console.log("Начало загрузки файлов...");
        setUploadProgress(10);

        // Функция для загрузки одного файла
        const uploadFile = async (file: File, prefix: string) => {
          try {
            console.log(`Начало загрузки ${prefix} видео...`);

            // Создаем уникальное имя файла
            const fileName = `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}.mp4`;
            const storageRef = ref(storage, `grenades/${fileName}`);

            console.log(`Создана ссылка на файл: ${fileName}`);

            // Загружаем файл
            console.log(`Загрузка ${prefix} видео...`);
            const fileData = await file.arrayBuffer();
            const fileBytes = new Uint8Array(fileData);

            console.log(`Файл ${prefix} преобразован в байты, размер:`, fileBytes.length);

            // Загружаем файл в Storage
            const snapshot = await uploadBytes(storageRef, fileBytes);
            console.log(`Видео ${prefix} успешно загружено:`, snapshot);

            // Получаем URL файла
            const downloadUrl = await getDownloadURL(snapshot.ref);
            console.log(`Получен URL для ${prefix} видео:`, downloadUrl);

            return downloadUrl;
          } catch (error) {
            console.error(`Ошибка при загрузке ${prefix} видео:`, error);
            throw error;
          }
        };

        // Загружаем оба файла последовательно
        console.log("Загрузка видео наводки...");
        const setupVideoUrl = await uploadFile(setupVideo, "setup");
        setUploadProgress(50);

        console.log("Загрузка видео результата...");
        const resultVideoUrl = await uploadFile(resultVideo, "result");
        setUploadProgress(100);

        console.log("Оба видео успешно загружены");
        console.log("URL видео наводки:", setupVideoUrl);
        console.log("URL видео результата:", resultVideoUrl);

        // URL файлов уже получены в функции uploadFile

        // Сохраняем данные в Firestore
        console.log("Сохранение данных в Firestore...");
        try {
          const docRef = await addDoc(collection(db, "grenades"), {
            title: values.title,
            description: values.description,
            map: values.map,
            grenadeType: values.grenadeType,
            difficulty: parseInt(values.difficulty),
            imageUrl: setupVideoUrl, // Используем URL видео наводки как превью
            gifUrl: resultVideoUrl, // Используем URL видео результата
            createdAt: serverTimestamp(),
          });

          console.log("Данные успешно сохранены в Firestore, ID документа:", docRef.id);

          // Перенаправляем на страницу карты
          console.log("Перенаправление на страницу карты:", `/maps/${values.map}`);
          router.push(`/maps/${values.map}`);
          router.refresh();
        } catch (firestoreError) {
          console.error("Ошибка при сохранении данных в Firestore:", firestoreError);
          setError("Ошибка при сохранении данных: " + (firestoreError instanceof Error ? firestoreError.message : "неизвестная ошибка"));
          setIsSubmitting(false);
        }
      } catch (uploadError) {
        console.error("Ошибка при завершении загрузки:", uploadError);
        setError("Не удалось завершить загрузку видео. Пожалуйста, попробуйте еще раз.");
      }
    } catch (error) {
      console.error("Error adding grenade:", error);
      setError("Произошла ошибка при добавлении раскидки");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название раскидки" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Опишите раскидку и как её выполнять"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="map"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Карта</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите карту" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {maps.map((map) => (
                          <SelectItem key={map.id} value={map.id}>
                            {map.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grenadeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип гранаты</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="smoke">Дымовая</SelectItem>
                        <SelectItem value="flash">Световая</SelectItem>
                        <SelectItem value="molotov">Зажигательная</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Сложность</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите сложность" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">★☆☆ (Легкая)</SelectItem>
                        <SelectItem value="2">★★☆ (Средняя)</SelectItem>
                        <SelectItem value="3">★★★ (Сложная)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <FormLabel>Видео наводки</FormLabel>
                <VideoCompressionInfo />
              </div>
              <div
                className={`mt-2 border-2 border-dashed rounded-lg p-6 ${setupVideo ? 'border-green-500' : 'border-gray-300 dark:border-gray-700'} transition-colors duration-300`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleSetupVideoDrop}
              >
                {setupVideo ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="text-sm truncate max-w-[80%]">{setupVideo.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearSetupVideo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <video
                      src={URL.createObjectURL(setupVideo)}
                      controls
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Перетащите видео с наводкой или нажмите для выбора
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setupVideoRef.current?.click()}
                    >
                      Выбрать видео
                    </Button>
                    <input
                      ref={setupVideoRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleSetupVideoChange}
                    />
                  </div>
                )}
              </div>
              <FormDescription>
                Загрузите видео, показывающее, как выполнить наводку для броска.
                Максимальный размер файла: {MAX_FILE_SIZE / (1024 * 1024)} МБ.
              </FormDescription>
            </div>

            <div>
              <FormLabel>Видео результата</FormLabel>
              <div
                className={`mt-2 border-2 border-dashed rounded-lg p-6 ${resultVideo ? 'border-green-500' : 'border-gray-300 dark:border-gray-700'} transition-colors duration-300`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleResultVideoDrop}
              >
                {resultVideo ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="text-sm truncate max-w-[80%]">{resultVideo.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearResultVideo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <video
                      src={URL.createObjectURL(resultVideo)}
                      controls
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Перетащите видео с результатом или нажмите для выбора
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => resultVideoRef.current?.click()}
                    >
                      Выбрать видео
                    </Button>
                    <input
                      ref={resultVideoRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleResultVideoChange}
                    />
                  </div>
                )}
              </div>
              <FormDescription>
                Загрузите видео, показывающее результат броска гранаты.
                Максимальный размер файла: {MAX_FILE_SIZE / (1024 * 1024)} МБ.
              </FormDescription>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Загрузка ({Math.round(uploadProgress)}%)
            </>
          ) : (
            "Добавить раскидку"
          )}
        </Button>
      </form>
    </Form>
  )
}
