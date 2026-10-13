<script setup lang="ts">
defineProps<{ title: string, eyebrow?: string }>()
</script>

<template>
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <p v-if="eyebrow" class="mono-label">{{ eyebrow }}</p>
      <h1 class="text-2xl font-semibold tracking-tight">{{ title }}</h1>
    </div>
    <div class="flex flex-wrap gap-2">
      <slot />
    </div>
  </div>
</template>
