import { writeFile } from 'fs/promises'
import { join } from 'path'

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

    // Путь к файлу контента - в production пишем в .output, в dev в public
    const baseDir = process.env.NODE_ENV === 'production' 
      ? join(process.cwd(), '.output', 'public', 'content')
      : join(process.cwd(), 'public', 'content')
    const contentPath = join(baseDir, `${pageId}.json`)

    // Сохраняем JSON файл
    await writeFile(contentPath, JSON.stringify(content, null, 2), 'utf-8')

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
