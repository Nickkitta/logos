<template>
  <component :is="level" class="section-heading" :class="variant">
    {{ text }}
  </component>
</template>

<script setup>
defineProps({
  text: String,
  level: {
    type: String,
    default: 'h2'
  },
  variant: {
    type: String,
    default: 'default'
  }
})
</script>

<style scoped>
.section-heading {
  color: #1a1a2e;
  margin: 2rem 0 1.5rem;
  font-weight: 600;
  word-wrap: break-word;
  max-width: 100%;
  box-sizing: border-box;
}

h2.section-heading {
  font-size: 2rem;
  padding-left: 1rem;
  border-left: 4px solid #00DC82;
}

h3.section-heading {
  font-size: 1.5rem;
}

.section-heading.accent {
  color: #00DC82;
}

.section-heading.centered {
  text-align: center;
  border: none;
  padding: 0;
}

@media (max-width: 768px) {
  h2.section-heading {
    font-size: 1.5rem;
    padding-left: 0.75rem;
  }
  
  h3.section-heading {
    font-size: 1.25rem;
  }
}
</style>
