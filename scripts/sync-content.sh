#!/bin/bash
# Скрипт синхронизации контента между public и .output

SOURCE="/root/logos/public/content"
TARGET="/root/logos/.output/public/content"

# Копируем файлы
cp -r "$SOURCE"/* "$TARGET"/

echo "Content synced from $SOURCE to $TARGET"
