<template>
  <div class="document-viewer">
    <!-- Встроенный просмотр -->
    <div v-if="viewType === 'embed'" class="document-embed">
      <h3 v-if="title" class="document-title">{{ title }}</h3>
      <div class="embed-container">
        <iframe :src="embedUrl" frameborder="0"></iframe>
      </div>
      <a :href="downloadUrl" target="_blank" class="download-link">
        📥 Скачать документ
      </a>
    </div>
    
    <!-- Ссылка для скачивания -->
    <a v-else :href="downloadUrl" target="_blank" class="document-link">
      <div class="document-icon">
        📄
      </div>
      <div class="document-info">
        <strong class="document-name">{{ title }}</strong>
        <span v-if="size" class="document-size">{{ size }}</span>
        <span v-if="description" class="document-description">{{ description }}</span>
      </div>
      <div class="download-icon">⬇️</div>
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  viewType: {
    type: String,
    default: 'link', // 'link' или 'embed'
    validator: (value) => ['link', 'embed'].includes(value)
  },
  downloadName: {
    type: String,
    default: ''
  }
})

const embedUrl = computed(() => {
  const url = props.url
  
  // Google Drive
  if (url.includes('drive.google.com')) {
    const fileId = url.match(/\/d\/([^/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1]
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`
    }
  }
  
  // Яндекс.Диск
  if (url.includes('disk.yandex')) {
    return url
  }
  
  // Прямая ссылка на PDF
  if (url.toLowerCase().endsWith('.pdf')) {
    return url
  }
  
  return url
})

const downloadUrl = computed(() => {
  const url = props.url
  
  // Google Drive - специальная ссылка для скачивания
  if (url.includes('drive.google.com')) {
    const fileId = url.match(/\/d\/([^/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1]
    if (fileId) {
      return `https://drive.google.com/uc?export=download&id=${fileId}`
    }
  }
  
  // Яндекс.Диск - добавляем параметр для скачивания
  if (url.includes('disk.yandex')) {
    // Если это публичная ссылка, добавляем /download
    if (url.includes('/d/')) {
      return url.replace('/d/', '/d/') + '?download=1'
    }
    return url
  }
  
  // Для остальных - просто возвращаем URL
  return url
})
</script>

<style scoped>
.document-viewer {
  margin: 2rem 0;
  max-width: 100%;
}

/* Встроенный просмотр */
.document-embed {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.document-title {
  margin: 0 0 1rem 0;
  color: #1a1a2e;
  font-size: 1.5rem;
}

.embed-container {
  width: 100%;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  margin-bottom: 1rem;
}

.embed-container iframe {
  width: 100%;
  height: 100%;
}

.download-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #00DC82;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;
}

.download-link:hover {
  background: #00b86f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 220, 130, 0.3);
}

/* Ссылка для скачивания */
.document-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.document-link:hover {
  border-color: #00DC82;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 220, 130, 0.2);
}

.document-icon {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  font-size: 2rem;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.document-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.document-name {
  font-size: 1.1rem;
  color: #1a1a2e;
  word-break: break-word;
}

.document-size {
  font-size: 0.85rem;
  color: #999;
}

.document-description {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
}

.download-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .document-viewer {
    margin: 1.5rem 0;
  }
  
  .document-embed {
    padding: 1rem;
  }
  
  .embed-container {
    height: 400px;
  }
  
  .document-title {
    font-size: 1.25rem;
  }
  
  .document-link {
    padding: 1rem;
  }
  
  .document-icon {
    width: 48px;
    height: 48px;
    font-size: 1.75rem;
  }
  
  .document-name {
    font-size: 1rem;
  }
}
</style>
