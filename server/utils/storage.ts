// Универсальная утилита для работы с хранилищем
// Локально: JSON файлы
// Продакшн: Vercel KV

import { readFile, writeFile, readdir } from 'fs/promises'
import { join } from 'path'

// Определяем окружение
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

// Lazy import KV только на продакшене
let kv: any = null
if (isProduction) {
  import('@vercel/kv').then(module => {
    kv = module.kv
  })
}

/**
 * Получить контент по ID
 */
export async function getContent(pageId: string): Promise<any> {
  if (isProduction && kv) {
    // Продакшн: используем Vercel KV
    const content = await kv.get(`content:${pageId}`)
    return content
  } else {
    // Локально: используем JSON файлы
    try {
      const path = join(process.cwd(), 'public', 'content', `${pageId}.json`)
      const data = await readFile(path, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      return null
    }
  }
}

/**
 * Сохранить контент
 */
export async function saveContent(pageId: string, content: any): Promise<void> {
  if (isProduction && kv) {
    // Продакшн: сохраняем в Vercel KV
    await kv.set(`content:${pageId}`, content)
  } else {
    // Локально: сохраняем в JSON
    const path = join(process.cwd(), 'public', 'content', `${pageId}.json`)
    await writeFile(path, JSON.stringify(content, null, 2), 'utf-8')
  }
}

/**
 * Получить список всех страниц
 */
export async function getPages(): Promise<any[]> {
  if (isProduction && kv) {
    // Продакшн: получаем из KV
    const pages = await kv.get('content:pages')
    return pages || []
  } else {
    // Локально: читаем из JSON
    try {
      const path = join(process.cwd(), 'public', 'content', 'pages.json')
      const data = await readFile(path, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      return []
    }
  }
}

/**
 * Сохранить список страниц
 */
export async function savePages(pages: any[]): Promise<void> {
  if (isProduction && kv) {
    // Продакшн: сохраняем в KV
    await kv.set('content:pages', pages)
  } else {
    // Локально: сохраняем в JSON
    const path = join(process.cwd(), 'public', 'content', 'pages.json')
    await writeFile(path, JSON.stringify(pages, null, 2), 'utf-8')
  }
}

/**
 * Удалить контент
 */
export async function deleteContent(pageId: string): Promise<void> {
  if (isProduction && kv) {
    // Продакшн: удаляем из KV
    await kv.del(`content:${pageId}`)
  } else {
    // Локально: удаляем JSON файл
    const { unlink } = await import('fs/promises')
    const path = join(process.cwd(), 'public', 'content', `${pageId}.json`)
    try {
      await unlink(path)
    } catch (error) {
      // Файл не существует - ок
    }
  }
}

/**
 * Получить все ключи контента (для миграции)
 */
export async function getAllContentKeys(): Promise<string[]> {
  if (isProduction && kv) {
    // Продакшн: получаем все ключи из KV
    const keys = await kv.keys('content:*')
    return keys.map((key: string) => key.replace('content:', ''))
  } else {
    // Локально: читаем файлы из директории
    const contentDir = join(process.cwd(), 'public', 'content')
    const files = await readdir(contentDir)
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''))
  }
}
