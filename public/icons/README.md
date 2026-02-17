# Иконки проекта

Эта папка предназначена для хранения пользовательских SVG иконок.

## Как добавить свою иконку

1. Поместите SVG файл в эту папку (например, `custom-icon.svg`)
2. Используйте компонент Icon с именем файла без расширения:

```vue
<Icon name="custom-icon" size="medium" />
```

## Использование компонента Icon

### Встроенные emoji иконки

Компонент поддерживает множество встроенных emoji иконок:

```vue
<Icon name="book" />
<Icon name="phone" />
<Icon name="email" />
<Icon name="trophy" />
```

### Размеры

```vue
<Icon name="book" size="small" />   <!-- 1rem -->
<Icon name="book" size="medium" />  <!-- 1.5rem (по умолчанию) -->
<Icon name="book" size="large" />   <!-- 2rem -->
<Icon name="book" size="xlarge" />  <!-- 3rem -->
```

### Варианты цветов

```vue
<Icon name="star" variant="primary" />   <!-- Зеленый -->
<Icon name="star" variant="secondary" /> <!-- Фиолетовый -->
<Icon name="star" variant="danger" />    <!-- Красный -->
<Icon name="star" variant="warning" />   <!-- Оранжевый -->
<Icon name="star" variant="success" />   <!-- Зеленый -->
<Icon name="star" variant="muted" />     <!-- Серый -->
```

### Кастомный цвет

```vue
<Icon name="heart" color="#ff0000" />
```

## Список встроенных иконок

### Образование
- book, pencil, graduation, school, teacher, student, backpack, notebook, ruler, calculator

### Коммуникация
- phone, email, location, clock, calendar, bell, megaphone

### Действия
- check, cross, star, heart, trophy, medal, flag

### Навигация
- home, menu, search, settings, info, warning, error, success

### Спорт и активности
- sport, basketball, music, art, science, computer, globe

### Транспорт
- bus, car, bike

### Разное
- fire, light, gift, camera, image, folder, document
