<script setup lang="ts">
const open = ref(true)
</script>

<template>
  <div
    v-if="open"
    class="relative flex h-9 items-center justify-center gap-3 bg-black px-6 text-center text-xs text-white"
  >
    <p class="truncate">
      Coreves Finance — purpose-built credit management for African lenders.
      <a href="#contact" class="ml-1 underline underline-offset-2 hover:opacity-80">Request a demo</a>
    </p>
    <button
      type="button"
      aria-label="Dismiss announcement"
      class="absolute right-4 text-white/70 transition-colors hover:text-white"
      @click="open = false"
    >
      ✕
    </button>
  </div>
</template>
