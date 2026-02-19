// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-11-01',
  
  app: {
    head: {
      title: 'Центр Логос',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Официальный сайт Центра Логос - расписание, контакты, информация' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  },
  
  runtimeConfig: {
    // Приватные ключи (доступны только на сервере)
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.TELEGRAM_CHAT_ID,
    adminPassword: process.env.ADMIN_PASSWORD,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    
    // Публичные ключи (доступны и на клиенте)
    public: {
      schoolEmail: process.env.SCHOOL_EMAIL || 'info@school.ru',
      yandexMapsKey: process.env.YANDEX_MAPS_API_KEY || ''
    }
  }
})

