<template>
  <div class="page-layout">
    <slot />
  </div>
</template>

<style scoped>
.page-layout {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.page-layout :deep(> *) {
  margin-bottom: 2rem;
  max-width: 100%;
  box-sizing: border-box;
}

.page-layout :deep(> *:last-child) {
  margin-bottom: 0;
}

/* Средние экраны - уменьшаем max-width для лучшей адаптации */
@media (max-width: 1200px) and (min-width: 769px) {
  .page-layout {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .page-layout {
    max-width: 100%;
    width: 100%;
  }
  
  .page-layout :deep(> *) {
    margin-bottom: 1.5rem;
    max-width: 100%;
  }
}
</style>
