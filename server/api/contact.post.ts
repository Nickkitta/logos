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

  try {
    // Получаем токены из runtime config
    const TELEGRAM_BOT_TOKEN = config.telegramBotToken
    const TELEGRAM_CHAT_ID = config.telegramChatId
    
    console.log('Проверка токенов:', {
      hasToken: !!TELEGRAM_BOT_TOKEN,
      hasChatId: !!TELEGRAM_CHAT_ID,
      tokenLength: TELEGRAM_BOT_TOKEN?.length,
      chatId: TELEGRAM_CHAT_ID
    })
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Telegram не настроен! Проверь .env файл')
      throw createError({
        statusCode: 500,
        message: 'Telegram не настроен. Проверь переменные окружения.'
      })
    }
    
    // Формируем контакты для связи
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
    
    console.log('Отправка в Telegram...', { url: telegramUrl.replace(TELEGRAM_BOT_TOKEN, '***') })
    
    const response = await $fetch(telegramUrl, {
      method: 'POST',
      body: {
        chat_id: TELEGRAM_CHAT_ID,
        text: message
      }
    })

    console.log('Telegram ответ:', response)

    return {
      success: true,
      message: 'Сообщение успешно отправлено'
    }
  } catch (error: any) {
    console.error('Ошибка отправки:', error)
    console.error('Детали ошибки:', {
      message: error.message,
      statusCode: error.statusCode,
      data: error.data
    })
    
    throw createError({
      statusCode: 500,
      message: `Ошибка при отправке: ${error.message || 'Неизвестная ошибка'}`
    })
  }
})
