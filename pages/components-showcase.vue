<template>
  <ClientOnly>
    <div class="showcase">
    <div class="showcase-header">
      <h1>📚 Справочник компонентов</h1>
      <p class="subtitle">Примеры всех доступных компонентов с описанием и настройками</p>
      <NuxtLink to="/admin" class="back-link">← Вернуться в админку</NuxtLink>
    </div>

    <div class="showcase-content">
      <!-- TextBlock -->
      <section class="component-demo">
        <div class="demo-header">
          <h2>📝 Текстовый блок (TextBlock)</h2>
          <code>type: 'text-block'</code>
        </div>
        <div class="demo-description">
          <p><strong>Назначение:</strong> Основной компонент для текстового контента. Поддерживает HTML-разметку.</p>
          <p><strong>Свойства:</strong></p>
          <ul>
            <li><code>content</code> - HTML-содержимое (обязательно)</li>
            <li><code>variant</code> - стиль: 'default', 'highlight', 'bordered'</li>
          </ul>
        </div>
        <div class="demo-preview">
          <TextBlock>
            <p>Это обычный текстовый блок. Можно использовать <strong>жирный текст</strong>, <em>курсив</em>, списки и другие HTML-теги.</p>
            <ul>
              <li>Первый пункт списка</li>
              <li>Второй пункт списка</li>
              <li>Третий пункт списка</li>
            </ul>
          </TextBlock>
          
          <TextBlock variant="highlight">
            <p>Текстовый блок с вариантом "highlight" - яркий градиентный фон</p>
          </TextBlock>
          
          <TextBlock variant="bordered">
            <p>Текстовый блок с вариантом "bordered" - с зеленой рамкой</p>
          </TextBlock>
        </div>
      </section>

      <!-- SectionHeading -->
      <section class="component-demo">
        <div class="demo-header">
          <h2>📌 Заголовок секции (SectionHeading)</h2>
          <code>type: 'section-heading'</code>
        </div>
        <div class="demo-description">
          <p><strong>Назначение:</strong> Заголовки для разделов страницы.</p>
          <p><strong>Свойства:</strong></p>
          <ul>
            <li><code>text</code> - текст заголовка (обязательно)</li>
            <li><code>level</code> - уровень: 'h2' или 'h3'</li>
            <li><code>variant</code> - стиль: 'default', 'accent', 'centered'</li>
          </ul>
        </div>
        <div class="demo-preview">
          <SectionHeading text="Большой заголовок (h2)" level="h2" />
          <SectionHeading text="Средний заголовок (h3)" level="h3" />
          <SectionHeading text="Акцентный заголовок" level="h2" variant="accent" />
          <SectionHeading text="Центрированный заголовок" level="h2" variant="centered" />
        </div>
      </section>

      <!-- QuoteBlock -->
      <section class="component-demo">
        <div class="demo-header">
          <h2>💬 Цитата (QuoteBlock)</h2>
          <code>type: 'quote'</code>
        </div>
        <div class="demo-description">
          <p><strong>Назначение:</strong> Красивое оформление цитат и высказываний.</p>
          <p><strong>Свойства:</strong></p>
          <ul>
            <li><code>text</code> - текст цитаты (обязательно)</li>
            <li><code>author</code> - автор цитаты</li>
            <li><code>variant</code> - стиль: 'default', 'accent', 'centered'</li>
          </ul>
        </div>
        <div class="demo-preview">
          <QuoteBlock 
            text="Образование - это самое мощное оружие, которое вы можете использовать, чтобы изменить мир."
            author="Нельсон Мандела"
          />
          
          <QuoteBlock 
            text="Знание - сила!"
            author="Фрэнсис Бэкон"
            variant="accent"
          />
        </div>
      </section>

      <!-- Announcement -->
      <section class="component-demo">
        <div class="demo-header">
          <h2>📢 Объявление (Announcement)</h2>
          <code>type: 'announcement'</code>
        </div>
        <div class="demo-description">
          <p><strong>Назначение:</strong> Важные объявления и уведомления.</p>
          <p><strong>Свойства:</strong></p>
          <ul>
            <li><code>title</code> - заголовок (обязательно)</li>
            <li><code>content</code> - HTML-содержимое (обязательно)</li>
            <li><code>date</code> - дата объявления</li>
            <li><code>type</code> - тип: 'info' (синий), 'important' (красный), 'success' (зеленый)</li>
            <li><code>icon</code> - иконка: 'info', 'warning', 'check', 'megaphone'</li>
          </ul>
        </div>
        <div class="demo-preview">
          <Announcement 
            title="Информационное объявление"
            date="19.02.2026"
            type="info"
            icon="info"
          >
            <p>Это информационное объявление с синим фоном.</p>
          </Announcement>
          
          <Announcement 
            title="Важное объявление"
            date="19.02.2026"
            type="important"
            icon="warning"
          >
            <p>Это важное объявление с красным фоном.</p>
          </Announcement>
          
          <Announcement 
            title="Успешное завершение"
            date="19.02.2026"
            type="success"
            icon="check"
          >
            <p>Это объявление об успехе с зеленым фоном.</p>
          </Announcement>
        </div>
      </section>

      <!-- ImageWithCaption -->
      <section class="component-demo">
        <div class="demo-header">
          <h2>🖼️ Изображение (ImageWithCaption)</h2>
          <code>type: 'image'</code>
        </div>
        <div class="demo-description">
          <p><strong>Назначение:</strong> Одиночное изображение с подписью и возможностью увеличения.</p>
          <p><strong>Свойства:</strong></p>
          <ul>
            <li><code>src</code> - URL изображения (обязательно)</li>
            <li><code>alt</code> - описание для доступности (обязательно)</li>
            <li><code>caption</code> - подпись под изображением</li>
            <li><code>size</code> - размер: 'small', 'medium', 'large'</li>
          </ul>
        </div>
        <div class="demo-preview">
          <ImageWithCaption 
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800"
            alt="Школьный класс"
            caption="Пример изображения среднего размера с подписью"
            size="medium"
          />
        </div>
      </section>

      <!-- InfoCard (через info-cards) -->
      <section class="component-demo">
        <div class="demo-header">
          <h2>🃏 Информационные карточки (InfoCard)</h2>
          <code>type: 'info-cards'</code>
        </div>
        <div class="demo-description">
          <p><strong>Назначение:</strong> Сетка карточек с иконками для представления информации.</p>
          <p><strong>Свойства:</strong></p>
          <ul>
            <li><code>cards</code> - массив карточек, каждая содержит:
              <ul>
                <li><code>title</code> - заголовок карточки</li>
                <li><code>icon</code> - название иконки (star, heart, trophy, book, etc.)</li>
                <li><code>content</code> - текстовое содержимое</li>
                <li><code>variant</code> - стиль: 'default' (белый фон), 'accent' (градиент), 'bordered' (с рамкой)</li>
              </ul>
            </li>
          </ul>
          <p><strong>Доступные иконки:</strong> book, pencil, graduation, school, star, heart, trophy, medal, phone, email, location, clock, sport, music, art, science, computer и другие</p>
        </div>
        <div class="demo-preview">
          <div class="info-cards-grid">
            <InfoCard title="Обычная карточка" icon="graduation" variant="default">
              <p>Карточка с обычным оформлением (белый фон)</p>
            </InfoCard>
            
            <InfoCard title="Акцентная карточка" icon="star" variant="accent">
              <p>Карточка с градиентным фоном для выделения</p>
            </InfoCard>
            
            <InfoCard title="Карточка с рамкой" icon="trophy" variant="bordered">
              <p>Карточка с зеленой рамкой</p>
            </InfoCard>
            
            <InfoCard title="Научные проекты" icon="science" variant="default">
              <p>Исследовательская деятельность и олимпиады</p>
            </InfoCard>
          </div>
        </div>
      </section>

      <!-- PhotoGallery -->
      <section class="component-demo">
        <div class="demo-header">
          <h2>🎬 Галерея (PhotoGallery)</h2>
          <code>type: 'gallery'</code>
        </div>
        <div class="demo-description">
          <p><strong>Назначение:</strong> Слайдер с фотографиями и видео.</p>
          <p><strong>Свойства:</strong></p>
          <ul>
            <li><code>items</code> - массив элементов, каждый содержит:
              <ul>
                <li><code>type</code> - тип: 'image' или 'video'</li>
                <li><code>src</code> - URL изображения или видео</li>
                <li><code>alt</code> - описание</li>
                <li><code>caption</code> - подпись</li>
                <li><code>thumbnail</code> - превью для видео (необязательно)</li>
              </ul>
            </li>
          </ul>
          <p><strong>Поддерживаемые видео:</strong> YouTube, VK Video, Rutube</p>
        </div>
        <div class="demo-preview">
          <PhotoGallery :items="galleryItems" />
        </div>
      </section>

      <!-- VideoEmbed -->
      <section class="component-demo">
        <div class="demo-header">
          <h2>🎥 Видео (VideoEmbed)</h2>
          <code>type: 'video'</code>
        </div>
        <div class="demo-description">
          <p><strong>Назначение:</strong> Встроенное видео с YouTube, VK или Rutube.</p>
          <p><strong>Свойства:</strong></p>
          <ul>
            <li><code>url</code> - URL видео (обязательно)</li>
            <li><code>title</code> - название видео</li>
            <li><code>description</code> - описание видео</li>
          </ul>
        </div>
        <div class="demo-preview">
          <VideoEmbed 
            url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            title="Пример встроенного видео"
            description="Видео автоматически адаптируется под размер экрана"
          />
        </div>
      </section>

      <!-- DocumentViewer -->
      <section class="component-demo">
        <div class="demo-header">
          <h2>📄 Документ (DocumentViewer)</h2>
          <code>type: 'document'</code>
        </div>
        <div class="demo-description">
          <p><strong>Назначение:</strong> Ссылка на документ или встроенный просмотр.</p>
          <p><strong>Свойства:</strong></p>
          <ul>
            <li><code>url</code> - URL документа (обязательно)</li>
            <li><code>title</code> - название документа (обязательно)</li>
            <li><code>size</code> - размер файла</li>
            <li><code>description</code> - описание</li>
            <li><code>viewType</code> - тип: 'link' (ссылка) или 'embed' (встроенный просмотр)</li>
            <li><code>downloadName</code> - имя файла при скачивании</li>
          </ul>
          <p><strong>Поддерживаемые сервисы:</strong> Google Drive, Яндекс.Диск, прямые ссылки на PDF</p>
        </div>
        <div class="demo-preview">
          <DocumentViewer 
            url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            title="Пример документа (ссылка для скачивания)"
            size="13 КБ"
            description="Тестовый PDF-документ"
            viewType="link"
          />
        </div>
      </section>

      <!-- Schedule -->
      <section class="component-demo">
        <div class="demo-header">
          <h2>📅 Расписание (Schedule)</h2>
          <code>Специальный компонент</code>
        </div>
        <div class="demo-description">
          <p><strong>Назначение:</strong> Отображение расписания уроков или занятий.</p>
          <p><strong>Примечание:</strong> Этот компонент не добавляется через админку, а используется напрямую в коде страницы.</p>
          <p><strong>Свойства:</strong></p>
          <ul>
            <li><code>days</code> - массив названий дней недели</li>
            <li><code>schedule</code> - массив объектов с расписанием</li>
            <li><code>timeLabel</code> - название колонки времени</li>
          </ul>
        </div>
        <div class="demo-preview">
          <Schedule 
            :days="['Понедельник', 'Вторник', 'Среда']"
            :schedule="scheduleData"
            timeLabel="Время"
          />
        </div>
      </section>

      <!-- Icon -->
      <section class="component-demo">
        <div class="demo-header">
          <h2>✨ Иконки (Icon)</h2>
          <code>Вспомогательный компонент</code>
        </div>
        <div class="demo-description">
          <p><strong>Назначение:</strong> Отображение иконок в других компонентах.</p>
          <p><strong>Свойства:</strong></p>
          <ul>
            <li><code>name</code> - название иконки (обязательно)</li>
            <li><code>size</code> - размер: 'small', 'medium', 'large', 'xlarge'</li>
            <li><code>variant</code> - цветовая схема: 'default', 'primary', 'secondary', 'danger', 'warning', 'success', 'muted'</li>
            <li><code>color</code> - произвольный цвет</li>
          </ul>
        </div>
        <div class="demo-preview">
          <div class="icons-showcase">
            <div class="icon-item">
              <Icon name="book" size="xlarge" />
              <span>book</span>
            </div>
            <div class="icon-item">
              <Icon name="graduation" size="xlarge" />
              <span>graduation</span>
            </div>
            <div class="icon-item">
              <Icon name="star" size="xlarge" />
              <span>star</span>
            </div>
            <div class="icon-item">
              <Icon name="heart" size="xlarge" />
              <span>heart</span>
            </div>
            <div class="icon-item">
              <Icon name="trophy" size="xlarge" />
              <span>trophy</span>
            </div>
            <div class="icon-item">
              <Icon name="medal" size="xlarge" />
              <span>medal</span>
            </div>
            <div class="icon-item">
              <Icon name="phone" size="xlarge" />
              <span>phone</span>
            </div>
            <div class="icon-item">
              <Icon name="email" size="xlarge" />
              <span>email</span>
            </div>
            <div class="icon-item">
              <Icon name="location" size="xlarge" />
              <span>location</span>
            </div>
            <div class="icon-item">
              <Icon name="clock" size="xlarge" />
              <span>clock</span>
            </div>
            <div class="icon-item">
              <Icon name="sport" size="xlarge" />
              <span>sport</span>
            </div>
            <div class="icon-item">
              <Icon name="music" size="xlarge" />
              <span>music</span>
            </div>
            <div class="icon-item">
              <Icon name="art" size="xlarge" />
              <span>art</span>
            </div>
            <div class="icon-item">
              <Icon name="science" size="xlarge" />
              <span>science</span>
            </div>
            <div class="icon-item">
              <Icon name="computer" size="xlarge" />
              <span>computer</span>
            </div>
            <div class="icon-item">
              <Icon name="fire" size="xlarge" />
              <span>fire</span>
            </div>
          </div>
        </div>
      </section>
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
definePageMeta({
  layout: false,
  middleware: 'auth',
  ssr: false
})

