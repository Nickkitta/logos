import { getContent } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID обязателен'
    })
  }

  try {
    const content = await getContent(id)
    
    if (!content) {
      throw createError({
        statusCode: 404,
        message: 'Контент не найден'
      })
    }

    return content
  } catch (error: any) {
    console.error(`Ошибка получения контента ${id}:`, error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Ошибка получения контента'
    })
  }
})
