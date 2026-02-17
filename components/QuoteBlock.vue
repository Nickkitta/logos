<template>
  <blockquote class="quote-block" :class="variant">
    <div class="quote-icon">"</div>
    <div class="quote-content">
      <p class="quote-text">{{ text }}</p>
      <cite v-if="author">— {{ author }}</cite>
    </div>
  </blockquote>
</template>

<script setup>
defineProps({
  text: String,
  author: String,
  variant: {
    type: String,
    default: 'default'
  }
})
</script>

<style scoped>
.quote-block {
  background: white;
  padding: 2rem 2rem 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  position: relative;
  border-left: 4px solid #00DC82;
  max-width: 100%;
  overflow-wrap: break-word;
  box-sizing: border-box;
}

.quote-icon {
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-size: 4rem;
  color: #00DC82;
  opacity: 0.3;
  line-height: 1;
}

.quote-content {
  position: relative;
  z-index: 1;
}

.quote-text {
  font-size: 1.25rem;
  font-style: italic;
  color: #1a1a2e;
  margin-bottom: 1rem;
  line-height: 1.6;
  word-wrap: break-word;
}

cite {
  display: block;
  color: #666;
  font-style: normal;
  font-weight: 600;
  text-align: right;
  word-wrap: break-word;
}

.quote-block.centered {
  text-align: center;
  border-left: none;
  border-top: 4px solid #00DC82;
  padding: 3rem 2rem 2rem;
}

.quote-block.centered .quote-icon {
  left: 50%;
  transform: translateX(-50%);
}

.quote-block.centered cite {
  text-align: center;
}

.quote-block.accent {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-left-color: white;
}

.quote-block.accent .quote-text,
.quote-block.accent cite {
  color: white;
}

.quote-block.accent .quote-icon {
  color: white;
}

@media (max-width: 768px) {
  .quote-block {
    padding: 1.5rem 1.5rem 1.5rem 2.5rem;
  }
  
  .quote-icon {
    font-size: 3rem;
    left: 0.5rem;
  }
  
  .quote-text {
    font-size: 1rem;
  }
  
  cite {
    font-size: 0.9rem;
  }
  
  .quote-block.centered {
    padding: 2.5rem 1.5rem 1.5rem;
  }
}
</style>
