<template>
  <figure class="image-with-caption" :class="size">
    <div class="image-wrapper">
      <img :src="src" :alt="alt" />
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<script setup>
defineProps({
  src: String,
  alt: String,
  caption: String,
  size: {
    type: String,
    default: 'medium'
  }
})
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
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
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
