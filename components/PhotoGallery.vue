<template>
  <div class="photo-gallery">
    <div class="gallery-main">
      <button class="nav-btn prev" @click="prevImage" :disabled="currentIndex === 0">
        ‹
      </button>
      <div class="main-image" @click="openLightbox">
        <!-- Видео -->
        <div v-if="items[currentIndex].type === 'video'" class="video-container">
          <iframe 
            :src="getVideoEmbedUrl(items[currentIndex].src)" 
            :title="items[currentIndex].alt"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
          ></iframe>
          <div class="zoom-hint">🔍 Нажмите для полноэкранного просмотра</div>
        </div>
        <!-- Изображение -->
        <div v-else class="image-wrapper">
          <img :src="items[currentIndex].src" :alt="items[currentIndex].alt" />
          <div class="zoom-hint">🔍 Нажмите для увеличения</div>
        </div>
        
        <div v-if="items[currentIndex].caption" class="caption">
          {{ items[currentIndex].caption }}
        </div>
      </div>
      <button class="nav-btn next" @click="nextImage" :disabled="currentIndex === items.length - 1">
        ›
      </button>
    </div>
    <div class="thumbnails">
      <div 
        v-for="(item, index) in items" 
        :key="index"
        class="thumbnail"
        :class="{ active: index === currentIndex }"
        @click="currentIndex = index"
      >
        <!-- Превью видео -->
        <div v-if="item.type === 'video'" class="video-thumbnail">
          <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.alt" />
          <div v-else class="video-placeholder">
            <span class="play-icon">▶️</span>
          </div>
        </div>
        <!-- Превью изображения -->
        <img v-else :src="item.src" :alt="item.alt" />
      </div>
    </div>
    
    <!-- Лайтбокс -->
    <MediaLightbox
      :isOpen="lightboxOpen"
      :type="items[currentIndex]?.type || 'image'"
      :src="items[currentIndex]?.src"
      :alt="items[currentIndex]?.alt"
      :caption="items[currentIndex]?.caption"
      :hasPrev="currentIndex > 0"
      :hasNext="currentIndex < items.length - 1"
      @close="lightboxOpen = false"
      @prev="prevImage"
      @next="nextImage"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    // items: [
    //   { type: 'image', src: '...', alt: '...', caption: '...' },
    //   { type: 'video', src: 'youtube_url', alt: '...', caption: '...', thumbnail: '...' }
    // ]
  }
})

const currentIndex = ref(0)
const lightboxOpen = ref(false)

const nextImage = () => {
  if (currentIndex.value < props.items.length - 1) {
    currentIndex.value++
  }
}

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const openLightbox = () => {
  lightboxOpen.value = true
}

const getVideoEmbedUrl = (url) => {
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
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  // VK Video (новый формат vkvideo.ru и старый vk.com)
  if (url.includes('vkvideo.ru') || url.includes('vk.com/video')) {
    // Новый формат: https://vkvideo.ru/video-12345_67890
    if (url.includes('vkvideo.ru/video')) {
      const match = url.match(/video(-?\d+_\d+)/)
      if (match) {
        const [oid, id] = match[1].split('_')
        return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2`
      }
    }
    // Старый формат: https://vk.com/video-12345_67890
    else if (url.includes('vk.com/video')) {
      const match = url.match(/video(-?\d+_\d+)/)
      if (match) {
        const [oid, id] = match[1].split('_')
        return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2`
      }
    }
  }
  
  // Rutube
  if (url.includes('rutube.ru')) {
    const videoId = url.match(/video\/([^/?]+)/)?.[1]
    if (videoId) {
      return `https://rutube.ru/play/embed/${videoId}`
    }
  }
  
  return url
}
</script>

<style scoped>
.photo-gallery {
  margin: 2rem 0;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.gallery-main {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.main-image {
  flex: 1;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  cursor: zoom-in;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-wrapper img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;
}

.zoom-hint {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.main-image:hover .zoom-hint {
  opacity: 1;
}

.main-image img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;
}

.video-container {
  position: relative;
  width: 100%;
  height: 500px;
  background: #000;
}

.video-container iframe {
  width: 100%;
  height: 100%;
}

.video-thumbnail {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.play-icon {
  font-size: 2rem;
}

.caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 2rem 1.5rem 1rem;
  font-size: 1rem;
}

.nav-btn {
  width: 50px;
  height: 50px;
  border: none;
  background: #00DC82;
  color: white;
  font-size: 2rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.nav-btn:hover:not(:disabled) {
  background: #00b86f;
  transform: scale(1.1);
}

.nav-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.5;
}

.thumbnails {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.thumbnail {
  width: 100px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.thumbnail:hover {
  border-color: #00DC82;
}

.thumbnail.active {
  border-color: #00DC82;
  box-shadow: 0 0 0 2px rgba(0, 220, 130, 0.3);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

  @media (max-width: 768px) {
  .photo-gallery {
    padding: 1rem;
    margin: 1rem 0;
  }
  
  .main-image img,
  .video-container {
    height: 300px;
  }
  
  .caption {
    padding: 1.5rem 1rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .nav-btn {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
  
  .thumbnail {
    width: 80px;
    height: 60px;
  }
  
  .play-icon {
    font-size: 1.5rem;
  }
}
</style>
