<script setup lang="ts">
const open = ref(true)
const { trackEvent } = useAnalytics()
</script>

<template>
  <div
    v-if="open"
    class="relative flex h-9 items-center justify-center gap-3 bg-black px-6 text-center text-xs text-white"
  >
    <p class="truncate">
      Coreves Software Solutions - practical software for better operations.
      <a
        href="#contact"
        class="ml-1 underline underline-offset-2 hover:opacity-80"
        @click="trackEvent('demo_cta_click', { cta_location: 'announcement_bar' })"
      >
        Start a project
      </a>
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
