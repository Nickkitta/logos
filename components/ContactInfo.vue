<template>
  <div class="contact-info">
    <div v-for="item in contacts" :key="item.label" class="contact-item">
      <div class="icon-wrapper">
        <Icon :name="item.icon" size="large" />
      </div>
      <div class="contact-details">
        <strong>{{ item.label }}</strong>
        <p>{{ item.value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  contacts: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.contact-info {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0;
  max-width: 100%;
  width: 100%;
  height: fit-content;
  box-sizing: border-box;
}

.contact-item {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  min-height: 80px;
}

.contact-item:last-child {
  border-bottom: none;
}

.icon-wrapper {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-details {
  flex: 1;
  min-width: 0;
}

.contact-details strong {
  display: block;
  color: #1a1a2e;
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
}

.contact-details p {
  color: #666;
  margin: 0;
  word-wrap: break-word;
}

@media (max-width: 768px) {
  .contact-info {
    padding: 1rem;
  }
  
  .contact-item {
    padding: 1rem;
    gap: 1rem;
  }
  
  .icon-wrapper :deep(.icon) {
    font-size: 1.5rem;
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .contact-details strong {
    font-size: 1rem;
  }
  
  .contact-details p {
    font-size: 0.9rem;
  }
}

@media (max-width: 1024px) and (min-width: 769px) {
  .contact-info {
    padding: 1.75rem;
  }
  
  .contact-item {
    padding: 1.25rem;
    gap: 1.25rem;
    min-height: 75px;
  }
  
  .icon-wrapper :deep(.icon) {
    font-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }
  
  .contact-details strong {
    font-size: 1rem;
  }
  
  .contact-details p {
    font-size: 0.95rem;
  }
}
</style>
