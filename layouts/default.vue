<template>
  <div class="layout">
    <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
      <span v-if="!mobileMenuOpen">☰</span>
      <span v-else>✕</span>
    </button>
    
    <aside class="sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
      <div class="logo">
        <h2>Центр Логос</h2>
      </div>
      <nav class="nav">
        <NuxtLink 
          v-for="page in pages" 
          :key="page.path" 
          :to="page.path"
          class="nav-link"
          active-class="active"
          @click="mobileMenuOpen = false"
        >
          {{ page.title }}
        </NuxtLink>
      </nav>
    </aside>
    
    <div class="overlay" :class="{ 'visible': mobileMenuOpen }" @click="mobileMenuOpen = false"></div>
    
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mobileMenuOpen = ref(false)
const pages = ref([])

const { loadPages } = useContent()

onMounted(async () => {
  const allPages = await loadPages(true) // Только видимые страницы
  pages.value = allPages
})
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1001;
  width: 50px;
  height: 50px;
  background: #00DC82;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background: #00b86f;
  transform: scale(1.05);
}

.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  padding: 2rem 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  transition: transform 0.3s ease;
  z-index: 1000;
}

.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(0, 220, 130, 0.3);
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 220, 130, 0.5);
}

.logo {
  padding: 0 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
}

.logo h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #00DC82;
}

.nav {
  display: flex;
  flex-direction: column;
}

.nav-link {
  padding: 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background: rgba(0, 220, 130, 0.1);
  color: white;
  border-left-color: #00DC82;
}

.nav-link.active {
  background: rgba(0, 220, 130, 0.15);
  color: #00DC82;
  border-left-color: #00DC82;
  font-weight: 600;
}

.overlay {
  display: none;
}

.content {
  margin-left: 250px;
  flex: 1;
  padding: 2rem;
  background: #f5f5f5;
  min-height: 100vh;
  overflow-x: hidden;
  width: calc(100vw - 250px);
  max-width: calc(100vw - 250px);
  box-sizing: border-box;
}

/* Tablet */
@media (max-width: 1024px) {
  .content {
    padding: 1.5rem;
    width: calc(100vw - 250px);
    max-width: calc(100vw - 250px);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
  }
  
  .overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  
  .overlay.visible {
    opacity: 1;
    pointer-events: all;
  }
  
  .content {
    margin-left: 0;
    padding: 1rem;
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
  }
  
  .logo h2 {
    font-size: 1.25rem;
  }
}
</style>
