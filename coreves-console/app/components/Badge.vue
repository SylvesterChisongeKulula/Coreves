<script setup lang="ts">
defineProps<{ value: string | null | undefined }>()
</script>

<template>
  <span :class="stateBadge[value ?? ''] ?? 'badge-grey'">{{ (value ?? '—').replace('_', ' ').toLowerCase() }}</span>
</template>
