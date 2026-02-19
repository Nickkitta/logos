export default defineNuxtRouteMiddleware((to, from) => {
  // Пропускаем проверку на сервере
  if (process.server) {
    return
  }
  
  // Проверяем авторизацию на клиенте
  const isAuthenticated = sessionStorage.getItem('admin_authenticated')
  
  if (!isAuthenticated) {
    // Сохраняем путь, куда пользователь хотел попасть
    sessionStorage.setItem('redirect_after_login', to.fullPath)
    return navigateTo('/login')
  }
})
