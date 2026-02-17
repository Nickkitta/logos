# Настройка отправки email с контактной формы

## Текущая реализация

Сейчас форма работает через `mailto:` - при отправке открывается почтовый клиент пользователя. Это работает всегда, но не очень удобно.

## Варианты настройки реальной отправки

### Вариант 1: SMTP через Gmail (Бесплатно)

1. Установи nodemailer:
```bash
npm install nodemailer
```

2. Создай `.env` файл в корне проекта:
```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SCHOOL_EMAIL=info@school.ru
```

3. Получи пароль приложения Gmail:
   - Зайди в Google Account → Security
   - Включи 2-Step Verification
   - Создай App Password для "Mail"
   - Используй этот пароль в `.env`

4. Раскомментируй код в `server/api/contact.post.ts` (секция ВАРИАНТ 1)

5. В `pages/contact.vue` раскомментируй API вариант отправки

### Вариант 2: Telegram Bot (Бесплатно, проще)

1. Создай бота через @BotFather в Telegram
2. Получи токен бота
3. Узнай свой Chat ID (отправь сообщение @userinfobot)
4. Добавь в `.env`:
```env
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

5. Раскомментируй код в `server/api/contact.post.ts` (секция ВАРИАНТ 2)

### Вариант 3: Сервисы отправки email

**SendGrid** (бесплатно до 100 писем/день):
```bash
npm install @sendgrid/mail
```

**Resend** (бесплатно до 3000 писем/месяц):
```bash
npm install resend
```

**Mailgun** (бесплатно до 5000 писем/месяц)

### Вариант 4: Сохранение в базу данных

Можно просто сохранять сообщения в БД и смотреть их в админке:
```bash
npm install prisma @prisma/client
```

## Рекомендация

Для школьного сайта лучше всего:
1. **Telegram Bot** - самый простой вариант, сообщения приходят мгновенно
2. **Gmail SMTP** - если нужна официальная почта
3. **Комбинация** - сохранять в БД + отправлять в Telegram

## Текущее поведение

Пока настроен `mailto:` - при нажатии "Отправить" откроется почтовый клиент с заполненными данными. Это работает без настройки сервера.
