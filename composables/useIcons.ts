/**
 * Composable для работы с иконками
 */
export const useIcons = () => {
  /**
   * Получить путь к кастомной иконке
   */
  const getIconPath = (name: string): string => {
    return `/icons/${name}.svg`
  }

  /**
   * Проверить, существует ли кастомная иконка
   */
  const hasCustomIcon = async (name: string): Promise<boolean> => {
    try {
      const response = await fetch(getIconPath(name), { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * Список всех встроенных emoji иконок
   */
  const builtInIcons = [
    // Образование
    'book', 'pencil', 'graduation', 'school', 'teacher', 'student', 
    'backpack', 'notebook', 'ruler', 'calculator',
    
    // Коммуникация
    'phone', 'email', 'location', 'clock', 'calendar', 'bell', 'megaphone',
    
    // Действия
    'check', 'cross', 'star', 'heart', 'trophy', 'medal', 'flag',
    
    // Навигация
    'home', 'menu', 'search', 'settings', 'info', 'warning', 'error', 'success',
    
    // Спорт и активности
    'sport', 'basketball', 'music', 'art', 'science', 'computer', 'globe',
    
    // Транспорт
    'bus', 'car', 'bike',
    
    // Разное
    'fire', 'light', 'gift', 'camera', 'image', 'folder', 'document'
  ]

  return {
    getIconPath,
    hasCustomIcon,
    builtInIcons
  }
}
