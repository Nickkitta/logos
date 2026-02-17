<template>
  <span class="icon" :class="[size, variant]" :style="customStyle">
    <img v-if="isCustomIcon" :src="iconPath" :alt="name" />
    <span v-else>{{ emoji }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'xlarge'].includes(value)
  },
  variant: {
    type: String,
    default: 'default'
  },
  color: String
})

// Встроенные emoji иконки
const emojiIcons = {
  // Образование
  'book': '📚',
  'pencil': '✏️',
  'graduation': '🎓',
  'school': '🏫',
  'teacher': '👨‍🏫',
  'student': '👨‍🎓',
  'backpack': '🎒',
  'notebook': '📓',
  'ruler': '📏',
  'calculator': '🧮',
  
  // Коммуникация
  'phone': '📞',
  'email': '📧',
  'location': '📍',
  'clock': '🕐',
  'calendar': '📅',
  'bell': '🔔',
  'megaphone': '📢',
  
  // Действия
  'check': '✓',
  'cross': '✕',
  'star': '⭐',
  'heart': '❤️',
  'trophy': '🏆',
  'medal': '🏅',
  'flag': '🚩',
  
  // Навигация
  'home': '🏠',
  'menu': '☰',
  'search': '🔍',
  'settings': '⚙️',
  'info': 'ℹ️',
  'warning': '⚠️',
  'error': '❌',
  'success': '✅',
  
  // Спорт и активности
  'sport': '⚽',
  'basketball': '🏀',
  'music': '🎵',
  'art': '🎨',
  'science': '🔬',
  'computer': '💻',
  'globe': '🌍',
  
  // Транспорт
  'bus': '🚌',
  'car': '🚗',
  'bike': '🚲',
  
  // Разное
  'fire': '🔥',
  'light': '💡',
  'gift': '🎁',
  'camera': '📷',
  'image': '🖼️',
  'folder': '📁',
  'document': '📄'
}

const isCustomIcon = computed(() => {
  return !emojiIcons[props.name]
})

const emoji = computed(() => {
  return emojiIcons[props.name] || '❓'
})

const iconPath = computed(() => {
  return `/icons/${props.name}.svg`
})

const customStyle = computed(() => {
  if (props.color) {
    return { color: props.color }
  }
  return {}
})
</script>

<style scoped>
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Размеры */
.icon.small {
  font-size: 1rem;
  width: 1rem;
  height: 1rem;
}

.icon.medium {
  font-size: 1.5rem;
  width: 1.5rem;
  height: 1.5rem;
}

.icon.large {
  font-size: 2rem;
  width: 2rem;
  height: 2rem;
}

.icon.xlarge {
  font-size: 3rem;
  width: 3rem;
  height: 3rem;
}

/* Варианты */
.icon.primary {
  color: #00DC82;
}

.icon.secondary {
  color: #667eea;
}

.icon.danger {
  color: #ff4757;
}

.icon.warning {
  color: #ffa502;
}

.icon.success {
  color: #00DC82;
}

.icon.muted {
  color: #999;
}
</style>
