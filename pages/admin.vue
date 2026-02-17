<template>
  <div class="admin-panel">
    <div class="admin-header">
      <h1>🎨 Панель управления контентом</h1>
      <NuxtLink to="/" class="back-link">← Вернуться на сайт</NuxtLink>
    </div>

    <div class="admin-content">
      <!-- Список страниц -->
      <div class="section">
        <div class="section-header">
          <h2>Страницы</h2>
          <button @click="showCreatePage = true" class="btn-primary">
            + Создать страницу
          </button>
        </div>

        <div v-if="loading" class="loading">Загрузка...</div>

        <div v-else class="pages-list">
          <div 
            v-for="(page, pageIndex) in pages" 
            :key="page.id"
            class="page-item"
            :class="{ 
              active: selectedPage?.id === page.id,
              'read-only': page.id === 'contact'
            }"
            @click="selectPage(page)"
          >
            <div class="page-order-controls">
              <button 
                @click.stop="movePageUp(pageIndex)" 
                :disabled="pageIndex === 0"
                class="btn-order"
                title="Переместить вверх"
              >
                ↑
              </button>
              <button 
                @click.stop="movePageDown(pageIndex)" 
                :disabled="pageIndex === pages.length - 1"
                class="btn-order"
                title="Переместить вниз"
              >
                ↓
              </button>
            </div>
            <div class="page-info">
              <strong>{{ page.title }}</strong>
              <span class="page-path">{{ page.path }}</span>
              <span v-if="page.id === 'contact'" class="page-badge">Только чтение</span>
              <span v-if="page.id === 'about'" class="page-badge">Защищена</span>
            </div>
            <div class="page-actions">
              <button 
                v-if="page.id !== 'contact'"
                @click.stop="editPage(page)" 
                class="btn-edit"
                title="Редактировать"
              >
                ✏️
              </button>
              <button 
                v-if="page.id !== 'contact' && page.id !== 'about'"
                @click.stop="deletePage(page)" 
                class="btn-delete"
                title="Удалить"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Редактор контента -->
      <div v-if="selectedPage" class="section editor-section">
        <div class="section-header">
          <h2>✏️ Редактор: {{ selectedPage.title }}</h2>
          <div class="editor-actions">
            <button @click="showHelp = !showHelp" class="btn-secondary">
              {{ showHelp ? '❌ Закрыть справку' : '❓ Справка' }}
            </button>
            <button @click="saveContent" class="btn-success" :disabled="saving">
              {{ saving ? 'Сохранение...' : '💾 Сохранить' }}
            </button>
            <button @click="addComponent" class="btn-primary">
              + Добавить компонент
            </button>
          </div>
        </div>

        <!-- Справка -->
        <div v-if="showHelp" class="help-panel">
          <h3>📖 Как пользоваться редактором</h3>
          
          <div class="help-section">
            <h4>1. Основная информация</h4>
            <p>Заполните заголовок и подзаголовок страницы.</p>
          </div>

          <div class="help-section">
            <h4>2. Добавление компонентов</h4>
            <p>Нажмите "+ Добавить компонент" и выберите нужный тип:</p>
            <ul>
              <li><strong>📝 Текстовый блок</strong> - обычный текст, поддерживает HTML</li>
              <li><strong>📌 Заголовок секции</strong> - заголовки h2 или h3</li>
              <li><strong>💬 Цитата</strong> - красивый блок с цитатой и автором</li>
              <li><strong>📢 Объявление</strong> - важные объявления с иконками и текстом</li>
              <li><strong>🖼️ Изображение</strong> - одиночное изображение с подписью</li>
              <li><strong>🃏 Карточки</strong> - сетка информационных карточек с иконками</li>
              <li><strong>🖼️ Фотогалерея</strong> - слайдер с несколькими изображениями</li>
            </ul>
          </div>

          <div class="help-section">
            <h4>3. Редактирование компонентов</h4>
            <p>Каждый компонент имеет свои настройки. Заполните поля согласно подсказкам.</p>
            <p>Используйте кнопки ↑↓ для изменения порядка компонентов.</p>
          </div>

          <div class="help-section">
            <h4>4. Сохранение</h4>
            <p>После внесения изменений нажмите "💾 Сохранить".</p>
            <p><strong>⚠️ Важно:</strong> Изменения применятся только после сохранения!</p>
          </div>
        </div>

        <div class="editor-content">
          <div class="form-group">
            <label>Заголовок страницы</label>
            <input v-model="pageContent.title" type="text" class="form-control" />
          </div>

          <div class="form-group">
            <label>Подзаголовок</label>
            <input v-model="pageContent.subtitle" type="text" class="form-control" />
          </div>

          <div class="components-list">
            <h3>Компоненты</h3>
            
            <div 
              v-for="(component, index) in pageContent.components" 
              :key="index"
              class="component-item"
            >
              <div class="component-header">
                <span class="component-type">{{ component.type }}</span>
                <div class="component-controls">
                  <button @click="moveComponent(index, -1)" :disabled="index === 0">↑</button>
                  <button @click="moveComponent(index, 1)" :disabled="index === pageContent.components.length - 1">↓</button>
                  <button @click="removeComponent(index)" class="btn-danger">🗑️</button>
                </div>
              </div>

              <div class="component-props">
                <!-- Специальная обработка для info-cards -->
                <div v-if="component.type === 'info-cards'" class="cards-editor">
                  <h4>Карточки</h4>
                  <div v-for="(card, cardIndex) in component.props.cards" :key="cardIndex" class="card-editor">
                    <div class="card-header">
                      <span>Карточка {{ cardIndex + 1 }}</span>
                      <button @click="removeCard(index, cardIndex)" class="btn-danger-small">🗑️</button>
                    </div>
                    <div class="form-group">
                      <label>Заголовок</label>
                      <input v-model="card.title" type="text" class="form-control" />
                    </div>
                    <div class="form-group">
                      <label>Иконка (star, heart, trophy, book, etc.)</label>
                      <input v-model="card.icon" type="text" class="form-control" />
                    </div>
                    <div class="form-group">
                      <label>Текст</label>
                      <textarea v-model="card.content" class="form-control" rows="2"></textarea>
                    </div>
                  </div>
                  <button @click="addCard(index)" class="btn-secondary">+ Добавить карточку</button>
                </div>

                <!-- Специальная обработка для gallery -->
                <div v-else-if="component.type === 'gallery'" class="gallery-editor">
                  <h4>Изображения галереи</h4>
                  <div v-for="(image, imageIndex) in component.props.images" :key="imageIndex" class="image-editor">
                    <div class="card-header">
                      <span>Изображение {{ imageIndex + 1 }}</span>
                      <button @click="removeGalleryImage(index, imageIndex)" class="btn-danger-small">🗑️</button>
                    </div>
                    <div class="form-group">
                      <label>URL изображения</label>
                      <input v-model="image.src" type="text" class="form-control" placeholder="https://example.com/image.jpg" />
                    </div>
                    <div class="form-group">
                      <label>Описание (alt)</label>
                      <input v-model="image.alt" type="text" class="form-control" />
                    </div>
                    <div class="form-group">
                      <label>Подпись</label>
                      <input v-model="image.caption" type="text" class="form-control" />
                    </div>
                  </div>
                  <button @click="addGalleryImage(index)" class="btn-secondary">+ Добавить изображение</button>
                </div>

                <!-- Обычные свойства для других компонентов -->
                <div v-else>
                  <div v-for="(value, key) in component.props" :key="key" class="prop-item">
                    <label>
                      {{ formatPropLabel(key) }}
                      <span class="prop-hint">{{ getPropHint(component.type, key) }}</span>
                    </label>
                    <textarea 
                      v-if="typeof value === 'string' && (value.length > 50 || key === 'content')"
                      v-model="component.props[key]"
                      class="form-control"
                      :rows="key === 'content' ? 5 : 3"
                      :placeholder="getPropPlaceholder(component.type, key)"
                    ></textarea>
                    <input 
                      v-else
                      v-model="component.props[key]"
                      type="text"
                      class="form-control"
                      :placeholder="getPropPlaceholder(component.type, key)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="pageContent.components.length === 0" class="empty-state">
              Нет компонентов. Нажмите "+ Добавить компонент" чтобы начать.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания страницы -->
    <div v-if="showCreatePage" class="modal-overlay" @click="showCreatePage = false">
      <div class="modal" @click.stop>
        <h2>Создать новую страницу</h2>
        
        <div class="form-group">
          <label>ID страницы (латиница, без пробелов)</label>
          <input v-model="newPage.id" type="text" class="form-control" placeholder="my-page" />
        </div>

        <div class="form-group">
          <label>Путь (URL)</label>
          <input v-model="newPage.path" type="text" class="form-control" placeholder="/my-page" />
        </div>

        <div class="form-group">
          <label>Название</label>
          <input v-model="newPage.title" type="text" class="form-control" placeholder="Моя страница" />
        </div>

        <div class="modal-actions">
          <button @click="createNewPage" class="btn-success">Создать</button>
          <button @click="showCreatePage = false" class="btn-secondary">Отмена</button>
        </div>
      </div>
    </div>

    <!-- Модальное окно добавления компонента -->
    <div v-if="showAddComponent" class="modal-overlay" @click="showAddComponent = false">
      <div class="modal" @click.stop>
        <h2>Добавить компонент</h2>
        
        <div class="component-types">
          <button 
            v-for="type in componentTypes" 
            :key="type.value"
            @click="addComponentType(type.value)"
            class="component-type-btn"
          >
            {{ type.icon }} {{ type.label }}
          </button>
        </div>

        <button @click="showAddComponent = false" class="btn-secondary">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: false
})

