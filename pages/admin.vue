<template>
  <ClientOnly>
    <div class="admin-panel">
    <div class="admin-header">
      <h1>🎨 Панель управления контентом</h1>
      <div class="header-actions">
        <span v-if="versionInfo" class="version-badge" :title="`Build: ${versionInfo.buildDate}\nCommit: ${versionInfo.gitCommit}\nEnv: ${versionInfo.environment}`">
          v{{ versionInfo.version }}
        </span>
        <NuxtLink to="/" class="back-link">← Вернуться на сайт</NuxtLink>
        <button @click="logout" class="logout-btn">🚪 Выйти</button>
      </div>
    </div>

    <div class="admin-tabs">
      <button 
        @click="activeTab = 'pages'" 
        :class="{ active: activeTab === 'pages' }"
        class="tab-btn"
      >
        📄 Страницы
      </button>
      <button 
        @click="activeTab = 'contacts'" 
        :class="{ active: activeTab === 'contacts' }"
        class="tab-btn"
      >
        📞 Контакты
      </button>
    </div>

    <div class="admin-content" v-if="activeTab === 'pages'">
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
            <h4>📚 Справочник компонентов</h4>
            <p>
              <NuxtLink to="/components-showcase" target="_blank" class="showcase-link">
                → Открыть полный справочник с примерами всех компонентов
              </NuxtLink>
            </p>
            <p>В справочнике вы найдете подробное описание каждого компонента, все доступные настройки и живые примеры.</p>
          </div>
          
          <div class="help-section">
            <h4>1. Основная информация</h4>
            <p>Заполните заголовок и подзаголовок страницы.</p>
          </div>

          <div class="help-section">
            <h4>2. Добавление компонентов</h4>
            <p>Нажмите "+ Добавить компонент" и выберите нужный тип:</p>
            <ul>
              <li><strong>📝 Текстовый блок</strong> - обычный текст, поддерживает HTML
                <br><em>Варианты оформления:</em> обычный (белый фон), яркий (градиент), с рамкой (зеленая рамка)
              </li>
              <li><strong>📌 Заголовок секции</strong> - заголовки h2 или h3
                <br><em>Варианты оформления:</em> обычный (с зеленой полосой слева), акцентный (зеленый текст), центрированный
              </li>
              <li><strong>💬 Цитата</strong> - красивый блок с цитатой и автором
                <br><em>Варианты оформления:</em> обычная (белый фон), акцентная (градиентный фон), центрированная
              </li>
              <li><strong>📢 Объявление</strong> - важные объявления с иконками и текстом
                <br><em>Типы:</em> информация (синий), важное (красный), успех (зеленый)
                <br><em>Иконки:</em> info, warning, check, megaphone
              </li>
              <li><strong>🖼️ Изображение</strong> - одиночное изображение с подписью
                <br><em>Размеры:</em> маленькое, среднее, большое
              </li>
              <li><strong>🃏 Карточки</strong> - сетка информационных карточек с иконками
                <br><em>Варианты карточек:</em> обычная (белый фон), акцентная (градиент), с рамкой
              </li>
              <li><strong>🎬 Галерея</strong> - слайдер с фото и видео (YouTube, VK, Rutube)</li>
              <li><strong>🎥 Видео</strong> - встроенное видео с YouTube, VK или Rutube</li>
              <li><strong>📄 Документ</strong> - ссылка на документ или встроенный просмотр (Google Drive, Яндекс.Диск)
                <br><em>Типы отображения:</em> ссылка для скачивания, встроенный просмотр
              </li>
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
                <span class="component-type">{{ getComponentTypeName(component.type) }}</span>
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
                    <div class="form-group">
                      <label>Вариант оформления</label>
                      <select v-model="card.variant" class="form-control">
                        <option value="default">Обычная (белый фон)</option>
                        <option value="accent">Акцентная (градиентный фон)</option>
                        <option value="bordered">С рамкой (зеленая рамка)</option>
                      </select>
                    </div>
                  </div>
                  <button @click="addCard(index)" class="btn-secondary">+ Добавить карточку</button>
                </div>

                <!-- Специальная обработка для gallery -->
                <div v-else-if="component.type === 'gallery'" class="gallery-editor">
                  <h4>Элементы галереи (фото и видео)</h4>
                  <div v-for="(item, itemIndex) in component.props.items" :key="itemIndex" class="gallery-item-editor">
                    <div class="card-header">
                      <span>{{ item.type === 'video' ? '🎥 Видео' : '🖼️ Фото' }} {{ itemIndex + 1 }}</span>
                      <button @click="removeGalleryItem(index, itemIndex)" class="btn-danger-small">🗑️</button>
                    </div>
                    
                    <div class="form-group">
                      <label>Тип элемента</label>
                      <select v-model="item.type" class="form-control">
                        <option value="image">🖼️ Изображение</option>
                        <option value="video">🎥 Видео</option>
                      </select>
                    </div>
                    
                    <div class="form-group">
                      <label>{{ item.type === 'video' ? 'URL видео (YouTube, VK, Rutube)' : 'URL изображения' }}</label>
                      <input v-model="item.src" type="text" class="form-control" 
                        :placeholder="item.type === 'video' ? 'https://www.youtube.com/watch?v=...' : 'https://example.com/image.jpg'" />
                    </div>
                    
                    <div v-if="item.type === 'video'" class="form-group">
                      <label>URL превью (необязательно)</label>
                      <input v-model="item.thumbnail" type="text" class="form-control" placeholder="https://example.com/thumbnail.jpg" />
                    </div>
                    
                    <div class="form-group">
                      <label>Описание (alt)</label>
                      <input v-model="item.alt" type="text" class="form-control" />
                    </div>
                    
                    <div class="form-group">
                      <label>Подпись</label>
                      <input v-model="item.caption" type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="gallery-add-buttons">
                    <button @click="addGalleryItem(index, 'image')" class="btn-secondary">+ Добавить фото</button>
                    <button @click="addGalleryItem(index, 'video')" class="btn-secondary">+ Добавить видео</button>
                  </div>
                </div>

                <!-- Обычные свойства для других компонентов -->
                <div v-else>
                  <div v-for="(value, key) in component.props" :key="key" class="prop-item">
                    <label>
                      {{ formatPropLabel(key) }}
                      <span class="prop-hint">{{ getPropHint(component.type, key) }}</span>
                    </label>
                    
                    <!-- Селект для level (заголовки) -->
                    <select 
                      v-if="key === 'level'"
                      v-model="component.props[key]"
                      class="form-control"
                    >
                      <option value="h2">Большой заголовок (h2)</option>
                      <option value="h3">Средний заголовок (h3)</option>
                    </select>
                    
                    <!-- Селект для variant (разные компоненты) -->
                    <select 
                      v-else-if="key === 'variant' && component.type === 'text-block'"
                      v-model="component.props[key]"
                      class="form-control"
                    >
                      <option value="default">Обычный (белый фон)</option>
                      <option value="highlight">Яркий (градиентный фон)</option>
                      <option value="bordered">С рамкой (зеленая рамка)</option>
                    </select>
                    
                    <select 
                      v-else-if="key === 'variant' && component.type === 'section-heading'"
                      v-model="component.props[key]"
                      class="form-control"
                    >
                      <option value="default">Обычный</option>
                      <option value="accent">Акцентный (зеленый)</option>
                      <option value="centered">Центрированный</option>
                    </select>
                    
                    <select 
                      v-else-if="key === 'variant' && component.type === 'quote'"
                      v-model="component.props[key]"
                      class="form-control"
                    >
                      <option value="default">Обычная</option>
                      <option value="accent">Акцентная (градиентный фон)</option>
                      <option value="centered">Центрированная</option>
                    </select>
                    
                    <!-- Селект для type (объявления) -->
                    <select 
                      v-else-if="key === 'type' && component.type === 'announcement'"
                      v-model="component.props[key]"
                      class="form-control"
                    >
                      <option value="info">Информация (синяя)</option>
                      <option value="important">Важное (красная)</option>
                      <option value="success">Успех (зеленая)</option>
                    </select>
                    
                    <!-- Селект для icon (объявления) -->
                    <select 
                      v-else-if="key === 'icon' && component.type === 'announcement'"
                      v-model="component.props[key]"
                      class="form-control"
                    >
                      <option value="info">Информация (i)</option>
                      <option value="warning">Предупреждение (⚠)</option>
                      <option value="check">Галочка (✓)</option>
                      <option value="megaphone">Мегафон (📢)</option>
                    </select>
                    
                    <!-- Селект для size (изображения) -->
                    <select 
                      v-else-if="key === 'size' && component.type === 'image'"
                      v-model="component.props[key]"
                      class="form-control"
                    >
                      <option value="small">Маленькое</option>
                      <option value="medium">Среднее</option>
                      <option value="large">Большое</option>
                    </select>
                    
                    <!-- Селект для viewType (документы) -->
                    <select 
                      v-else-if="key === 'viewType' && component.type === 'document'"
                      v-model="component.props[key]"
                      class="form-control"
                    >
                      <option value="link">Ссылка для скачивания</option>
                      <option value="embed">Встроенный просмотр</option>
                    </select>
                    
                    <!-- Textarea для длинных текстов -->
                    <textarea 
                      v-else-if="typeof value === 'string' && (value.length > 50 || key === 'content' || key === 'description')"
                      v-model="component.props[key]"
                      class="form-control"
                      :rows="key === 'content' ? 5 : 3"
                      :placeholder="getPropPlaceholder(component.type, key)"
                    ></textarea>
                    
                    <!-- Обычный input для остальных -->
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

    <!-- Секция контактов -->
    <div class="admin-content-single" v-if="activeTab === 'contacts'">
      <div class="section">
        <div class="section-header">
          <h2>⚙️ Настройки контактов</h2>
          <button @click="saveContacts" class="btn-success" :disabled="savingContacts">
            {{ savingContacts ? 'Сохранение...' : '💾 Сохранить' }}
          </button>
        </div>

        <div class="contacts-editor">
          <div class="form-group">
            <label>Адрес школы</label>
            <input v-model="contactsData.address" type="text" class="form-control" placeholder="г. Москва, ул. Школьная, д. 15" />
          </div>

          <div class="form-group">
            <label>Координаты (широта, долгота)</label>
            <div class="coordinates-input">
              <input 
                v-model.number="contactsData.coordinates[0]" 
                type="number" 
                step="0.000001"
                class="form-control" 
                placeholder="Широта (например, 55.751244)" 
              />
              <input 
                v-model.number="contactsData.coordinates[1]" 
                type="number" 
                step="0.000001"
                class="form-control" 
                placeholder="Долгота (например, 37.618423)" 
              />
            </div>
            <small class="field-hint">
              Найдите координаты на <a href="https://yandex.ru/maps/" target="_blank">Яндекс.Картах</a>: 
              кликните правой кнопкой на нужное место → "Что здесь?" → скопируйте координаты
            </small>
          </div>

          <div class="form-group">
            <label>Телефон</label>
            <input v-model="contactsData.phone" type="text" class="form-control" placeholder="+7 (495) 123-45-67" />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input v-model="contactsData.email" type="email" class="form-control" placeholder="info@school.ru" />
          </div>

          <div class="form-group">
            <label>Режим работы</label>
            <input v-model="contactsData.workingHours" type="text" class="form-control" placeholder="Пн-Пт: 8:00 - 18:00" />
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
  middleware: 'auth',
  ssr: false
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
const activeTab = ref('pages')

