<template>
  <NuxtLayout name="page">
    <PageTitle 
      v-if="pageData"
      :title="pageData.title" 
      :subtitle="pageData.subtitle"
    />

    <div v-if="loading" class="loading">
      <p>Загрузка...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <template v-else-if="pageData && pageData.components">
      <template v-for="(component, index) in pageData.components" :key="index">
        <!-- Специальная обработка для info-cards -->
        <div v-if="component.type === 'info-cards'" class="info-cards-grid">
          <InfoCard
            v-for="(card, cardIndex) in component.props.cards"
            :key="cardIndex"
            :title="card.title"
            :icon="card.icon"
          >
            <p>{{ card.content }}</p>
          </InfoCard>
        </div>

        <!-- Текстовый блок с HTML контентом -->
        <TextBlock v-else-if="component.type === 'text-block'">
          <div v-html="component.props.content"></div>
        </TextBlock>

        <!-- Цитата -->
        <QuoteBlock 
          v-else-if="component.type === 'quote'"
          :text="component.props.text"
          :author="component.props.author"
          :variant="component.props.variant"
        />

        <!-- Заголовок секции -->
        <SectionHeading 
          v-else-if="component.type === 'section-heading'"
          :text="component.props.text"
          :level="component.props.level"
        />

        <!-- Изображение -->
        <ImageWithCaption 
          v-else-if="component.type === 'image'"
          :src="component.props.src"
          :alt="component.props.alt"
          :caption="component.props.caption"
          :size="component.props.size"
        />

        <!-- Объявление -->
        <Announcement 
          v-else-if="component.type === 'announcement'"
          :title="component.props.title"
          :date="component.props.date"
          :type="component.props.type"
          :icon="component.props.icon"
        >
          <div v-if="component.props.content" v-html="component.props.content"></div>
        </Announcement>

        <!-- Галерея -->
        <PhotoGallery 
          v-else-if="component.type === 'gallery'"
          :images="component.props.images"
        />

        <!-- Контактная информация -->
        <ContactInfo 
          v-else-if="component.type === 'contact-info'"
          :contacts="component.props.contacts"
        />
      </template>
    </template>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  pageId: {
    type: String,
    required: true
  }
})

const pageData = ref(null)
const loading = ref(true)
const error = ref(null)

const { loadPageContent } = useContent()

onMounted(async () => {
  try {
    loading.value = true
    const data = await loadPageContent(props.pageId)
    
    if (!data) {
      error.value = 'Страница не найдена'
    } else {
      pageData.value = data
      console.log('Loaded page data:', data)
      console.log('Components:', data.components)
    }
  } catch (e) {
    error.value = 'Ошибка загрузки страницы'
    console.error('Error loading page:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.loading,
.error {
  padding: 3rem;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error {
  color: #ff4757;
}

.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .info-cards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