const { loadPages, loadPageContent, savePageContent, createPage, deletePage: deletePageApi } = useContent()
const { success, error: notifyError, info, confirm: confirmAction } = useNotify()

const pages = ref([])
const selectedPage = ref(null)
const pageContent = ref(null)
const loading = ref(true)
const saving = ref(false)
const showCreatePage = ref(false)
const showAddComponent = ref(false)
const showHelp = ref(false)

const newPage = ref({
  id: '',
  path: '',
  title: ''
})

const componentTypes = [
  { value: 'text-block', label: 'Текстовый блок', icon: '📝' },
  { value: 'section-heading', label: 'Заголовок секции', icon: '📌' },
  { value: 'quote', label: 'Цитата', icon: '💬' },
  { value: 'announcement', label: 'Объявление', icon: '📢' },
  { value: 'image', label: 'Изображение', icon: '🖼️' },
  { value: 'info-cards', label: 'Информационные карточки', icon: '🃏' },
  { value: 'gallery', label: 'Фотогалерея', icon: '🖼️' }
]

onMounted(async () => {
  await loadPagesList()
})

const loadPagesList = async () => {
  loading.value = true
  pages.value = await loadPages()
  loading.value = false
}

const selectPage = async (page) => {
  // Запрещаем редактирование страницы контактов
  if (page.id === 'contact') {
    info('Страница "Контакты" не может быть отредактирована')
    return
  }
  
  try {
    const content = await loadPageContent(page.id)
    if (content) {
      selectedPage.value = page
      pageContent.value = content
    }
  } catch (error) {
    notifyError('Ошибка загрузки контента страницы')
    console.error(error)
  }
}

