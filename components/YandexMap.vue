<template>
  <div class="map-container">
    <div 
      class="map-preview" 
      :class="{ hidden: isExpanded }"
      @click="expandMap"
    >
      <div id="map" class="map"></div>
      <div class="map-overlay">
        <Icon name="search" size="large" />
        <p>Нажмите для увеличения</p>
      </div>
    </div>

    <div v-if="isExpanded">
      <Teleport to="body">
        <div class="map-modal" @click="closeMap">
          <div class="map-modal-content" @click.stop>
            <button class="close-btn" @click="closeMap">
              <Icon name="cross" size="medium" />
            </button>
            <div id="map-expanded" class="map-expanded"></div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  address: {
    type: String,
    default: 'Москва, ул. Школьная, д. 15'
  },
  coordinates: {
    type: Array,
    default: () => [55.751244, 37.618423] // Координаты Москвы по умолчанию
  },
  zoom: {
    type: Number,
    default: 16
  }
})

const config = useRuntimeConfig()
const isExpanded = ref(false)
let mapInstance = null
let mapExpandedInstance = null

const initMap = (containerId, coords, zoom) => {
  if (typeof window === 'undefined' || !window.ymaps) return null

  const map = new window.ymaps.Map(containerId, {
    center: coords,
    zoom: zoom,
    controls: ['zoomControl']
  })

  // Добавляем метку
  const placemark = new window.ymaps.Placemark(coords, {
    balloonContent: props.address,
    hintContent: props.address
  }, {
    preset: 'islands#redSchoolIcon'
  })

  map.geoObjects.add(placemark)
  
  return map
}

const loadYandexMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.ymaps) {
      resolve()
      return
    }

    const script = document.createElement('script')
    const apiKey = config.public.yandexMapsKey
    
    // Используем ключ из .env если он есть
    if (apiKey) {
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`
      console.log('Загрузка Яндекс.Карт с API ключом')
    } else {
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'
      console.warn('Яндекс.Карты загружаются без API ключа')
    }
    
    script.async = true
    script.onload = () => {
      window.ymaps.ready(() => resolve())
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const expandMap = () => {
  isExpanded.value = true
  setTimeout(() => {
    if (!mapExpandedInstance && document.getElementById('map-expanded')) {
      mapExpandedInstance = initMap('map-expanded', props.coordinates, props.zoom)
    }
  }, 100)
}

const closeMap = () => {
  // Уничтожаем карту перед закрытием
  if (mapExpandedInstance) {
    try {
      mapExpandedInstance.destroy()
    } catch (e) {
      // Игнорируем ошибки при уничтожении
    }
    mapExpandedInstance = null
  }
  isExpanded.value = false
}

onMounted(async () => {
  try {
    console.log('Яндекс.Карты - проверка ключа:', {
      hasKey: !!config.public.yandexMapsKey,
      keyLength: config.public.yandexMapsKey?.length,
      keyPreview: config.public.yandexMapsKey ? config.public.yandexMapsKey.substring(0, 10) + '...' : 'нет ключа'
    })
    
    await loadYandexMaps()
    
    // Проверяем что элемент существует перед инициализацией
    if (document.getElementById('map')) {
      mapInstance = initMap('map', props.coordinates, props.zoom)
    }
  } catch (error) {
    console.error('Ошибка загрузки карты:', error)
  }
})

// Очистка при размонтировании компонента
onUnmounted(() => {
  if (mapInstance) {
    try {
      mapInstance.destroy()
    } catch (e) {
      // Игнорируем ошибки
    }
  }
  if (mapExpandedInstance) {
    try {
      mapExpandedInstance.destroy()
    } catch (e) {
      // Игнорируем ошибки
    }
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.map-preview {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: #f5f5f5;
  transition: opacity 0.3s ease;
}

.map-preview.hidden {
  opacity: 0;
  pointer-events: none;
  position: absolute;
}

.map {
  width: 100%;
  height: 100%;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}

.map-preview:hover .map-overlay {
  background: rgba(0, 0, 0, 0.5);
  opacity: 1;
}

.map-overlay p {
  color: white;
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.map-overlay :deep(.icon) {
  color: white;
  font-size: 3rem;
}

.map-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.map-modal-content {
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 80vh;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.map-expanded {
  width: 100%;
  height: 100%;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  width: 40px;
  height: 40px;
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #ff4757;
  transform: scale(1.1);
}

.close-btn:hover :deep(.icon) {
  color: white;
}

@media (max-width: 768px) {
  .map-preview {
    height: 250px;
  }
  
  .map-modal {
    padding: 1rem;
  }
  
  .map-modal-content {
    height: 90vh;
  }
}

@media (max-width: 1024px) and (min-width: 769px) {
  .map-preview {
    height: 280px;
  }
  
  .map-modal {
    padding: 1.5rem;
  }
  
  .map-modal-content {
    height: 85vh;
  }
}
</style>
