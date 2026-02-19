<template>
  <div class="video-wrapper">
    <h3 v-if="title" class="video-title">{{ title }}</h3>
    <div class="video-container">
      <iframe 
        :src="embedUrl" 
        :title="title || 'Видео'"
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen
      ></iframe>
    </div>
    <p v-if="description" class="video-description">{{ description }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})

const embedUrl = computed(() => {
  const url = props.url
  
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
  
  // Если уже embed ссылка
  return url
})
</script>

<style scoped>
.video-wrapper {
  margin: 2rem 0;
  max-width: 100%;
  overflow: hidden;
}

.video-title {
  margin: 0 0 1rem 0;
  color: #1a1a2e;
  font-size: 1.5rem;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  background: #000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-description {
  margin: 1rem 0 0 0;
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .video-wrapper {
    margin: 1.5rem 0;
  }
  
  .video-title {
    font-size: 1.25rem;
  }
  
  .video-container {
    border-radius: 8px;
  }
}
</style>