// Данные для галереи
const galleryItems = [
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200',
    alt: 'Школьный класс',
    caption: 'Современный учебный класс'
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=1200',
    alt: 'Библиотека',
    caption: 'Школьная библиотека'
  },
  {
    type: 'video',
    src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    alt: 'Пример видео',
    caption: 'Видео в галерее',
    thumbnail: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=400'
  }
]

// Данные для расписания
const scheduleData = [
  {
    time: '8:00 - 8:45',
    'Понедельник': { subject: 'Математика', teacher: 'Иванов И.И.', room: '201' },
    'Вторник': { subject: 'Русский язык', teacher: 'Петрова П.П.', room: '105' },
    'Среда': { subject: 'Физика', teacher: 'Сидоров С.С.', room: '301' }
  },
  {
    time: '9:00 - 9:45',
    'Понедельник': { subject: 'Литература', teacher: 'Петрова П.П.', room: '105' },
    'Вторник': { subject: 'Математика', teacher: 'Иванов И.И.', room: '201' },
    'Среда': { subject: 'Химия', teacher: 'Козлова К.К.', room: '302' }
  },
  {
    time: '10:00 - 10:45',
    'Понедельник': { subject: 'Физкультура', teacher: 'Спортов С.С.', room: 'Спортзал' },
    'Вторник': null,
    'Среда': { subject: 'История', teacher: 'Историков И.И.', room: '210' }
  }
]
</script>

