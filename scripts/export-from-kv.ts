// Скрипт для экспорта данных из Vercel KV в JSON файлы (бэкап)
// Запуск: npx tsx scripts/export-from-kv.ts

import { kv } from '@vercel/kv'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

async function exportData() {
  console.log('📦 Начинаем экспорт данных из Vercel KV...\n')

  try {
    // Создаем папку для бэкапа
    const backupDir = join(process.cwd(), 'backup')
    await mkdir(backupDir, { recursive: true })

    // Получаем все ключи с префиксом content:
    const keys = await kv.keys('content:*')
    
    let exported = 0
    let errors = 0

    for (const key of keys) {
      try {
        const pageId = key.replace('content:', '')
        const content = await kv.get(key)
        
        const filePath = join(backupDir, `${pageId}.json`)
        await writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8')
        
        console.log(`✅ Экспортировано: ${pageId}`)
        exported++
      } catch (error: any) {
        console.error(`❌ Ошибка экспорта ${key}:`, error.message)
        errors++
      }
    }

    console.log(`\n🎉 Экспорт завершен!`)
    console.log(`   Успешно: ${exported}`)
    console.log(`   Ошибок: ${errors}`)
    console.log(`   Папка: ${backupDir}`)

    if (errors === 0) {
      console.log('\n✅ Все данные успешно экспортированы!')
    }
  } catch (error: any) {
    console.error('\n❌ Критическая ошибка:', error.message)
    process.exit(1)
  }
}

exportData()
