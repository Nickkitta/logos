<template>
  <NuxtLayout name="page">
    <PageTitle 
      title="О нашей школе" 
      subtitle="История, миссия и ценности"
    />

    <QuoteBlock 
      text="Образование — это самое мощное оружие, которое вы можете использовать, чтобы изменить мир"
      author="Нельсон Мандела"
      variant="accent"
    />

    <SectionHeading text="Наша история" level="h2" />

    <TextBlock>
      <p>Наша школа была основана в 1995 году с целью предоставить качественное образование для всех детей. За эти годы мы выпустили более 2000 учеников, многие из которых достигли значительных успехов в различных областях.</p>
      <p>Мы гордимся нашими традициями и постоянно развиваемся, внедряя современные методы обучения и технологии.</p>
    </TextBlock>

    <SectionHeading text="Наши достижения" level="h2" />

    <div class="info-grid">
      <InfoCard title="Победители олимпиад" icon="trophy">
        <p>Более 150 призовых мест на региональных и всероссийских олимпиадах</p>
      </InfoCard>

      <InfoCard title="Квалифицированные учителя" icon="teacher">
        <p>85% наших учителей имеют высшую квалификационную категорию</p>
      </InfoCard>

      <InfoCard title="Современное оборудование" icon="computer">
        <p>Компьютерные классы, интерактивные доски, научные лаборатории</p>
      </InfoCard>
    </div>

    <SectionHeading text="Контактная информация" level="h2" />

    <ContactInfo :contacts="contacts" />
  </NuxtLayout>
</template>

<script setup>
const contacts = [
  { icon: 'location', label: 'Адрес', value: 'г. Москва, ул. Школьная, д. 15' },
  { icon: 'phone', label: 'Телефон', value: '+7 (495) 123-45-67' },
  { icon: 'email', label: 'Email', value: 'info@school.ru' },
  { icon: 'clock', label: 'Режим работы', value: 'Пн-Пт: 8:00 - 18:00' }
]
</script>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 100%;
  box-sizing: border-box;
}

@media (max-width: 900px) {
  .info-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
