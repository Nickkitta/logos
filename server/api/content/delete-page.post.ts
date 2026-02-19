import { unlink } from 'fs/promises'
import { join } from 'path'
import { getPages, savePages, deleteContent } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id } = body

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'id обязателен'
      })
    }

    // Получаем текущий список страниц
    const pagesData = await getPages()
    const pages = Array.isArray(pagesData) ? pagesData : (pagesData.pages || [])

    // Находим страницу
    const pageIndex = pages.findIndex((p: any) => p.id === id)
    
    if (pageIndex === -1) {
      throw createError({
        statusCode: 404,
        message: 'Страница не найдена'
      })
    }

    // Удаляем страницу из списка
    pages.splice(pageIndex, 1)

    // Сохраняем обновленный список
    await savePages({ pages })

    // Удаляем контент страницы
    await deleteContent(id)

    // Удаляем Vue файл из папки pages (только локально)
    if (process.env.VERCEL !== '1') {
      const pagePath = join(process.cwd(), 'pages', `${id}.vue`)
      try {
        await unlink(pagePath)
      } catch (e) {
        console.warn(`Файл страницы ${id}.vue не найден`)
      }
    }

    return {
      success: true,
      message: 'Страница успешно удалена'
    }
  } catch (error: any) {
    console.error('Ошибка удаления страницы:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Ошибка удаления страницы'
    })
  }
})
