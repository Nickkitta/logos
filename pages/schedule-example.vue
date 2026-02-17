<template>
  <NuxtLayout name="page">
    <PageTitle 
      title="Расписание уроков" 
      :subtitle="selectedClass"
    />

    <div class="class-selector-wrapper">
      <button class="scroll-btn left" @click="scrollLeft" v-show="canScrollLeft">‹</button>
      <div class="class-selector" ref="selectorRef">
        <button 
          v-for="cls in classes" 
          :key="cls.id"
          @click="selectClass(cls.id)"
          :class="{ active: selectedClassId === cls.id }"
          class="class-btn"
        >
          {{ cls.name }}
        </button>
      </div>
      <button class="scroll-btn right" @click="scrollRight" v-show="canScrollRight">›</button>
    </div>

    <Announcement 
      v-if="currentSchedule.announcement"
      :title="currentSchedule.announcement.title"
      :date="currentSchedule.announcement.date"
      :type="currentSchedule.announcement.type"
      :icon="currentSchedule.announcement.icon"
    >
      <p>{{ currentSchedule.announcement.text }}</p>
    </Announcement>

    <Schedule :schedule="currentSchedule.data" />

    <SectionHeading text="Дополнительная информация" level="h2" />

    <TextBlock>
      <p><strong>Продолжительность урока:</strong> 45 минут</p>
      <p><strong>Перемены:</strong> 10-15 минут</p>
      <p><strong>Обеденный перерыв:</strong> после 4-го урока (30 минут)</p>
    </TextBlock>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const selectedClassId = ref('5a')
const selectorRef = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const classes = [
  { id: '1a', name: '1-А' },
  { id: '1b', name: '1-Б' },
  { id: '2a', name: '2-А' },
  { id: '2b', name: '2-Б' },
  { id: '3a', name: '3-А' },
  { id: '3b', name: '3-Б' },
  { id: '4a', name: '4-А' },
  { id: '4b', name: '4-Б' },
  { id: '5a', name: '5-А' },
  { id: '5b', name: '5-Б' },
  { id: '6a', name: '6-А' },
  { id: '6b', name: '6-Б' },
  { id: '7a', name: '7-А' },
  { id: '7b', name: '7-Б' },
  { id: '8a', name: '8-А' },
  { id: '8b', name: '8-Б' },
  { id: '9a', name: '9-А' },
  { id: '9b', name: '9-Б' },
  { id: '10a', name: '10-А' },
  { id: '11a', name: '11-А' }
]

const schedules = {
  '5a': {
    announcement: {
      title: 'Изменения в расписании',
      date: '15 февраля 2026',
      type: 'important',
      icon: 'warning',
      text: 'Во вторник, 18 февраля, урок физкультуры переносится на 4-й урок вместо 3-го.'
    },
    data: [
      {
        time: '8:00 - 8:45',
        'Понедельник': { subject: 'Математика', teacher: 'Иванова А.П.', room: '201' },
        'Вторник': { subject: 'Русский язык', teacher: 'Петрова М.И.', room: '105' },
        'Среда': { subject: 'Английский', teacher: 'Смирнова О.В.', room: '302' },
        'Четверг': { subject: 'История', teacher: 'Козлов В.А.', room: '210' },
        'Пятница': { subject: 'Математика', teacher: 'Иванова А.П.', room: '201' }
      },
      {
        time: '9:00 - 9:45',
        'Понедельник': { subject: 'Русский язык', teacher: 'Петрова М.И.', room: '105' },
        'Вторник': { subject: 'Математика', teacher: 'Иванова А.П.', room: '201' },
        'Среда': { subject: 'Физика', teacher: 'Волков И.С.', room: '401' },
        'Четверг': { subject: 'Биология', teacher: 'Лебедева Н.П.', room: '305' },
        'Пятница': { subject: 'География', teacher: 'Морозов Д.К.', room: '208' }
      },
      {
        time: '10:00 - 10:45',
        'Понедельник': { subject: 'Английский', teacher: 'Смирнова О.В.', room: '302' },
        'Вторник': { subject: 'Физкультура', teacher: 'Соколов П.Р.', room: 'Спортзал' },
        'Среда': { subject: 'Математика', teacher: 'Иванова А.П.', room: '201' },
        'Четверг': { subject: 'Русский язык', teacher: 'Петрова М.И.', room: '105' },
        'Пятница': { subject: 'Литература', teacher: 'Петрова М.И.', room: '105' }
      },
      {
        time: '11:00 - 11:45',
        'Понедельник': { subject: 'История', teacher: 'Козлов В.А.', room: '210' },
        'Вторник': { subject: 'Информатика', teacher: 'Новиков А.Л.', room: '101' },
        'Среда': { subject: 'Химия', teacher: 'Белова Е.М.', room: '402' },
        'Четверг': { subject: 'Физкультура', teacher: 'Соколов П.Р.', room: 'Спортзал' },
        'Пятница': { subject: 'Музыка', teacher: 'Орлова С.В.', room: '115' }
      }
    ]
  },
  '6b': {
    announcement: {
      title: 'Экскурсия',
      date: '17 февраля 2026',
      type: 'info',
      icon: 'bus',
      text: 'В пятницу состоится экскурсия в музей. Уроки сокращены до 30 минут.'
    },
    data: [
      {
        time: '8:00 - 8:45',
        'Понедельник': { subject: 'Алгебра', teacher: 'Соловьева Т.Н.', room: '203' },
        'Вторник': { subject: 'Литература', teacher: 'Кузнецова Л.В.', room: '108' },
        'Среда': { subject: 'Геометрия', teacher: 'Соловьева Т.Н.', room: '203' },
        'Четверг': { subject: 'Английский', teacher: 'Павлова Е.А.', room: '301' },
        'Пятница': { subject: 'История', teacher: 'Федоров С.М.', room: '212' }
      },
      {
        time: '9:00 - 9:45',
        'Понедельник': { subject: 'Русский язык', teacher: 'Кузнецова Л.В.', room: '108' },
        'Вторник': { subject: 'Физика', teacher: 'Григорьев А.И.', room: '403' },
        'Среда': { subject: 'Биология', teacher: 'Зайцева М.П.', room: '306' },
        'Четверг': { subject: 'Алгебра', teacher: 'Соловьева Т.Н.', room: '203' },
        'Пятница': { subject: 'География', teacher: 'Васильев К.Р.', room: '209' }
      },
      {
        time: '10:00 - 10:45',
        'Понедельник': { subject: 'Английский', teacher: 'Павлова Е.А.', room: '301' },
        'Вторник': { subject: 'История', teacher: 'Федоров С.М.', room: '212' },
        'Среда': { subject: 'Физкультура', teacher: 'Егоров Н.В.', room: 'Спортзал' },
        'Четверг': { subject: 'Химия', teacher: 'Романова И.Л.', room: '404' },
        'Пятница': { subject: 'Русский язык', teacher: 'Кузнецова Л.В.', room: '108' }
      },
      {
        time: '11:00 - 11:45',
        'Понедельник': { subject: 'Информатика', teacher: 'Сидоров Д.А.', room: '102' },
        'Вторник': { subject: 'Обществознание', teacher: 'Федоров С.М.', room: '212' },
        'Среда': { subject: 'Литература', teacher: 'Кузнецова Л.В.', room: '108' },
        'Четверг': { subject: 'Физкультура', teacher: 'Егоров Н.В.', room: 'Спортзал' },
        'Пятница': { subject: 'ИЗО', teacher: 'Николаева А.С.', room: '120' }
      }
    ]
  },
}

