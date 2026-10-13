<script setup lang="ts">
const props = defineProps<{ apiKey: string }>()
const copied = ref(false)
async function copy() {
  await navigator.clipboard.writeText(props.apiKey).catch(() => {})
  copied.value = true
}
</script>

<template>
  <Notice tone="info">
    <p class="font-medium">API key — copy it now, it won't be shown again.</p>
    <code class="mt-2 block break-all rounded bg-white px-2 py-1 font-mono text-xs text-ink">{{ apiKey }}</code>
    <button class="btn-outline mt-2 !py-1 text-xs" @click="copy">{{ copied ? 'Copied' : 'Copy' }}</button>
    <p class="mt-2 text-xs">Put it in the client server's <code>.env</code> as <code>BILLING_API_KEY</code>.</p>
  </Notice>
</template>
