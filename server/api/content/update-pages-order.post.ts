import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

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

    // Путь к файлам - в production используем .output, в dev используем public
    const baseDir = process.env.NODE_ENV === 'production'
      ? join(process.cwd(), '.output', 'public', 'content')
      : join(process.cwd(), 'public', 'content')
    const pagesPath = join(baseDir, 'pages.json')
    const pagesData = JSON.parse(await readFile(pagesPath, 'utf-8'))

    // Обновляем порядок
    pagesData.pages = pages.map((page, index) => ({
      ...page,
      order: index + 1
    }))

    // Сохраняем обновленный список
    await writeFile(pagesPath, JSON.stringify(pagesData, null, 2), 'utf-8')

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
