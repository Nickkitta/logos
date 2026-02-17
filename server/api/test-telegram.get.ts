/**
 * Тестовый endpoint для проверки Telegram
 * Открой в браузере: http://localhost:3000/api/test-telegram
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const TELEGRAM_BOT_TOKEN = config.telegramBotToken
  const TELEGRAM_CHAT_ID = config.telegramChatId
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return {
      error: true,
      message: 'Токены не настроены в .env файле'
    }
  }
  
  try {
    // Получаем информацию о боте
    const botInfo = await $fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`)
    
    // Получаем последние обновления (чтобы увидеть правильный chat_id)
    const updates = await $fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`)
    
    // Пробуем отправить тестовое сообщение
    let sendResult
    try {
      sendResult = await $fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        body: {
          chat_id: TELEGRAM_CHAT_ID,
          text: '✅ Тест успешен! Бот работает.'
        }
      })
    } catch (sendError: any) {
      sendResult = {
        error: true,
        message: sendError.message,
        data: sendError.data
      }
    }
    
    return {
      success: true,
      config: {
        hasToken: !!TELEGRAM_BOT_TOKEN,
        tokenLength: TELEGRAM_BOT_TOKEN.length,
        chatId: TELEGRAM_CHAT_ID
      },
      botInfo,
      updates,
      sendResult,
      instructions: {
        step1: 'Найди своего бота в Telegram',
        step2: 'Нажми Start или отправь /start',
        step3: 'Посмотри в updates выше - там будет правильный chat_id',
        step4: 'Обнови TELEGRAM_CHAT_ID в .env файле',
        step5: 'Перезапусти сервер'
      }
    }
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      data: error.data,
      hint: 'Проверь токен бота - возможно он неправильный'
    }
  }
})
