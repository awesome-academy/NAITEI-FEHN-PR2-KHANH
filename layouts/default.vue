<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <HeaderComponent/>

    <main class="flex-1">
      <slot />
    </main>

    <FooterComponent/>
  </div>
</template>
