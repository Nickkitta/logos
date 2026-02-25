#!/bin/bash
# Скрипт деплоя на VPS

echo "🚀 Начинаем деплой..."

# Подтягиваем изменения
echo "📥 Получаем изменения из Git..."
git pull

# Устанавливаем зависимости (если package.json изменился)
echo "📦 Проверяем зависимости..."
npm install

# Собираем проект
echo "🔨 Собираем проект..."
npm run build

# Создаем симлинки для Nitro (workaround для production)
echo "🔗 Создаем симлинки..."
mkdir -p .output/server/chunks/public
ln -sf $(pwd)/.output/public/_nuxt .output/server/chunks/public/_nuxt
ln -sf $(pwd)/.output/public/content .output/server/chunks/public/content
ln -sf $(pwd)/.output/public/favicon.svg .output/server/chunks/public/favicon.svg
ln -sf $(pwd)/.output/public/icons .output/server/chunks/public/icons

# Перезапускаем приложение
echo "♻️  Перезапускаем приложение..."
pm2 restart center-logos

echo "✅ Деплой завершен!"
echo "🌐 Сайт доступен на https://center-logos.ru"
