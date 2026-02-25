import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id, path, title, visible = true } = body

    if (!id || !path || !title) {
      throw createError({
        statusCode: 400,
        message: 'id, path и title обязательны'
      })
    }

    // Читаем текущий список страниц из public/content
    const pagesPath = join(process.cwd(), 'public', 'content', 'pages.json')
    const pagesData = JSON.parse(await readFile(pagesPath, 'utf-8'))

    // Проверяем что страница не существует
    if (pagesData.pages.find((p: any) => p.id === id)) {
      throw createError({
        statusCode: 400,
        message: 'Страница с таким ID уже существует'
      })
    }

    // Добавляем новую страницу
    const newPage = {
      id,
      path,
      title,
      visible,
      order: pagesData.pages.length + 1
    }

    pagesData.pages.push(newPage)

    // Сохраняем обновленный список
    await writeFile(pagesPath, JSON.stringify(pagesData, null, 2), 'utf-8')

    // Создаем файл контента для новой страницы в public/content
    const contentPath = join(process.cwd(), 'public', 'content', `${id}.json`)
    const defaultContent = {
      id,
      title,
      subtitle: '',
      components: []
    }

    await writeFile(contentPath, JSON.stringify(defaultContent, null, 2), 'utf-8')

    // Создаем Vue файл в папке pages
    const pagePath = join(process.cwd(), 'pages', `${id}.vue`)
    const vueTemplate = `<template>
  <DynamicPage :pageId="'${id}'" />
</template>

<script setup>
// Динамическая страница, контент загружается из /public/content/${id}.json
</script>
`

    await writeFile(pagePath, vueTemplate, 'utf-8')

    return {
      success: true,
      message: 'Страница успешно создана',
      page: newPage
    }
  } catch (error: any) {
    console.error('Ошибка создания страницы:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Ошибка создания страницы'
    })
  }
})
