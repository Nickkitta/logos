import nodemailer from 'nodemailer'
import type { TransportOptions } from 'nodemailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  
  // Валидация данных
  if (!body.name || !body.message) {
    throw createError({
      statusCode: 400,
      message: 'Заполните все обязательные поля'
    })
  }

  // Проверка что указан хотя бы один способ связи
  if (!body.email && !body.telegram) {
    throw createError({
      statusCode: 400,
      message: 'Укажите Email или Telegram для связи'
    })
  }

  // Валидация email если он указан
  if (body.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        message: 'Некорректный email адрес'
      })
    }
  }

  const results = {
    telegram: false,
    email: false,
    errors: [] as string[]
  }

  // Отправка в Telegram
  try {
    const TELEGRAM_BOT_TOKEN = config.telegramBotToken
    const TELEGRAM_CHAT_ID = config.telegramChatId
    
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const contactInfo = []
      if (body.email) contactInfo.push(`📧 Email: ${body.email}`)
      if (body.telegram) contactInfo.push(`💬 Telegram: ${body.telegram}`)
      
      const message = `🔔 Новое сообщение с сайта школы

👤 Имя: ${body.name}
${contactInfo.join('\n')}
📝 Тема: ${body.subject || 'Не указана'}

💬 Сообщение:
${body.message}`
      
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
      
      await $fetch(telegramUrl, {
        method: 'POST',
        body: {
          chat_id: TELEGRAM_CHAT_ID,
          text: message
        }
      })

      results.telegram = true
    }
  } catch (error: any) {
    console.error('Ошибка отправки в Telegram:', error.message)
    results.errors.push(`Telegram: ${error.message}`)
  }

  // Отправка на Email
  try {
    const SMTP_USER = config.smtpUser
    const SMTP_PASS = config.smtpPass
    const SCHOOL_EMAIL = config.public.schoolEmail
    
    if (SMTP_USER && SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 587,
        secure: false, // true для 465, false для других портов
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      } as TransportOptions)

      const contactInfo = []
      if (body.email) contactInfo.push(`Email: ${body.email}`)
      if (body.telegram) contactInfo.push(`Telegram: ${body.telegram}`)

      await transporter.sendMail({
        from: SMTP_USER,
        to: SCHOOL_EMAIL,
        subject: `Новое сообщение с сайта: ${body.subject || 'Без темы'}`,
        html: `
          <h2>Новое сообщение с контактной формы</h2>
          <p><strong>Имя:</strong> ${body.name}</p>
          <p><strong>Контакты для связи:</strong><br>${contactInfo.join('<br>')}</p>
          <p><strong>Тема:</strong> ${body.subject || 'Не указана'}</p>
          <p><strong>Сообщение:</strong></p>
          <p>${body.message.replace(/\n/g, '<br>')}</p>
        `,
        text: `
Новое сообщение с контактной формы

Имя: ${body.name}
${contactInfo.join('\n')}
Тема: ${body.subject || 'Не указана'}

Сообщение:
${body.message}
        `
      })

      results.email = true
    }
  } catch (error: any) {
    console.error('Ошибка отправки Email:', error.message)
    results.errors.push(`Email: ${error.message}`)
  }

  // Проверяем результаты
  if (!results.telegram && !results.email) {
    throw createError({
      statusCode: 500,
      message: `Не удалось отправить сообщение: ${results.errors.join(', ')}`
    })
  }

  // Формируем ответ
  const successMessages = []
  if (results.telegram) successMessages.push('Telegram')
  if (results.email) successMessages.push('Email')
  
  return {
    success: true,
    message: `Сообщение успешно отправлено через: ${successMessages.join(', ')}`,
    details: results
  }
})
