<template>
  <figure class="image-with-caption" :class="size">
    <div class="image-wrapper" @click="openLightbox">
      <img :src="src" :alt="alt" />
      <div class="zoom-hint">🔍 Нажмите для увеличения</div>
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
    
    <!-- Лайтбокс -->
    <MediaLightbox
      :isOpen="lightboxOpen"
      type="image"
      :src="src"
      :alt="alt"
      :caption="caption"
      @close="lightboxOpen = false"
    />
  </figure>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  src: String,
  alt: String,
  caption: String,
  size: {
    type: String,
    default: 'medium'
  }
})

const lightboxOpen = ref(false)

const openLightbox = () => {
  lightboxOpen.value = true
}
</script>

<style scoped>
.image-with-caption {
  margin: 2rem 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  box-sizing: border-box;
}

.image-wrapper {
  overflow: hidden;
  background: #f5f5f5;
  width: 100%;
  height: 400px;
  position: relative;
  cursor: zoom-in;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
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

.image-wrapper:hover .zoom-hint {
  opacity: 1;
}

.image-with-caption:hover img {
  transform: scale(1.05);
}

figcaption {
  padding: 1.5rem;
  color: #666;
  font-style: italic;
  text-align: center;
  background: white;
  word-wrap: break-word;
}

.image-with-caption.small {
  max-width: 400px;
}

.image-with-caption.small .image-wrapper {
  height: 300px;
}

.image-with-caption.medium {
  max-width: 700px;
}

.image-with-caption.medium .image-wrapper {
  height: 400px;
}

.image-with-caption.large {
  max-width: 100%;
}

.image-with-caption.large .image-wrapper {
  height: 500px;
}

@media (max-width: 768px) {
  .image-with-caption {
    margin: 1rem 0;
  }
  
  .image-with-caption.small,
  .image-with-caption.medium {
    max-width: 100%;
  }
  
  .image-wrapper {
    height: 250px !important;
  }
  
  figcaption {
    padding: 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 1024px) and (min-width: 769px) {
  .image-wrapper {
    height: 350px !important;
  }
  
  figcaption {
    padding: 1.25rem;
    font-size: 0.95rem;
  }
}
</style>
