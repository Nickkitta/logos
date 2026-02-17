<template>
  <NuxtLayout name="page">
    <PageTitle 
      title="Контакты" 
      subtitle="Свяжитесь с нами"
    />

    <div class="contact-container">
      <div class="contact-info-section">
        <ContactInfo :contacts="contacts" />
        
        <YandexMap 
          address="г. Волгоград, ул. Рабоче-Крестьянская, д. 44"
          :coordinates="[48.690761, 44.487217]"
          :zoom="16"
        />
      </div>

      <div class="contact-form">
        <h2>Напишите нам</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">Ваше имя</label>
            <input 
              id="name"
              v-model="formData.name" 
              type="text" 
              placeholder="Иван Иванов"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email"
              v-model="formData.email" 
              type="email" 
              placeholder="ivan@example.com"
            />
          </div>

          <div class="form-group">
            <label for="telegram">Telegram (необязательно)</label>
            <input 
              id="telegram"
              v-model="formData.telegram" 
              type="text" 
              placeholder="@username"
            />
            <small class="field-hint">Укажите email или Telegram для связи</small>
          </div>

          <div class="form-group">
            <label for="subject">Тема</label>
            <input 
              id="subject"
              v-model="formData.subject" 
              type="text" 
              placeholder="Вопрос о поступлении"
            />
          </div>

          <div class="form-group">
            <label for="message">Сообщение</label>
            <textarea 
              id="message"
              v-model="formData.message" 
              placeholder="Ваше сообщение..."
              rows="6"
              required
            ></textarea>
          </div>

          <button type="submit" :disabled="isSubmitting">
            <span v-if="!isSubmitting">Отправить</span>
            <span v-else>Отправка...</span>
          </button>

          <div v-if="submitStatus === 'success'" class="status-message success">
            ✓ Сообщение успешно отправлено!
          </div>
          <div v-if="submitStatus === 'error'" class="status-message error">
            ✕ Ошибка отправки. Попробуйте позже.
          </div>
        </form>

        <div class="alternative-contact">
          <p>Или напишите напрямую:</p>
          <a :href="`mailto:${schoolEmail}`" class="email-link">
            <Icon name="email" size="small" />
            {{ schoolEmail }}
          </a>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'

const config = useRuntimeConfig()
const schoolEmail = config.public.schoolEmail
const { error: notifyError } = useNotify()

const contacts = [
  { icon: 'location', label: 'Адрес', value: 'г. Москва, ул. Школьная, д. 15' },
  { icon: 'phone', label: 'Телефон', value: '+7 (495) 123-45-67' },
  { icon: 'email', label: 'Email', value: schoolEmail },
  { icon: 'clock', label: 'Режим работы', value: 'Пн-Пт: 8:00 - 18:00' }
]

const formData = reactive({
  name: '',
  email: '',
  telegram: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submitStatus = ref(null)

const handleSubmit = async () => {
  isSubmitting.value = true
  submitStatus.value = null

  // Валидация: должен быть указан хотя бы email или telegram
  if (!formData.email && !formData.telegram) {
    submitStatus.value = 'error'
    isSubmitting.value = false
    notifyError('Укажите Email или Telegram для связи')
    return
  }

  try {
    console.log('Отправка формы...', formData)
    
    // Отправка через API
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })

    console.log('Статус ответа:', response.status)
    
    const result = await response.json()
    console.log('Ответ сервера:', result)

    if (response.ok) {
      submitStatus.value = 'success'
      formData.name = ''
      formData.email = ''
      formData.telegram = ''
      formData.subject = ''
      formData.message = ''
    } else {
      submitStatus.value = 'error'
      console.error('Ошибка от сервера:', result)
    }
  } catch (error) {
    console.error('Ошибка отправки:', error)
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contact-container {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  margin-top: 2rem;
  align-items: start;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.contact-info-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.contact-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 2rem;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

h2 {
  color: #1a1a2e;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #1a1a2e;
  font-weight: 600;
  font-size: 0.95rem;
}

.field-hint {
  display: block;
  margin-top: 0.5rem;
  color: #999;
  font-size: 0.85rem;
  font-style: italic;
}

input,
textarea {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  max-width: 100%;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #00DC82;
}

textarea {
  resize: vertical;
  min-height: 120px;
}

button {
  width: 100%;
  padding: 1rem 2rem;
  background: #00DC82;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover:not(:disabled) {
  background: #00b86f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 220, 130, 0.3);
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.status-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
}

.status-message.success {
  background: #f0fff4;
  color: #00DC82;
  border: 1px solid #00DC82;
}

.status-message.error {
  background: #fff5f5;
  color: #ff4757;
  border: 1px solid #ff4757;
}

.alternative-contact {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}

.alternative-contact p {
  color: #666;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.email-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #00DC82;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.email-link:hover {
  color: #00b86f;
}

/* Большие экраны */
@media (min-width: 1400px) {
  .contact-container {
    grid-template-columns: 450px 1fr;
    gap: 3rem;
  }
  
  .contact-form {
    padding: 3rem;
  }
}

/* Средние экраны */
@media (max-width: 1200px) and (min-width: 1025px) {
  .contact-container {
    grid-template-columns: 320px 1fr;
    gap: 1.5rem;
  }
  
  .contact-form {
    padding: 1.75rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}

/* Планшеты горизонтально */
@media (max-width: 1024px) and (min-width: 901px) {
  .contact-container {
    grid-template-columns: 300px 1fr;
    gap: 1.25rem;
  }
  
  .contact-form {
    position: static;
    padding: 1.5rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}

/* Планшеты вертикально */
@media (max-width: 900px) {
  .contact-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-form {
    position: static;
  }
}

/* Мобильные */
@media (max-width: 768px) {
  .contact-container {
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .contact-info-section {
    gap: 1.5rem;
  }
  
  .contact-form {
    padding: 1.5rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  input,
  textarea {
    font-size: 0.95rem;
  }
}
</style>
