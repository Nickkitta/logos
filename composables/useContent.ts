// Composable для работы с контентом из JSON файлов

export const useContent = () => {
  // Загрузка списка страниц
  const loadPages = async (onlyVisible = false) => {
    try {
      const response = await fetch('/content/pages.json')
      if (!response.ok) {
        console.error('Не удалось загрузить pages.json')
        return []
      }
      const data = await response.json()
      
      // Проверяем что data и data.pages существуют
      if (!data || !data.pages || !Array.isArray(data.pages)) {
        console.error('Неверный формат pages.json')
        return []
      }
      
      let pages = data.pages
      
      // Фильтруем только видимые, если нужно
      if (onlyVisible) {
        pages = pages.filter((page: any) => page.visible)
      }
      
      return pages.sort((a: any, b: any) => a.order - b.order)
    } catch (error) {
      console.error('Ошибка загрузки страниц:', error)
      return []
    }
  }

  // Загрузка контента страницы
  const loadPageContent = async (pageId: string) => {
    try {
      const response = await fetch(`/content/${pageId}.json`)
      if (!response.ok) {
        throw new Error('Страница не найдена')
      }
      return await response.json()
    } catch (error) {
      console.error('Ошибка загрузки контента:', error)
      return null
    }
  }

  // Сохранение контента (требует API endpoint)
  const savePageContent = async (pageId: string, content: any) => {
    try {
      const response = await fetch('/api/content/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pageId,
          content
        })
      })
      
      if (!response.ok) {
        throw new Error('Ошибка сохранения')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Ошибка сохранения контента:', error)
      throw error
    }
  }

  // Создание новой страницы
  const createPage = async (pageData: any) => {
    try {
      const response = await fetch('/api/content/create-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pageData)
      })
      
      if (!response.ok) {
        throw new Error('Ошибка создания страницы')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Ошибка создания страницы:', error)
      throw error
    }
  }

  // Удаление страницы
  const deletePage = async (pageId: string) => {
    try {
      const response = await fetch('/api/content/delete-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: pageId })
      })
      
      if (!response.ok) {
        throw new Error('Ошибка удаления страницы')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Ошибка удаления страницы:', error)
      throw error
    }
  }

  return {
    loadPages,
    loadPageContent,
    savePageContent,
    createPage,
    deletePage
  }
}