const editPage = (page) => {
  selectPage(page)
}

// Перемещение страницы вверх
const movePageUp = async (index) => {
  if (index === 0) return
  
  const temp = pages.value[index]
  pages.value[index] = pages.value[index - 1]
  pages.value[index - 1] = temp
  
  // Обновляем order для всех страниц
  await updatePagesOrder()
}

// Перемещение страницы вниз
const movePageDown = async (index) => {
  if (index === pages.value.length - 1) return
  
  const temp = pages.value[index]
  pages.value[index] = pages.value[index + 1]
  pages.value[index + 1] = temp
  
  // Обновляем order для всех страниц
  await updatePagesOrder()
}

// Обновление порядка страниц на сервере
const updatePagesOrder = async () => {
  try {
    // Обновляем order для каждой страницы
    pages.value.forEach((page, index) => {
      page.order = index + 1
    })
    
    // Отправляем обновленный список на сервер
    const response = await fetch('/api/content/update-pages-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pages: pages.value })
    })
    
    if (!response.ok) {
      throw new Error('Ошибка обновления порядка')
    }
    
    success('Порядок страниц обновлен!')
  } catch (error) {
    notifyError('Ошибка обновления порядка: ' + error.message)
  }
}

const deletePage = async (page) => {
  const confirmed = await confirmAction(`Вы уверены, что хотите удалить страницу "${page.title}"? Это действие нельзя отменить.`)
  
  if (!confirmed) {
    return
  }

  try {
    await deletePageApi(page.id)
    success('Страница успешно удалена!')
    
    // Если удаляем текущую выбранную страницу, сбрасываем выбор
    if (selectedPage.value?.id === page.id) {
      selectedPage.value = null
      pageContent.value = null
    }
    
    // Перезагружаем список страниц
    await loadPagesList()
  } catch (error) {
    notifyError('Ошибка удаления: ' + error.message)
  }
}