// Версия приложения
const versionInfo = ref(null)

// Контакты
const contactsData = ref({
  address: '',
  coordinates: [0, 0],
  phone: '',
  email: '',
  workingHours: ''
})
const savingContacts = ref(false)

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
  { value: 'gallery', label: 'Галерея (фото/видео)', icon: '🎬' },
  { value: 'video', label: 'Видео', icon: '🎥' },
  { value: 'document', label: 'Документ', icon: '📄' }
]

// Функция выхода
const logout = () => {
  sessionStorage.removeItem('admin_authenticated')
  navigateTo('/login')
}

onMounted(async () => {
  await loadPagesList()
  await loadContacts()
  await loadVersion()
})

const loadPagesList = async () => {
  loading.value = true
  pages.value = await loadPages()
  loading.value = false
}

// Загрузка версии
const loadVersion = async () => {
  try {
    const response = await fetch('/api/version')
    if (response.ok) {
      versionInfo.value = await response.json()
    }
  } catch (error) {
    console.error('Ошибка загрузки версии:', error)
  }
}

// Загрузка контактов
const loadContacts = async () => {
  try {
    const response = await fetch('/content/contacts.json')
    if (response.ok) {
      const data = await response.json()
      contactsData.value = data
    }
  } catch (error) {
    console.error('Ошибка загрузки контактов:', error)
  }
}

