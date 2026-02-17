<template>
  <div class="text-block" :class="variant">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default'
  }
})
</script>

<style scoped>
.text-block {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  line-height: 1.8;
  color: #333;
  max-width: 100%;
  overflow-wrap: break-word;
  box-sizing: border-box;
}

.text-block :deep(p) {
  margin-bottom: 1rem;
}

.text-block :deep(p:last-child) {
  margin-bottom: 0;
}

.text-block :deep(ul),
.text-block :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.text-block :deep(li) {
  margin-bottom: 0.5rem;
}

.text-block.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.text-block.bordered {
  border: 2px solid #00DC82;
}

@media (max-width: 768px) {
  .text-block {
    padding: 1.5rem;
    font-size: 0.95rem;
  }
}
</style>
