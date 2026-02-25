# 🚀 Деплой на VPS (Reg.ru или другой)

## Почему VPS?

Проект использует файловую систему для хранения контента CMS.
На VPS файлы сохраняются на диск и остаются после перезапуска.

## Требования

- **VPS** с Ubuntu 20.04+ (или другой Linux)
- **Node.js 20+**
- **Nginx** (для reverse proxy)
- **PM2** (для управления процессом)
- **Домен** (опционально, но рекомендуется)

## Пошаговая инструкция

### 1. Подключись к VPS по SSH

```bash
ssh root@твой-ip-адрес
```

### 2. Установи Node.js 20+

```bash
# Обнови систему
apt update && apt upgrade -y

# Установи Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Проверь версию
node -v  # должно быть 20.x
npm -v
```

### 3. Установи PM2

```bash
npm install -g pm2
```

### 4. Склонируй проект

```bash
# Создай директорию для проектов
mkdir -p /var/www
cd /var/www

# Склонируй репозиторий
git clone https://github.com/твой-username/твой-репо.git school
cd school
```

### 5. Настрой переменные окружения

```bash
# Создай .env файл
nano .env
```

Добавь:
```env
# Telegram
TELEGRAM_BOT_TOKEN=твой-токен
TELEGRAM_CHAT_ID=твой-chat-id

# Email (Яндекс)
SMTP_USER=твой-email@yandex.ru
SMTP_PASS=твой-пароль-приложения
SCHOOL_EMAIL=твой-email@yandex.ru

# Яндекс.Карты
YANDEX_MAPS_API_KEY=твой-ключ

# Админка
ADMIN_PASSWORD=твой-надежный-пароль
```

Сохрани: `Ctrl+X`, `Y`, `Enter`

### 6. Установи зависимости и собери проект

```bash
# Установи зависимости
npm install

# Собери проект
npm run build
```

### 7. Запусти с PM2

```bash
# Запусти приложение
pm2 start .output/server/index.mjs --name school

# Сохрани конфигурацию PM2
pm2 save

# Настрой автозапуск при перезагрузке
pm2 startup
# Выполни команду которую покажет PM2
```

### 8. Установи и настрой Nginx

```bash
# Установи Nginx
apt install -y nginx

# Создай конфигурацию
nano /etc/nginx/sites-available/school
```

Добавь:
```nginx
server {
    listen 80;
    server_name твой-домен.ru www.твой-домен.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Сохрани и активируй:
```bash
# Создай симлинк
ln -s /etc/nginx/sites-available/school /etc/nginx/sites-enabled/

# Проверь конфигурацию
nginx -t

# Перезапусти Nginx
systemctl restart nginx
```

### 9. Настрой SSL (HTTPS)

```bash
# Установи Certbot
apt install -y certbot python3-certbot-nginx

# Получи SSL сертификат
certbot --nginx -d твой-домен.ru -d www.твой-домен.ru

# Certbot автоматически настроит Nginx для HTTPS
```

### 10. Настрой DNS

В панели Reg.ru (или другого регистратора):

1. Зайди в управление DNS
2. Добавь A-запись:
   - Имя: `@`
   - Тип: `A`
   - Значение: `IP-адрес-твоего-VPS`
3. Добавь A-запись для www:
   - Имя: `www`
   - Тип: `A`
   - Значение: `IP-адрес-твоего-VPS`

Подожди 10-30 минут пока DNS обновится.

## Готово! 🎉

Твой сайт доступен на `https://твой-домен.ru`

## Управление приложением

### Просмотр логов
```bash
pm2 logs school
```

### Перезапуск
```bash
pm2 restart school
```

### Остановка
```bash
pm2 stop school
```

### Статус
```bash
pm2 status
```

## Обновление сайта

Когда нужно обновить код:

```bash
# Зайди в директорию проекта
cd /var/www/school

# Подтяни изменения
git pull

# Установи новые зависимости (если есть)
npm install

# Пересобери проект
npm run build

# Перезапусти приложение
pm2 restart school
```

## Бэкапы

### Бэкап контента

```bash
# Создай бэкап папки с контентом
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/school/public/content/

# Скачай на локальный компьютер
scp root@твой-ip:/var/www/school/backup-*.tar.gz ./
```

### Автоматический бэкап (cron)

```bash
# Открой crontab
crontab -e

# Добавь строку (бэкап каждый день в 3:00)
0 3 * * * tar -czf /root/backups/school-$(date +\%Y\%m\%d).tar.gz /var/www/school/public/content/
```

## Мониторинг

### Установи мониторинг PM2

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Проверка использования ресурсов

```bash
pm2 monit
```

## Безопасность

### Настрой firewall

```bash
# Установи UFW
apt install -y ufw

# Разреши SSH, HTTP, HTTPS
ufw allow 22
ufw allow 80
ufw allow 443

# Включи firewall
ufw enable
```

### Обновления системы

```bash
# Регулярно обновляй систему
apt update && apt upgrade -y
```

## Стоимость

**VPS на Reg.ru:**
- Минимальный: ~300₽/месяц (1 CPU, 1GB RAM)
- Рекомендуемый: ~500₽/месяц (2 CPU, 2GB RAM)

**Домен:**
- .ru: ~200₽/год
- .com: ~600₽/год

**Итого:** ~500-700₽/месяц

## Если что-то не работает

### Сайт не открывается

1. Проверь что приложение запущено:
   ```bash
   pm2 status
   ```

2. Проверь логи:
   ```bash
   pm2 logs school
   ```

3. Проверь Nginx:
   ```bash
   systemctl status nginx
   ```

### CMS не сохраняет

1. Проверь права на папку:
   ```bash
   chmod -R 755 /var/www/school/public/content/
   chown -R www-data:www-data /var/www/school/public/content/
   ```

2. Проверь логи приложения:
   ```bash
   pm2 logs school --lines 100
   ```

### SSL не работает

1. Проверь что домен указывает на VPS:
   ```bash
   ping твой-домен.ru
   ```

2. Попробуй получить сертификат снова:
   ```bash
   certbot --nginx -d твой-домен.ru
   ```

## Полезные команды

```bash
# Перезапуск всех сервисов
pm2 restart all
systemctl restart nginx

# Просмотр использования диска
df -h

# Просмотр использования памяти
free -h

# Просмотр процессов
htop

# Очистка логов
pm2 flush
```

## Альтернативы VPS

Если VPS кажется сложным:

1. **Shared Hosting с Node.js**
   - Проще в настройке
   - Обычно дороже
   - Меньше контроля

2. **Managed Node.js Hosting**
   - Heroku (от $7/месяц)
   - Railway (от $5/месяц)
   - Render (бесплатно, но медленно)

Но VPS дает больше контроля и дешевле в долгосрочной перспективе!
