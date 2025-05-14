# Product Requirements Document
## The Throw Guide
**Actual version: v0.1**
## 📌 Обзор  
**Цель**: Веб-приложение для изучения раскидок гранат в CS2 с интерактивными 2D-схемами и фильтрацией.  
**Стек**:  
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui  
- **Backend**: Supabase (PostgreSQL + Auth)  
- **Хостинг**: Vercel  
- **Медиа**: Cloudinary  
- **i18n**: next-intl (или аналогичная библиотека для интернационализации)  

---

## 🎯 Целевая аудитория  
1. **Новички**: Изучение базовых дымов/флешек.  
2. **Опытные игроки**: Поиск тактик для ранг-игр.  

---

## 🛠 Основные функции  
### MVP (Обязательные)  
- 📂 **Каталог раскидок**:  
  - 2D-схемы на мини-картах (вид сверху).  
  - Фильтры: карта (`Mirage`, `Inferno`), тип гранаты (`smoke`, `flash`), сложность (`★☆☆`-`★★★`).  
  - Гифки/видео с демонстрацией.  
- 🔎 **Поиск** по названию.  
- 🌐 **Переключение языков**: Возможность выбора языка интерфейса (Русский/Английский).  

### Future Features  
- 👤 **UGC**: Добавление своих раскидок после авторизации.  
- ❤️ **Избранное**: Сохранение в профиль.  

---

## 📐 Технические детали  
### Модель данных (Supabase) 
````sql 
CREATE TABLE grenades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map TEXT NOT NULL CHECK (map IN ('mirage', 'inferno', 'dust2')),
  title TEXT NOT NULL,
  description TEXT,
  difficulty INT NOT NULL CHECK (difficulty BETWEEN 1 AND 3),
  grenade_type TEXT NOT NULL CHECK (grenade_type IN ('smoke', 'flash', 'molotov')),
  image_url TEXT,
  gif_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
````
API Endpoints (Next.js)
GET /api/grenades?map=mirage&type=smoke → Фильтрация.

POST /api/grenades → Добавление UGC (с модерацией).

## 🎨 Интерфейс ##
**Главная страница:**

Сетка карт CS2 → выбор карты → фильтры.

**Страница раскидки:**

2D-схема + гифка + описание.

## 📅 Этапы разработки ##
Этап	       Старт	    Длительность	   Задачи
Каркас	     28.03.2025	     7 дней	       Next.js + Supabase
UI	         05.04.2025	     10 дней	   Tailwind + shadcn
База данных	 12.04.2025	     14 дней	   25-30 раскидок
Полировка	 26.04.2025	     21 день       Тесты + деплой