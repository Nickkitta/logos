# 🔧 Исправление деплоя на VPS

## Проблема
Приложение запущено в dev-режиме вместо production build.

## Решение

### 1. Остановить текущий процесс
```bash
pm2 stop center-logos
pm2 delete center-logos
```

### 2. Убедиться что проект собран
```bash
cd /root/center-logos  # или твой путь к проекту
npm run build
```

### 3. Проверить что .output создан
```bash
ls -la .output/server/
# Должен быть файл index.mjs
```

### 4. Запустить правильно через PM2
```bash
pm2 start .output/server/index.mjs --name center-logos
pm2 save
```

### 5. Проверить логи
```bash
pm2 logs center-logos
```

## Если ошибка "Cannot find module"

Проверь что все зависимости установлены:
```bash
cd /root/center-logos
npm install --production
npm run build
pm2 restart center-logos
```

## Если ошибка с портом

По умолчанию Nuxt использует порт 3000. Проверь что Nginx проксирует на правильный порт:

```bash
# Проверь конфиг Nginx
cat /etc/nginx/sites-available/center-logos

# Должно быть:
# proxy_pass http://localhost:3000;
```

## Проверка что приложение работает

```bash
# Проверь что процесс запущен
pm2 status

# Проверь что порт 3000 слушается
netstat -tlnp | grep 3000

# Проверь логи
pm2 logs center-logos --lines 50
```

## Правильная последовательность команд

```bash
# 1. Перейди в директорию проекта
cd /root/center-logos

# 2. Останови старый процесс
pm2 stop center-logos
pm2 delete center-logos

# 3. Установи зависимости (если нужно)
npm install

# 4. Собери проект
npm run build

# 5. Запусти production build
pm2 start .output/server/index.mjs --name center-logos

# 6. Сохрани конфигурацию
pm2 save

# 7. Проверь статус
pm2 status
pm2 logs center-logos
```

## Если всё равно не работает

Попробуй запустить напрямую без PM2 для отладки:

```bash
cd /root/center-logos
node .output/server/index.mjs
```

Если увидишь ошибку - скопируй её и покажи мне.

## Переменные окружения

Убедись что .env файл существует:

```bash
cat /root/center-logos/.env
```

Должны быть все переменные:
- TELEGRAM_BOT_TOKEN
- TELEGRAM_CHAT_ID
- SMTP_USER
- SMTP_PASS
- SCHOOL_EMAIL
- YANDEX_MAPS_API_KEY
- ADMIN_PASSWORD
