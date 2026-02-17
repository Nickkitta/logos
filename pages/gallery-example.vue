<template>
  <NuxtLayout name="page">
    <PageTitle 
      title="Фотогалерея" 
      subtitle="Наши мероприятия и будни"
    />

    <SectionHeading text="День знаний 2025" level="h2" />

    <PhotoGallery :images="galleryImages" />

    <SectionHeading text="Наша школа" level="h2" />

    <ImageWithCaption 
      src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"
      alt="Школьное здание"
      caption="Главный корпус нашей школы"
      size="large"
    />

    <div class="image-grid">
      <ImageWithCaption 
        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500"
        alt="Библиотека"
        caption="Школьная библиотека"
        size="medium"
      />
      <ImageWithCaption 
        src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500"
        alt="Спортзал"
        caption="Спортивный зал"
        size="medium"
      />
    </div>
  </NuxtLayout>
</template>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  max-width: 100%;
  box-sizing: border-box;
}

@media (max-width: 900px) {
  .image-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>


<script setup>
const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200',
    alt: 'Ученики в классе',
    caption: 'Первый урок в новом учебном году'
  },
  {
    src: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=1200',
    alt: 'Школьный праздник',
    caption: 'Праздничный концерт для первоклассников'
  },
  {
    src: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200',
    alt: 'Учителя',
    caption: 'Наши замечательные учителя'
  },
  {
    src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200',
    alt: 'Ученики в классе',
    caption: 'Первый урок в новом учебном году'
  },
  {
    src: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=1200',
    alt: 'Школьный праздник',
    caption: 'Праздничный концерт для первоклассников'
  },
  {
    src: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200',
    alt: 'Учителя',
    caption: 'Наши замечательные учителя'
  },
  {
    src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200',
    alt: 'Ученики в классе',
    caption: 'Первый урок в новом учебном году'
  },
  {
    src: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=1200',
    alt: 'Школьный праздник',
    caption: 'Праздничный концерт для первоклассников'
  },
  {
    src: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200',
    alt: 'Учителя',
    caption: 'Наши замечательные учителя'
  },
  {
    src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200',
    alt: 'Ученики в классе',
    caption: 'Первый урок в новом учебном году'
  },
  {
    src: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=1200',
    alt: 'Школьный праздник',
    caption: 'Праздничный концерт для первоклассников'
  },
  {
    src: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200',
    alt: 'Учителя',
    caption: 'Наши замечательные учителя'
  },
]
</script>
