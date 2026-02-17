<template>
  <div class="page-title">
    <h1>{{ title }}</h1>
    <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String
})
</script>

<style scoped>
.page-title {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 3px solid #00DC82;
  max-width: 100%;
  box-sizing: border-box;
}

h1 {
  color: #1a1a2e;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.subtitle {
  color: #666;
  font-size: 1.25rem;
  margin: 0;
}

@media (max-width: 768px) {
  .page-title {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}
</style>
