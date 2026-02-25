# Центр Логос - Сайт образовательного центра

Современный сайт с Git-based CMS для управления контентом.

## 🎯 Концепция

Проект использует **Git-based CMS** подход:
- Контент редактируется локально через админ-панель
- Изменения коммитятся в Git и пушатся на GitHub
- На сервере собирается статический сайт
- Безопасно, быстро, с версионностью

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Установка
npm install

# Создай .env файл (скопируй из .env.example)
cp .env.example .env
# Заполни своими данными

# Запуск dev-сервера
npm run dev
```

Сайт будет доступен по адресу: http://localhost:3000  
Админка: http://localhost:3000/admin

### Редактирование контента

1. Открой админку локально: `http://localhost:3000/admin`
2. Войди с паролем из `.env` (ADMIN_PASSWORD)
3. Редактируй страницы, добавляй контент
4. Сохраняй изменения
5. Коммить и пуш:
   ```bash
   git add public/content/
   git commit -m "Обновил контент"
   git push
   ```

### Деплой на сервер

На VPS выполни:
```bash
cd /root/logos
./deploy.sh
```

Или вручную:
```bash
git pull && npm run build && pm2 restart center-logos
```

## 📚 Документация

### Для разработчиков
- [🏠 Локальная разработка](./LOCAL_DEVELOPMENT.md) - полное руководство по работе с контентом
- [🚀 Деплой на VPS](./VPS_DEPLOYMENT.md) - настройка сервера
- [📋 Чеклист перед деплоем](./DEPLOYMENT_CHECKLIST.md)

### Настройка интеграций
- [🔐 Настройка пароля админки](./ADMIN_PASSWORD_SETUP.md)
- [📧 Настройка email (Яндекс)](./EMAIL_QUICK_START.md)
- [💬 Настройка Telegram](./TELEGRAM_SETUP.md)
- [🗺️ Настройка Яндекс.Карт](./YANDEX_MAPS_KEY_SETUP.md)

### Управление контентом
- [📝 Руководство по CMS](./CMS_GUIDE.md)
- [🎨 Настройка favicon](./FAVICON_SETUP.md)
- [📍 Настройка карты](./MAP_SETUP.md)

## 🎨 Возможности

- ✅ Git-based CMS (редактирование локально)
- ✅ 9 типов компонентов (текст, изображения, видео, галереи и др.)
- ✅ Адаптивный дизайн (мобильные, планшеты, десктоп)
- ✅ Форма обратной связи с отправкой в Telegram/Email
- ✅ Интеграция с Яндекс.Картами
- ✅ Поддержка видео (YouTube, VK, Rutube)
- ✅ Просмотр документов (Google Drive, Яндекс.Диск)
- ✅ Версионность контента через Git
- ✅ Безопасность (нет админки на проде)

## 📄 Страницы

- `/` - Главная страница
- `/about` - О центре
- `/contact` - Контакты
- `/admin` - Админ-панель (только локально)
- `/components-showcase` - Справочник компонентов

## 🛠 Технологии

- Nuxt 3 (Vue 3 + SSR)
- TypeScript
- Nodemailer (email)
- Telegram Bot API
- Git-based content management

## 🌐 Деплой на VPS

Проект оптимизирован для VPS с файловой системой.

**Требования:**
- Node.js 20+
- PM2 для управления процессом
- Nginx для reverse proxy
- Git для получения обновлений

**Быстрый деплой:**

```bash
# На сервере
cd /root/logos
git pull
npm install
npm run build
pm2 restart center-logos
```

Подробная инструкция: [VPS_DEPLOYMENT.md](./VPS_DEPLOYMENT.md)

## 🔄 Workflow

```
Локально:
1. npm run dev
2. Редактируй контент в админке
3. git add . && git commit -m "Обновил контент"
4. git push

На сервере:
5. ./deploy.sh
   или
   git pull && npm run build && pm2 restart center-logos
```

## 📝 Лицензия

MIT