// Сохранение контактов
const saveContacts = async () => {
  savingContacts.value = true
  try {
    const response = await fetch('/api/content/save-contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactsData.value)
    })
    
    if (!response.ok) {
      throw new Error('Ошибка сохранения')
    }
    
    success('Контактные данные успешно сохранены!')
  } catch (error) {
    notifyError('Ошибка сохранения: ' + error.message)
  } finally {
    savingContacts.value = false
  }
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
      content: '<p>Введите текст здесь. Можно использовать HTML теги: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;</p>',
      variant: 'default' // default, highlight, bordered
    },
    'section-heading': { 
      text: 'Заголовок секции', 
      level: 'h2', // h2 или h3
      variant: 'default' // default, accent, centered
    },
    'quote': { 
      text: 'Текст цитаты', 
      author: 'Автор цитаты',
      variant: 'default' // default, accent, centered
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
          content: 'Описание карточки 1',
          variant: 'default'
        },
        {
          title: 'Карточка 2',
          icon: 'heart',
          content: 'Описание карточки 2',
          variant: 'default'
        }
      ]
    },
    'gallery': {
      items: [
        {
          type: 'image',
          src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200',
          alt: 'Описание изображения 1',
          caption: 'Подпись к изображению 1'
        },
        {
          type: 'image',
          src: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=1200',
          alt: 'Описание изображения 2',
          caption: 'Подпись к изображению 2'
        },
        {
          type: 'video',
          src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          alt: 'Описание видео',
          caption: 'Подпись к видео',
          thumbnail: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=400'
        }
      ]
    },
    'video': {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Название видео',
      description: 'Описание видео (необязательно)'
    },
    'document': {
      url: 'https://drive.google.com/file/d/ВАШ_ID_ФАЙЛА/view',
      title: 'Название документа',
      size: '2.5 МБ',
      description: 'Описание документа (необязательно)',
      viewType: 'link', // link или embed
      downloadName: ''
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
    'level': 'Уровень заголовка',
    'variant': 'Вариант оформления',
    'type': 'Тип',
    'icon': 'Иконка',
    'date': 'Дата',
    'src': 'Ссылка',
    'url': 'Ссылка',
    'alt': 'Описание',
    'caption': 'Подпись',
    'size': 'Размер',
    'images': 'Изображения',
    'description': 'Описание',
    'viewType': 'Тип отображения',
    'downloadName': 'Имя файла при скачивании'
  }
  return labels[key] || key
}

