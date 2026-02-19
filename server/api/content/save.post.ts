import { saveContent } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { pageId, content } = body

    if (!pageId || !content) {
      throw createError({
        statusCode: 400,
        message: 'pageId и content обязательны'
      })
    }

    await saveContent(pageId, content)

    return {
      success: true,
      message: 'Контент успешно сохранен'
    }
  } catch (error: any) {
    console.error('Ошибка сохранения контента:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Ошибка сохранения контента'
    })
  }
})
