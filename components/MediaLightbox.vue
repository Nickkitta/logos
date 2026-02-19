<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="isOpen" class="lightbox-overlay" @click="close">
        <button class="lightbox-close" @click="close" title="Закрыть (Esc)">✕</button>
        
        <div class="lightbox-content" @click.stop>
          <!-- Изображение -->
          <img 
            v-if="type === 'image'" 
            :src="src" 
            :alt="alt"
            class="lightbox-image"
          />
          
          <!-- Видео -->
          <div v-else-if="type === 'video'" class="lightbox-video">
            <iframe 
              :src="embedUrl" 
              :title="alt"
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </div>
          
          <!-- Подпись -->
          <div v-if="caption" class="lightbox-caption">
            {{ caption }}
          </div>
        </div>
        
        <!-- Навигация для галереи -->
        <button 
          v-if="hasPrev" 
          class="lightbox-nav lightbox-prev" 
          @click.stop="$emit('prev')"
          title="Предыдущее (←)"
        >
          ‹
        </button>
        <button 
          v-if="hasNext" 
          class="lightbox-nav lightbox-next" 
          @click.stop="$emit('next')"
          title="Следующее (→)"
        >
          ›
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  type: String, // 'image' или 'video'
  src: String,
  alt: String,
  caption: String,
  hasPrev: Boolean,
  hasNext: Boolean
})

const emit = defineEmits(['close', 'prev', 'next'])

const embedUrl = computed(() => {
  if (props.type !== 'video') return ''
  
  const url = props.src
  
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = ''
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0]
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0]
    } else if (url.includes('embed/')) {
      return url
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`
  }
  
  // VK Video
  if (url.includes('vkvideo.ru') || url.includes('vk.com/video')) {
    if (url.includes('vkvideo.ru/video')) {
      const match = url.match(/video(-?\d+_\d+)/)
      if (match) {
        const [oid, id] = match[1].split('_')
        return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2&autoplay=1`
      }
    } else if (url.includes('vk.com/video')) {
      const match = url.match(/video(-?\d+_\d+)/)
      if (match) {
        const [oid, id] = match[1].split('_')
        return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2&autoplay=1`
      }
    }
  }
  
  // Rutube
  if (url.includes('rutube.ru')) {
    const videoId = url.match(/video\/([^/?]+)/)?.[1]
    if (videoId) {
      return `https://rutube.ru/play/embed/${videoId}?autoplay=1`
    }
  }
  
  return url
})

const close = () => {
  emit('close')
}

// Обработка клавиш
const handleKeydown = (e) => {
  if (!props.isOpen) return
  
  if (e.key === 'Escape') {
    close()
  } else if (e.key === 'ArrowLeft' && props.hasPrev) {
    emit('prev')
  } else if (e.key === 'ArrowRight' && props.hasNext) {
    emit('next')
  }
}

// Блокировка скролла при открытии
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: zoom-out;
}

.lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: default;
}

.lightbox-image {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.lightbox-video {
  width: 90vw;
  max-width: 1200px;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.lightbox-video iframe {
  width: 100%;
  height: 100%;
}

.lightbox-caption {
  margin-top: 1.5rem;
  color: white;
  font-size: 1.1rem;
  text-align: center;
  max-width: 800px;
  line-height: 1.6;
}

.lightbox-close {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.lightbox-nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
}

.lightbox-prev {
  left: 2rem;
}

.lightbox-next {
  right: 2rem;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

/* Анимации */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-enter-active .lightbox-content,
.lightbox-leave-active .lightbox-content {
  transition: transform 0.3s ease;
}

.lightbox-enter-from .lightbox-content,
.lightbox-leave-to .lightbox-content {
  transform: scale(0.9);
}

/* Мобильные устройства */
@media (max-width: 768px) {
  .lightbox-overlay {
    padding: 1rem;
  }
  
  .lightbox-close {
    top: 1rem;
    right: 1rem;
    width: 44px;
    height: 44px;
    font-size: 1.25rem;
  }
  
  .lightbox-nav {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
  
  .lightbox-prev {
    left: 1rem;
  }
  
  .lightbox-next {
    right: 1rem;
  }
  
  .lightbox-caption {
    font-size: 1rem;
    margin-top: 1rem;
  }
  
  .lightbox-video {
    width: 95vw;
  }
}
</style>
