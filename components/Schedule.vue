<template>
  <div class="schedule">
    <!-- Десктопная версия - таблица -->
    <div class="schedule-desktop">
      <table>
        <thead>
          <tr>
            <th>{{ timeLabel }}</th>
            <th v-for="day in days" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in schedule" :key="index">
            <td class="time">{{ row.time }}</td>
            <td v-for="day in days" :key="day" class="lesson">
              <div v-if="row[day]" class="lesson-content">
                <strong>{{ row[day].subject }}</strong>
                <span v-if="row[day].teacher" class="teacher">{{ row[day].teacher }}</span>
                <span v-if="row[day].room" class="room">Каб. {{ row[day].room }}</span>
              </div>
              <div v-else class="empty">—</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Мобильная версия - по дням -->
    <div class="schedule-mobile">
      <div class="day-selector">
        <button 
          v-for="(day, index) in days" 
          :key="day"
          @click="selectedDayIndex = index"
          :class="{ active: selectedDayIndex === index }"
          class="day-btn"
        >
          {{ getDayShort(day) }}
        </button>
      </div>

      <div class="day-schedule">
        <h3>{{ days[selectedDayIndex] }}</h3>
        <div v-for="(row, index) in schedule" :key="index" class="lesson-card">
          <div class="lesson-time">{{ row.time }}</div>
          <div v-if="row[days[selectedDayIndex]]" class="lesson-info">
            <div class="lesson-subject">{{ row[days[selectedDayIndex]].subject }}</div>
            <div v-if="row[days[selectedDayIndex]].teacher" class="lesson-teacher">
              {{ row[days[selectedDayIndex]].teacher }}
            </div>
            <div v-if="row[days[selectedDayIndex]].room" class="lesson-room">
              Кабинет {{ row[days[selectedDayIndex]].room }}
            </div>
          </div>
          <div v-else class="no-lesson">Нет урока</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  days: {
    type: Array,
    default: () => ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
  },
  schedule: {
    type: Array,
    required: true
  },
  timeLabel: {
    type: String,
    default: 'Время'
  }
})

const selectedDayIndex = ref(0)

const getDayShort = (day) => {
  const shorts = {
    'Понедельник': 'Пн',
    'Вторник': 'Вт',
    'Среда': 'Ср',
    'Четверг': 'Чт',
    'Пятница': 'Пт',
    'Суббота': 'Сб',
    'Воскресенье': 'Вс'
  }
  return shorts[day] || day.substring(0, 2)
}
</script>

<style scoped>
.schedule {
  margin: 2rem 0;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

/* Десктопная версия */
.schedule-desktop {
  display: block;
  overflow-x: auto;
  max-width: 100%;
}

.schedule-mobile {
  display: none;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
}

th:first-child {
  border-radius: 8px 0 0 0;
}

th:last-child {
  border-radius: 0 8px 0 0;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

tr:last-child td {
  border-bottom: none;
}

.time {
  font-weight: 600;
  color: #00DC82;
  white-space: nowrap;
}

.lesson-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.lesson-content strong {
  color: #1a1a2e;
  font-size: 0.95rem;
}

.teacher,
.room {
  font-size: 0.85rem;
  color: #666;
}

.empty {
  color: #ccc;
  text-align: center;
}

tbody tr:hover {
  background: #f9f9f9;
}

/* Мобильная версия */
.day-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.day-btn {
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.day-btn:hover {
  border-color: #00DC82;
  color: #00DC82;
}

.day-btn.active {
  background: #00DC82;
  border-color: #00DC82;
  color: white;
}

.day-schedule h3 {
  color: #1a1a2e;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.lesson-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  align-items: flex-start;
}

.lesson-card:last-child {
  border-bottom: none;
}

.lesson-time {
  font-weight: 600;
  color: #00DC82;
  font-size: 0.9rem;
  white-space: nowrap;
  min-width: 80px;
}

.lesson-info {
  flex: 1;
}

.lesson-subject {
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.lesson-teacher {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.lesson-room {
  color: #999;
  font-size: 0.85rem;
}

.no-lesson {
  color: #ccc;
  font-style: italic;
}

/* Планшеты горизонтально - показываем таблицу */
@media (max-width: 1200px) and (min-width: 901px) {
  .schedule {
    padding: 1.5rem;
  }
  
  table {
    min-width: 750px;
  }
  
  th, td {
    padding: 0.875rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .lesson-content strong {
    font-size: 0.9rem;
  }
  
  .teacher,
  .room {
    font-size: 0.8rem;
  }
}

/* Планшеты вертикально - переключаемся на мобильную версию */
@media (max-width: 900px) {
  .schedule {
    padding: 1.5rem;
  }
  
  .schedule-desktop {
    display: none;
  }
  
  .schedule-mobile {
    display: block;
  }
}

/* Мобильные */
@media (max-width: 768px) {
  .schedule {
    padding: 1rem;
    margin: 1rem 0;
  }
  
  .day-schedule h3 {
    font-size: 1.25rem;
  }
  
  .lesson-card {
    padding: 0.875rem;
    gap: 0.875rem;
  }
  
  .lesson-time {
    font-size: 0.85rem;
    min-width: 70px;
  }
  
  .lesson-subject {
    font-size: 0.95rem;
  }
  
  .lesson-teacher {
    font-size: 0.85rem;
  }
  
  .lesson-room {
    font-size: 0.8rem;
  }
  
  .day-btn {
    padding: 0.625rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
