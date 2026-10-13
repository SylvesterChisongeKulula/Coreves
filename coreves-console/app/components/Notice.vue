<script setup lang="ts">
defineProps<{ tone?: 'error' | 'ok' | 'info' }>()
</script>

<template>
  <div
    class="rounded-[8px] px-4 py-3 text-sm"
    :class="{
      'bg-orange-50 text-danger': tone === 'error',
      'bg-pale-green text-deep-green': tone === 'ok',
      'bg-pale-blue text-action-blue': !tone || tone === 'info',
    }"
  >
    <slot />
  </div>
</template>
