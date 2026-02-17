<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  overflow-x: hidden;
}

/* Стилизация основного скроллбара */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #00DC82;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #00b86f;
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #00DC82 #f1f1f1;
}
</style>
