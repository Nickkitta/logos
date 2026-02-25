import { unlink, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

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

    // Читаем текущий список страниц
    const pagesPath = join(process.cwd(), 'public', 'content', 'pages.json')
    const pagesData = JSON.parse(await readFile(pagesPath, 'utf-8'))

    // Находим страницу
    const pageIndex = pagesData.pages.findIndex((p: any) => p.id === id)
    
    if (pageIndex === -1) {
      throw createError({
        statusCode: 404,
        message: 'Страница не найдена'
      })
    }

    // Удаляем страницу из списка
    pagesData.pages.splice(pageIndex, 1)

    // Сохраняем обновленный список
    await writeFile(pagesPath, JSON.stringify(pagesData, null, 2), 'utf-8')

    // Удаляем файл контента
    const contentPath = join(process.cwd(), 'public', 'content', `${id}.json`)
    try {
      await unlink(contentPath)
    } catch (e) {
      console.warn(`Файл контента ${id}.json не найден`)
    }

    // Удаляем Vue файл из папки pages
    const pagePath = join(process.cwd(), 'pages', `${id}.vue`)
    try {
      await unlink(pagePath)
    } catch (e) {
      console.warn(`Файл страницы ${id}.vue не найден`)
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
