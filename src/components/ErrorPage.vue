<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-200">404</h1>
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
      <p class="text-gray-600 mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for. 
        The page might have been moved or doesn't exist.
      </p>
      <div class="space-x-4">
        <button 
          @click="$emit('navigate', 'home')"
          class="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
        >
          Go Home
        </button>
        <button 
          @click="$emit('navigate', 'tools')"
          class="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
        >
          Use Tools
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['navigate'])
</script>