<style scoped>
.showcase {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem;
}

.showcase-header {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  text-align: center;
}

.showcase-header h1 {
  margin: 0 0 0.5rem 0;
  color: #1a1a2e;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
}

.back-link {
  display: inline-block;
  color: #00DC82;
  text-decoration: none;
  font-weight: 600;
  margin-top: 1rem;
}

.back-link:hover {
  text-decoration: underline;
}

.showcase-content {
  max-width: 1200px;
  margin: 0 auto;
}

.component-demo {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
  flex-wrap: wrap;
  gap: 1rem;
}

.demo-header h2 {
  margin: 0;
  color: #1a1a2e;
}

.demo-header code {
  background: #f0f0f0;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #666;
}

.demo-description {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.demo-description p {
  margin: 0.5rem 0;
  color: #333;
  line-height: 1.6;
}

.demo-description ul {
  margin: 0.5rem 0 0.5rem 1.5rem;
  color: #666;
}

.demo-description li {
  margin: 0.25rem 0;
  line-height: 1.6;
}

.demo-description code {
  background: #e0e0e0;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9rem;
}

.demo-preview {
  padding: 1.5rem;
  background: #fafafa;
  border-radius: 8px;
  border: 2px dashed #e0e0e0;
}

.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.icons-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1.5rem;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.icon-item span {
  font-size: 0.85rem;
  color: #666;
  text-align: center;
}

@media (max-width: 768px) {
  .showcase {
    padding: 1rem;
  }
  
  .showcase-header {
    padding: 1.5rem;
  }
  
  .showcase-header h1 {
    font-size: 1.5rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .component-demo {
    padding: 1.5rem;
  }
  
  .demo-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .demo-description {
    padding: 1rem;
  }
  
  .demo-preview {
    padding: 1rem;
  }
  
  .info-cards-grid {
    grid-template-columns: 1fr;
  }
  
  .icons-showcase {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 1rem;
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