// Генерируем расписание для остальных классов на основе базового
const generateSchedule = (classId) => {
  if (schedules[classId]) return schedules[classId]
  
  return {
    announcement: null,
    data: schedules['5a'].data
  }
}

const selectedClass = computed(() => {
  return classes.find(c => c.id === selectedClassId.value)?.name || ''
})

const currentSchedule = computed(() => {
  return generateSchedule(selectedClassId.value)
})

const checkScroll = () => {
  if (!selectorRef.value) return
  const el = selectorRef.value
  canScrollLeft.value = el.scrollLeft > 0
  canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 1
}

const scrollLeft = () => {
  if (selectorRef.value) {
    selectorRef.value.scrollBy({ left: -300, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (selectorRef.value) {
    selectorRef.value.scrollBy({ left: 300, behavior: 'smooth' })
  }
}

const selectClass = (classId) => {
  selectedClassId.value = classId
}

onMounted(() => {
  if (selectorRef.value) {
    selectorRef.value.addEventListener('scroll', checkScroll)
    checkScroll()
    window.addEventListener('resize', checkScroll)
  }
})

onUnmounted(() => {
  if (selectorRef.value) {
    selectorRef.value.removeEventListener('scroll', checkScroll)
  }
  window.removeEventListener('resize', checkScroll)
})
</script>

<style scoped>
.class-selector-wrapper {
  position: relative;
  margin: 2rem 0;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.class-selector {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0.5rem 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 220, 130, 0.3) transparent;
  max-width: 100%;
  box-sizing: border-box;
}

.class-selector::-webkit-scrollbar {
  height: 6px;
}

.class-selector::-webkit-scrollbar-track {
  background: transparent;
}

.class-selector::-webkit-scrollbar-thumb {
  background: rgba(0, 220, 130, 0.3);
  border-radius: 3px;
}

.class-selector::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 220, 130, 0.5);
}

.class-btn {
  padding: 1rem 1.5rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.class-btn:hover {
  border-color: #00DC82;
  color: #00DC82;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 220, 130, 0.2);
}

.class-btn.active {
  background: #00DC82;
  border-color: #00DC82;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 220, 130, 0.3);
}

.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  color: #00DC82;
  font-size: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transition: all 0.3s ease;
}

.scroll-btn:hover {
  background: #00DC82;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.scroll-btn.left {
  left: -20px;
}

.scroll-btn.right {
  right: -20px;
}

/* Мобильные */
@media (max-width: 768px) {
  .class-selector-wrapper {
    margin: 1.5rem 0;
    padding: 0;
  }
  
  .class-selector {
    gap: 0.75rem;
    padding: 0.5rem 0;
  }
  
  .class-btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
  }
  
  .scroll-btn {
    display: none;
  }
}

/* Планшеты */
@media (max-width: 1024px) and (min-width: 769px) {
  .class-selector-wrapper {
    margin: 1.5rem 0;
  }
  
  .class-btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }
  
  .scroll-btn {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
  
  .scroll-btn.left {
    left: -15px;
  }
  
  .scroll-btn.right {
    right: -15px;
  }
}

/* Маленькие планшеты */
@media (max-width: 900px) and (min-width: 769px) {
  .scroll-btn {
    display: none;
  }
  
  .class-selector-wrapper {
    padding: 0;
  }
}
</style>
