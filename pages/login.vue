<template>
  <ClientOnly>
    <div class="login-page">
      <div class="login-container">
        <div class="login-card">
          <h1>🔐 Вход в админ-панель</h1>
          <p class="subtitle">Введите пароль для доступа</p>
          
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="password">Пароль</label>
              <input
                id="password"
                v-model="password"
                type="password"
                class="form-control"
                placeholder="Введите пароль"
                :disabled="loading"
                autofocus
              />
            </div>
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <button type="submit" class="btn-login" :disabled="loading || !password">
              {{ loading ? 'Проверка...' : 'Войти' }}
            </button>
          </form>
        </div>
      </div>
    </div>
    <template #fallback>
      <div class="loading-fallback">
        <div class="spinner"></div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: false,
  ssr: false
})

const password = ref('')
const error = ref('')
const loading = ref(false)

// Проверяем, не авторизован ли уже пользователь
onMounted(() => {
  if (process.client) {
    const isAuthenticated = sessionStorage.getItem('admin_authenticated')
    if (isAuthenticated) {
      // Если уже авторизован, перенаправляем в админку
      const redirectPath = sessionStorage.getItem('redirect_after_login') || '/admin'
      sessionStorage.removeItem('redirect_after_login')
      navigateTo(redirectPath)
    }
  }
})

const handleLogin = async () => {
  if (!password.value) {
    error.value = 'Введите пароль'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: password.value })
    })
    
    const data = await response.json()
    
    if (response.ok && data.success) {
      // Сохраняем флаг авторизации (только на клиенте)
      if (process.client) {
        sessionStorage.setItem('admin_authenticated', 'true')
        
        // Перенаправляем на страницу, куда пользователь хотел попасть
        const redirectPath = sessionStorage.getItem('redirect_after_login') || '/admin'
        sessionStorage.removeItem('redirect_after_login')
        
        await navigateTo(redirectPath)
      }
    } else {
      error.value = data.message || 'Неверный пароль'
      password.value = ''
    }
  } catch (err) {
    error.value = 'Ошибка подключения к серверу'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  margin: 0 0 0.5rem 0;
  color: #1a1a2e;
  text-align: center;
  font-size: 2rem;
}

.subtitle {
  text-align: center;
  color: #666;
  margin: 0 0 2rem 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1a1a2e;
}

.form-control {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
}

.form-control:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  padding: 0.875rem;
  background: #fff5f5;
  border: 2px solid #ff4757;
  border-radius: 8px;
  color: #ff4757;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.btn-login {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.info-box {
  margin-top: 2rem;
  padding: 1rem;
  background: #f0f5ff;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.info-box p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.info-box p:first-child {
  font-weight: 600;
  color: #1a1a2e;
}

.info-box code {
  background: #e0e0e0;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem 1.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
}

.loading-fallback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
