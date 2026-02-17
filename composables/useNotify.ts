// Composable для уведомлений

// Функция для добавления стилей (вызывается один раз)
const ensureStyles = () => {
  if (document.getElementById('notification-styles')) {
    return
  }
  
  const style = document.createElement('style')
  style.id = 'notification-styles'
  style.textContent = `
    .notification {
      position: fixed;
      top: 2rem;
      right: 2rem;
      padding: 1rem 3rem 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      max-width: 400px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
    
    .notification-content {
      flex: 1;
    }
    
    .notification-close {
      position: absolute;
      top: 50%;
      right: 0.75rem;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: inherit;
      font-size: 1.25rem;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .notification-close:hover {
      opacity: 1;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .notification-success {
      background: #00DC82;
      color: white;
    }
    
    .notification-error {
      background: #ff4757;
      color: white;
    }
    
    .notification-info {
      background: #3742fa;
      color: white;
    }
    
    .notification-warning {
      background: #ffa502;
      color: white;
    }
    
    .confirm-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      animation: fadeIn 0.2s ease-out;
    }
    
    .confirm-dialog {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      animation: scaleIn 0.2s ease-out;
    }
    
    .confirm-message {
      margin-bottom: 1.5rem;
      color: #333;
      line-height: 1.5;
      font-size: 1rem;
    }
    
    .confirm-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
    
    .confirm-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1rem;
    }
    
    .confirm-btn-cancel {
      background: #e0e0e0;
      color: #333;
    }
    
    .confirm-btn-cancel:hover {
      background: #d0d0d0;
    }
    
    .confirm-btn-confirm {
      background: #ff4757;
      color: white;
    }
    
    .confirm-btn-confirm:hover {
      background: #ff3838;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes scaleIn {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    
    @media (max-width: 768px) {
      .notification {
        top: 1rem;
        right: 1rem;
        left: 1rem;
        max-width: none;
      }
      
      .confirm-dialog {
        padding: 1.5rem;
      }
      
      .confirm-btn {
        padding: 0.65rem 1.25rem;
        font-size: 0.95rem;
      }
    }
  `
  document.head.appendChild(style)
}

export const useNotify = () => {
  const notify = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 5000) => {
    ensureStyles()
    
    // Создаем элемент уведомления
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    
    // Создаем контент
    const content = document.createElement('span')
    content.className = 'notification-content'
    content.textContent = message
    
    // Создаем кнопку закрытия
    const closeBtn = document.createElement('button')
    closeBtn.className = 'notification-close'
    closeBtn.innerHTML = '✕'
    closeBtn.onclick = () => removeNotification(notification)
    
    notification.appendChild(content)
    notification.appendChild(closeBtn)
    
    // Добавляем на страницу
    document.body.appendChild(notification)
    
    // Функция удаления уведомления
    const removeNotification = (element: HTMLElement) => {
      element.style.animation = 'slideOut 0.3s ease-out'
      setTimeout(() => {
        if (element.parentNode) {
          document.body.removeChild(element)
        }
      }, 300)
    }
    
    // Автоматически удаляем через указанное время
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notification)
      }, duration)
    }
  }
  
  const confirm = (message: string): Promise<boolean> => {
    ensureStyles()
    
    return new Promise((resolve) => {
      // Создаем модальное окно
      const modal = document.createElement('div')
      modal.className = 'confirm-modal'
      
      const dialog = document.createElement('div')
      dialog.className = 'confirm-dialog'
      
      const messageEl = document.createElement('div')
      messageEl.className = 'confirm-message'
      messageEl.textContent = message
      
      const actions = document.createElement('div')
      actions.className = 'confirm-actions'
      
      const cancelBtn = document.createElement('button')
      cancelBtn.className = 'confirm-btn confirm-btn-cancel'
      cancelBtn.textContent = 'Отмена'
      cancelBtn.onclick = () => {
        document.body.removeChild(modal)
        resolve(false)
      }
      
      const confirmBtn = document.createElement('button')
      confirmBtn.className = 'confirm-btn confirm-btn-confirm'
      confirmBtn.textContent = 'Удалить'
      confirmBtn.onclick = () => {
        document.body.removeChild(modal)
        resolve(true)
      }
      
      actions.appendChild(cancelBtn)
      actions.appendChild(confirmBtn)
      
      dialog.appendChild(messageEl)
      dialog.appendChild(actions)
      
      modal.appendChild(dialog)
      
      // Закрытие по клику на фон
      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal)
          resolve(false)
        }
      }
      
      document.body.appendChild(modal)
    })
  }
  
  return {
    notify,
    success: (message: string, duration?: number) => notify(message, 'success', duration),
    error: (message: string, duration?: number) => notify(message, 'error', duration),
    info: (message: string, duration?: number) => notify(message, 'info', duration),
    warning: (message: string, duration?: number) => notify(message, 'warning', duration),
    confirm
  }
}
