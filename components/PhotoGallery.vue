<template>
  <div class="photo-gallery">
    <div class="gallery-main">
      <button class="nav-btn prev" @click="prevImage" :disabled="currentIndex === 0">
        ‹
      </button>
      <div class="main-image">
        <img :src="images[currentIndex].src" :alt="images[currentIndex].alt" />
        <div v-if="images[currentIndex].caption" class="caption">
          {{ images[currentIndex].caption }}
        </div>
      </div>
      <button class="nav-btn next" @click="nextImage" :disabled="currentIndex === images.length - 1">
        ›
      </button>
    </div>
    <div class="thumbnails">
      <div 
        v-for="(image, index) in images" 
        :key="index"
        class="thumbnail"
        :class="{ active: index === currentIndex }"
        @click="currentIndex = index"
      >
        <img :src="image.src" :alt="image.alt" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true
  }
})

const currentIndex = ref(0)

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  }
}

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
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
}

.main-image img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;
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
  
  .main-image img {
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
}
</style>