// Перевод названий типов компонентов
const getComponentTypeName = (type) => {
  const names = {
    'text-block': '📝 Текстовый блок',
    'section-heading': '📌 Заголовок секции',
    'quote': '💬 Цитата',
    'announcement': '📢 Объявление',
    'image': '🖼️ Изображение',
    'info-cards': '🃏 Информационные карточки',
    'gallery': '🎬 Галерея',
    'video': '🎥 Видео',
    'document': '📄 Документ'
  }
  return names[type] || type
}

// Подсказки для свойств
const getPropHint = (componentType, propKey) => {
  const hints = {
    'text-block': {
      'variant': '(стиль оформления блока)',
      'content': '(можно использовать HTML)'
    },
    'section-heading': {
      'level': '(размер заголовка)',
      'variant': '(стиль оформления заголовка)'
    },
    'quote': {
      'variant': '(стиль оформления цитаты)'
    },
    'announcement': {
      'type': '(цветовая схема)',
      'icon': '(иконка для объявления)',
      'content': '(можно использовать HTML)'
    },
    'image': {
      'size': '(размер отображения)',
      'src': '(ссылка на изображение)'
    },
    'video': {
      'url': '(YouTube, VK, Rutube)',
      'description': '(необязательно)'
    },
    'document': {
      'url': '(Google Drive, Яндекс.Диск или прямая ссылка)',
      'size': '(например: 2.5 МБ)',
      'description': '(необязательно)',
      'viewType': '(способ отображения)',
      'downloadName': '(необязательно)'
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
      'text': 'Заголовок секции'
    },
    'quote': {
      'text': 'Текст цитаты',
      'author': 'Автор цитаты'
    },
    'announcement': {
      'title': 'Заголовок объявления',
      'content': '<p>Текст объявления</p>'
    },
    'image': {
      'src': 'https://example.com/image.jpg',
      'alt': 'Описание изображения',
      'caption': 'Подпись к изображению'
    },
    'video': {
      'url': 'https://www.youtube.com/watch?v=...',
      'title': 'Название видео',
      'description': 'Описание видео'
    },
    'document': {
      'url': 'https://drive.google.com/file/d/...',
      'title': 'Название документа',
      'size': '2.5 МБ',
      'description': 'Краткое описание документа',
      'downloadName': 'document.pdf'
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
    content: 'Описание карточки',
    variant: 'default'
  })
}

