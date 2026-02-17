# Примеры использования иконок в компонентах

## InfoCard

```vue
<InfoCard title="Победители олимпиад" icon="trophy">
  <p>Более 150 призовых мест</p>
</InfoCard>

<InfoCard title="Учителя" icon="teacher">
  <p>85% имеют высшую категорию</p>
</InfoCard>

<!-- Кастомная иконка (положи school-logo.svg в public/icons/) -->
<InfoCard title="Наша школа" icon="school-logo">
  <p>Основана в 1995 году</p>
</InfoCard>
```

## Announcement

```vue
<Announcement 
  title="Важное объявление"
  date="17 февраля 2026"
  type="important"
  icon="warning"
>
  <p>Текст объявления</p>
</Announcement>

<Announcement 
  title="Экскурсия"
  icon="bus"
  type="info"
>
  <p>Поездка в музей</p>
</Announcement>
```

## ContactInfo

```vue
<ContactInfo :contacts="contacts" />

<script setup>
const contacts = [
  { icon: 'location', label: 'Адрес', value: 'г. Москва' },
  { icon: 'phone', label: 'Телефон', value: '+7 (495) 123-45-67' },
  { icon: 'email', label: 'Email', value: 'info@school.ru' },
  { icon: 'clock', label: 'Режим работы', value: 'Пн-Пт: 8:00 - 18:00' }
]
</script>
```

## Прямое использование Icon

```vue
<!-- В любом месте -->
<Icon name="book" size="large" variant="primary" />
<Icon name="trophy" size="xlarge" color="#FFD700" />

<!-- Кастомная иконка -->
<Icon name="my-custom-icon" size="medium" />
```

## Добавление своей SVG иконки

1. Создай SVG файл (например, `school-logo.svg`)
2. Положи его в папку `public/icons/`
3. Используй в компонентах:

```vue
<InfoCard icon="school-logo" title="Наша школа">
  <p>Контент</p>
</InfoCard>

<Icon name="school-logo" size="xlarge" />
```

## Список всех встроенных иконок

См. файл README.md в этой папке
