import { writeFile } from 'fs/promises'
import { join } from 'path'
import { getPages, savePages, saveContent } from '~/server/utils/storage'

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

    // Получаем текущий список страниц
    const pagesData = await getPages()
    const pages = Array.isArray(pagesData) ? pagesData : (pagesData.pages || [])

    // Проверяем что страница не существует
    if (pages.find((p: any) => p.id === id)) {
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
      order: pages.length + 1
    }

    pages.push(newPage)

    // Сохраняем обновленный список
    await savePages({ pages })

    // Создаем контент для новой страницы
    const defaultContent = {
      id,
      title,
      subtitle: '',
      components: []
    }

    await saveContent(id, defaultContent)

    // Создаем Vue файл в папке pages (только локально)
    if (process.env.VERCEL !== '1') {
      const pagePath = join(process.cwd(), 'pages', `${id}.vue`)
      const vueTemplate = `<template>
  <DynamicPage :pageId="'${id}'" />
</template>

<script setup>
// Динамическая страница, контент загружается из хранилища
</script>
`
      await writeFile(pagePath, vueTemplate, 'utf-8')
    }

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
