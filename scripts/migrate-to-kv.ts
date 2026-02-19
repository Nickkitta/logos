// Скрипт для миграции данных из JSON файлов в Vercel KV
// Запуск: npx tsx scripts/migrate-to-kv.ts

import { kv } from '@vercel/kv'
import { readFile, readdir } from 'fs/promises'
import { join } from 'path'

async function migrate() {
  console.log('🚀 Начинаем миграцию данных в Vercel KV...\n')

  try {
    const contentDir = join(process.cwd(), 'public', 'content')
    const files = await readdir(contentDir)
    
    let migrated = 0
    let errors = 0

    for (const file of files) {
      if (!file.endsWith('.json')) continue
      
      const pageId = file.replace('.json', '')
      const filePath = join(contentDir, file)
      
      try {
        const content = JSON.parse(await readFile(filePath, 'utf-8'))
        await kv.set(`content:${pageId}`, content)
        console.log(`✅ Мигрировано: ${pageId}`)
        migrated++
      } catch (error: any) {
        console.error(`❌ Ошибка миграции ${pageId}:`, error.message)
        errors++
      }
    }

    console.log(`\n🎉 Миграция завершена!`)
    console.log(`   Успешно: ${migrated}`)
    console.log(`   Ошибок: ${errors}`)

    if (errors === 0) {
      console.log('\n✅ Все данные успешно перенесены в Vercel KV!')
      console.log('   Теперь можно деплоить на Vercel.')
    }
  } catch (error: any) {
    console.error('\n❌ Критическая ошибка:', error.message)
    console.error('\nПроверь:')
    console.error('1. Установлен ли @vercel/kv: npm install @vercel/kv')
    console.error('2. Настроены ли переменные окружения KV')
    console.error('3. Запущен ли скрипт с правильными переменными')
    process.exit(1)
  }
}

migrate()