// Удаление карточки из info-cards
const removeCard = async (componentIndex, cardIndex) => {
  const confirmed = await confirmAction('Удалить эту карточку?')
  
  if (confirmed) {
    pageContent.value.components[componentIndex].props.cards.splice(cardIndex, 1)
  }
}

// Добавление элемента в gallery (фото или видео)
const addGalleryItem = (componentIndex, type) => {
  if (!pageContent.value.components[componentIndex].props.items) {
    pageContent.value.components[componentIndex].props.items = []
  }
  
  const newItem = type === 'video' 
    ? {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        alt: 'Описание видео',
        caption: 'Подпись к видео',
        thumbnail: ''
      }
    : {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200',
        alt: 'Описание изображения',
        caption: 'Подпись к изображению'
      }
  
  pageContent.value.components[componentIndex].props.items.push(newItem)
}

// Удаление элемента из gallery
const removeGalleryItem = async (componentIndex, itemIndex) => {
  const confirmed = await confirmAction('Удалить этот элемент?')
  
  if (confirmed) {
    pageContent.value.components[componentIndex].props.items.splice(itemIndex, 1)
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

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.version-badge {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: help;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.version-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.back-link {
  color: #00DC82;
  text-decoration: none;
  font-weight: 600;
}

.back-link:hover {
  text-decoration: underline;
}

.logout-btn {
  padding: 0.75rem 1.5rem;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: #ff3838;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
}

.admin-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
}

.tab-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.tab-btn.active {
  background: #00DC82;
  color: white;
}

.admin-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
}

.admin-content-single {
  max-width: 800px;
  margin: 0 auto;
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

.gallery-item-editor {
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.gallery-add-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
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

.contacts-editor {
  padding: 1.5rem;
}

.coordinates-input {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field-hint {
  display: block;
  margin-top: 0.5rem;
  color: #999;
  font-size: 0.85rem;
  line-height: 1.4;
}

.field-hint a {
  color: #00DC82;
  text-decoration: none;
}

.field-hint a:hover {
  text-decoration: underline;
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

.showcase-link {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  text-decoration: none !important;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;
  margin: 0.5rem 0;
}

.showcase-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  text-decoration: none !important;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .admin-header h1 {
    font-size: 1.5rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .logout-btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 1024px) {
  .admin-content {
    grid-template-columns: 1fr;
  }
}

.loading-fallback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e0e0e0;
  border-top-color: #00DC82;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
