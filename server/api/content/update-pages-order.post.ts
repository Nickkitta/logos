import { savePages } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { pages } = body

    if (!pages || !Array.isArray(pages)) {
      throw createError({
        statusCode: 400,
        message: 'pages обязателен и должен быть массивом'
      })
    }

    // Обновляем порядок
    const updatedPages = pages.map((page, index) => ({
      ...page,
      order: index + 1
    }))

    // Сохраняем обновленный список
    await savePages({ pages: updatedPages })

    return {
      success: true,
      message: 'Порядок страниц успешно обновлен'
    }
  } catch (error: any) {
    console.error('Ошибка обновления порядка страниц:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Ошибка обновления порядка страниц'
    })
  }
})
