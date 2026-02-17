<template>
  <div class="info-card" :class="variant">
    <div v-if="icon" class="icon-wrapper">
      <Icon :name="icon" size="xlarge" />
    </div>
    <div class="content">
      <h3 v-if="title">{{ title }}</h3>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  icon: String,
  variant: {
    type: String,
    default: 'default'
  }
})
</script>

<style scoped>
.info-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  transition: transform 0.3s ease;
  max-width: 100%;
  box-sizing: border-box;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.icon-wrapper {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  flex: 1;
  min-width: 0;
}

h3 {
  color: #1a1a2e;
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
  word-wrap: break-word;
}

.info-card :deep(p) {
  color: #666;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  word-wrap: break-word;
}

.info-card.accent {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.info-card.accent h3,
.info-card.accent :deep(p) {
  color: white;
}

.info-card.bordered {
  border: 2px solid #00DC82;
}

@media (max-width: 768px) {
  .info-card {
    padding: 1.5rem;
    gap: 1rem;
  }
  
  .icon-wrapper :deep(.icon) {
    font-size: 2rem;
    width: 2rem;
    height: 2rem;
  }
  
  h3 {
    font-size: 1.25rem;
  }
}
</style>