const saveContent = async () => {
  if (!selectedPage.value || !pageContent.value) return
  
  saving.value = true
  try {
    await savePageContent(selectedPage.value.id, pageContent.value)
    success('Контент успешно сохранен!')
  } catch (error) {
    notifyError('Ошибка сохранения: ' + error.message)
  } finally {
    saving.value = false
  }
}

const addComponent = () => {
  showAddComponent.value = true
}

const addComponentType = (type) => {
  const defaultProps = {
    'text-block': { 
      content: '<p>Введите текст здесь. Можно использовать HTML теги: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;</p>'
    },
    'section-heading': { 
      text: 'Заголовок секции', 
      level: 'h2' // h2 или h3
    },
    'quote': { 
      text: 'Текст цитаты', 
      author: 'Автор цитаты',
      variant: 'default' // default или accent
    },
    'announcement': { 
      title: 'Заголовок объявления',
      content: '<p>Текст объявления</p>',
      date: new Date().toLocaleDateString('ru-RU'), 
      type: 'info', // info, important, success
      icon: 'info' // info, warning, check
    },
    'image': { 
      src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', 
      alt: 'Описание изображения', 
      caption: 'Подпись к изображению', 
      size: 'medium' // small, medium, large
    },
    'info-cards': { 
      cards: [
        {
          title: 'Карточка 1',
          icon: 'star',
          content: 'Описание карточки 1'
        },
        {
          title: 'Карточка 2',
          icon: 'heart',
          content: 'Описание карточки 2'
        }
      ]
    },
    'gallery': {
      images: [
        {
          src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200',
          alt: 'Описание изображения 1',
          caption: 'Подпись к изображению 1'
        },
        {
          src: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=1200',
          alt: 'Описание изображения 2',
          caption: 'Подпись к изображению 2'
        }
      ]
    }
  }

  if (!pageContent.value.components) {
    pageContent.value.components = []
  }

  pageContent.value.components.push({
    type,
    props: defaultProps[type] || {}
  })

  showAddComponent.value = false
  
  // Прокручиваем к новому компоненту
  setTimeout(() => {
    const components = document.querySelectorAll('.component-item')
    if (components.length > 0) {
      components[components.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 100)
}

const removeComponent = async (index) => {
  const confirmed = await confirmAction('Удалить этот компонент?')
  
  if (confirmed) {
    pageContent.value.components.splice(index, 1)
  }
}

const moveComponent = (index, direction) => {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= pageContent.value.components.length) return
  
  const temp = pageContent.value.components[index]
  pageContent.value.components[index] = pageContent.value.components[newIndex]
  pageContent.value.components[newIndex] = temp
}

// Форматирование названий свойств
const formatPropLabel = (key) => {
  const labels = {
    'text': 'Текст',
    'content': 'Содержимое',
    'author': 'Автор',
    'title': 'Заголовок',
    'subtitle': 'Подзаголовок',
    'level': 'Уровень',
    'variant': 'Вариант',
    'type': 'Тип',
    'icon': 'Иконка',
    'date': 'Дата',
    'src': 'URL изображения',
    'alt': 'Описание',
    'caption': 'Подпись',
    'size': 'Размер',
    'images': 'Изображения'
  }
  return labels[key] || key
}

// Подсказки для свойств
const getPropHint = (componentType, propKey) => {
  const hints = {
    'section-heading': {
      'level': '(h2 или h3)'
    },
    'quote': {
      'variant': '(default или accent)'
    },
    'announcement': {
      'type': '(info, important, success)',
      'icon': '(info, warning, check)',
      'content': '(HTML текст объявления)'
    },
    'image': {
      'size': '(small, medium, large)',
      'src': '(ссылка на изображение)'
    }
  }
  return hints[componentType]?.[propKey] || ''
}

// Плейсхолдеры для полей
const getPropPlaceholder = (componentType, propKey) => {
  const placeholders = {
    'text-block': {
      'content': 'Введите текст. Можно использовать HTML: <p>, <strong>, <ul>, <li>'
    },
    'section-heading': {
      'text': 'Заголовок секции',
      'level': 'h2'
    },
    'quote': {
      'text': 'Текст цитаты',
      'author': 'Автор',
      'variant': 'default'
    },
    'announcement': {
      'title': 'Заголовок объявления',
      'content': '<p>Текст объявления</p>',
      'type': 'info',
      'icon': 'info'
    },
    'image': {
      'src': 'https://example.com/image.jpg',
      'alt': 'Описание изображения',
      'caption': 'Подпись к изображению',
      'size': 'medium'
    }
  }
  return placeholders[componentType]?.[propKey] || ''
}

// Добавление карточки в info-cards
const addCard = (componentIndex) => {
  if (!pageContent.value.components[componentIndex].props.cards) {
    pageContent.value.components[componentIndex].props.cards = []
  }
  
  pageContent.value.components[componentIndex].props.cards.push({
    title: 'Новая карточка',
    icon: 'star',
    content: 'Описание карточки'
  })
}

// Удаление карточки из info-cards
const removeCard = async (componentIndex, cardIndex) => {
  const confirmed = await confirmAction('Удалить эту карточку?')
  
  if (confirmed) {
    pageContent.value.components[componentIndex].props.cards.splice(cardIndex, 1)
  }
}

// Добавление изображения в gallery
const addGalleryImage = (componentIndex) => {
  if (!pageContent.value.components[componentIndex].props.images) {
    pageContent.value.components[componentIndex].props.images = []
  }
  
  pageContent.value.components[componentIndex].props.images.push({
    src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200',
    alt: 'Описание изображения',
    caption: 'Подпись к изображению'
  })
}

// Удаление изображения из gallery
const removeGalleryImage = async (componentIndex, imageIndex) => {
  const confirmed = await confirmAction('Удалить это изображение?')
  
  if (confirmed) {
    pageContent.value.components[componentIndex].props.images.splice(imageIndex, 1)
  }
}

const createNewPage = async () => {
  if (!newPage.value.id || !newPage.value.path || !newPage.value.title) {
    notifyError('Заполните все поля')
    return
  }

  try {
    await createPage(newPage.value)
    success('Страница создана! Перезагрузите страницу чтобы увидеть ее в списке.')
    showCreatePage.value = false
    newPage.value = { id: '', path: '', title: '' }
    
    // Перезагружаем список страниц
    await loadPagesList()
    
    // Автоматически выбираем новую страницу
    const createdPage = pages.value.find(p => p.id === newPage.value.id)
    if (createdPage) {
      await selectPage(createdPage)
    }
  } catch (error) {
    notifyError('Ошибка создания: ' + error.message)
  }
}
</script>

<style scoped>
.admin-panel {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.admin-header h1 {
  margin: 0;
  color: #1a1a2e;
}

.back-link {
  color: #00DC82;
  text-decoration: none;
  font-weight: 600;
}

.admin-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.pages-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.page-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 0.75rem;
}

.page-item:hover {
  border-color: #00DC82;
  background: #f9f9f9;
}

.page-item.active {
  border-color: #00DC82;
  background: #f0fff4;
}

.page-order-controls {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.btn-order {
  width: 28px;
  height: 28px;
  padding: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-order:hover:not(:disabled) {
  background: #00DC82;
  color: white;
  border-color: #00DC82;
}

.btn-order:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.page-path {
  font-size: 0.85rem;
  color: #666;
}

.page-badge {
  display: inline-block;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #ffa502;
  color: white;
  border-radius: 4px;
  margin-top: 0.25rem;
  width: fit-content;
}

.page-item.read-only {
  opacity: 0.7;
  cursor: not-allowed;
}

.page-item.read-only:hover {
  border-color: #e0e0e0;
  background: white;
}

.page-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  transition: transform 0.2s;
}

.btn-edit:hover,
.btn-delete:hover {
  transform: scale(1.2);
}

.editor-section {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.editor-actions {
  display: flex;
  gap: 0.75rem;
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
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #00DC82;
}

.components-list {
  margin-top: 2rem;
}

.components-list h3 {
  margin-bottom: 1rem;
  color: #1a1a2e;
}

.component-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.component-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
}

.component-type {
  font-weight: 600;
  color: #00DC82;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.component-controls {
  display: flex;
  gap: 0.5rem;
}

.component-controls button {
  padding: 0.25rem 0.5rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.component-controls button:hover:not(:disabled) {
  background: #00DC82;
  color: white;
  border-color: #00DC82;
}

.component-controls button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.component-props {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.prop-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.prop-item label {
  font-size: 0.9rem;
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.prop-hint {
  font-size: 0.75rem;
  color: #999;
  font-weight: normal;
  font-style: italic;
}

.cards-editor {
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.cards-editor h4 {
  margin: 0 0 1rem 0;
  color: #1a1a2e;
  font-size: 1rem;
}

.gallery-editor {
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.gallery-editor h4 {
  margin: 0 0 1rem 0;
  color: #1a1a2e;
  font-size: 1rem;
}

.image-editor {
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.card-editor {
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.card-header span {
  font-weight: 600;
  color: #666;
}

.btn-danger-small {
  padding: 0.25rem 0.5rem;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-danger-small:hover {
  background: #ff3838;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #999;
  font-style: italic;
}

.btn-primary,
.btn-success,
.btn-secondary,
.btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #00DC82;
  color: white;
}

.btn-primary:hover {
  background: #00b86f;
}

.btn-success {
  background: #00DC82;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #00b86f;
}

.btn-success:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.btn-danger {
  background: #ff4757;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
}

.btn-danger:hover {
  background: #ff3838;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.component-types {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.component-type-btn {
  padding: 1rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
}

.component-type-btn:hover {
  border-color: #00DC82;
  background: #f0fff4;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.help-panel {
  padding: 1.5rem;
  background: #f0f9ff;
  border: 2px solid #00DC82;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.help-panel h3 {
  margin: 0 0 1.5rem 0;
  color: #1a1a2e;
}

.help-section {
  margin-bottom: 1.5rem;
}

.help-section:last-child {
  margin-bottom: 0;
}

.help-section h4 {
  margin: 0 0 0.5rem 0;
  color: #00DC82;
  font-size: 1rem;
}

.help-section p {
  margin: 0.5rem 0;
  color: #666;
  line-height: 1.6;
}

.help-section ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.help-section li {
  margin: 0.5rem 0;
  color: #666;
  line-height: 1.6;
}

.help-section a {
  color: #00DC82;
  text-decoration: none;
  font-weight: 600;
}

.help-section a:hover {
  text-decoration: underline;
}

@media (max-width: 1024px) {
  .admin-content {
    grid-template-columns: 1fr;
  }
}
</style>
