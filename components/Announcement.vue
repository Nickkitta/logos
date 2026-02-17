<template>
  <div class="announcement" :class="type">
    <div class="announcement-header">
      <div class="icon-wrapper">
        <Icon :name="icon" size="large" />
      </div>
      <h3>{{ title }}</h3>
      <span v-if="date" class="date">{{ date }}</span>
    </div>
    <div class="announcement-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  date: String,
  icon: {
    type: String,
    default: 'megaphone'
  },
  type: {
    type: String,
    default: 'default'
  }
})
</script>

<style scoped>
.announcement {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  border-left: 4px solid #00DC82;
  max-width: 100%;
  overflow-wrap: break-word;
  box-sizing: border-box;
}

.announcement-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
  flex-wrap: wrap;
}

.icon-wrapper {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

h3 {
  flex: 1;
  color: #1a1a2e;
  margin: 0;
  font-size: 1.5rem;
  min-width: 0;
  word-wrap: break-word;
}

.date {
  color: #999;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.announcement-content :deep(p) {
  color: #666;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  word-wrap: break-word;
}

.announcement.important {
  border-left-color: #ff4757;
  background: #fff5f5;
}

.announcement.success {
  border-left-color: #00DC82;
  background: #f0fff4;
}

.announcement.info {
  border-left-color: #3742fa;
  background: #f0f5ff;
}

@media (max-width: 768px) {
  .announcement {
    padding: 1.5rem;
    margin: 1.5rem 0;
  }
  
  .announcement-header {
    gap: 0.75rem;
  }
  
  .icon-wrapper :deep(.icon) {
    font-size: 1.5rem;
    width: 1.5rem;
    height: 1.5rem;
  }
  
  h3 {
    font-size: 1.25rem;
    width: 100%;
  }
  
  .date {
    font-size: 0.85rem;
    width: 100%;
  }
}
</style>
