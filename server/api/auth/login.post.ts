export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { password } = body
  
  // Получаем пароль из переменных окружения
  const config = useRuntimeConfig()
  const adminPassword = config.adminPassword || process.env.ADMIN_PASSWORD
  
  // Если пароль не установлен, используем дефолтный
  const correctPassword = adminPassword || 'admin123'
  
  if (password === correctPassword) {
    return {
      success: true,
      message: 'Авторизация успешна'
    }
  } else {
    // Возвращаем 401 статус при неверном пароле
    setResponseStatus(event, 401)
    return {
      success: false,
      message: 'Неверный пароль'
    }
  }
})
