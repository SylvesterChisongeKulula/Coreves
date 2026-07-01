<script setup lang="ts">
import { Gradient } from '~/utils/Gradient'

// Deep brand palette → read by the Whatamesh engine via getComputedStyle.
const colorVars = {
  '--gradient-color-1': '#003c33', // deep-green (base)
  '--gradient-color-2': '#071829', // dark-navy
  '--gradient-color-3': '#17171c', // primary
  '--gradient-color-4': '#ff7759', // coral (accent)
} as Record<string, string>

const canvas = ref<HTMLCanvasElement | null>(null)
let gradient: { amp: number; pause: () => void; disconnect: () => void; initGradient: (s: string) => void } | null = null

onMounted(() => {
  // Respect reduced-motion: skip the animation, let the CSS fallback show.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // Wait for the canvas (with its CSS color vars) to be in the DOM.
  nextTick(() => {
    if (!canvas.value) return
    try {
      gradient = new Gradient() as typeof gradient
      // Soften the wave for the contained card (engine default is 320, tuned for full-bleed).
      if (gradient) gradient.amp = 240
      gradient?.initGradient('#hero-gradient-canvas')
    } catch (err) {
      // WebGL unavailable — fall back silently to the static CSS gradient.
      gradient = null
    }
  })
})

onBeforeUnmount(() => {
  // Stop the rAF loop, then tear down listeners/observers.
  gradient?.pause()
  gradient?.disconnect()
  gradient = null
})
</script>

<template>
  <canvas
    id="hero-gradient-canvas"
    ref="canvas"
    aria-hidden="true"
    class="absolute inset-0 h-full w-full"
    :style="colorVars"
  />
</template>
