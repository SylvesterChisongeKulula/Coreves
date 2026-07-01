<script setup lang="ts">
import logoUrl from '~/assets/images/logo.svg'

const navLinks = [
  { label: 'Products', href: '#products' },
  { label: 'Coreves Finance', href: '#finance' },
  { label: 'Company', href: '#company' },
  { label: 'Contact', href: '#contact' },
]

const mobileOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-hairline/70 bg-canvas/85 backdrop-blur">
    <div class="section-container">
      <div class="flex h-20 items-center justify-between gap-6">
        <!-- Logo -->
        <NuxtLink to="/" class="flex shrink-0 items-center" aria-label="Coreves home">
          <img :src="logoUrl" alt="Coreves Software Solutions" class="h-10 w-auto sm:h-12" />
        </NuxtLink>

        <!-- Centered nav -->
        <nav class="hidden items-center gap-8 md:flex">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="text-sm text-ink/80 transition-colors hover:text-ink"
          >
            {{ link.label }}
          </a>
        </nav>

        <!-- Right actions -->
        <div class="hidden items-center gap-5 md:flex">
          <a href="#contact" class="pill-cta-dark">Request a demo</a>
        </div>

        <!-- Mobile toggle -->
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-[8px] md:hidden"
          :aria-expanded="mobileOpen"
          aria-label="Toggle menu"
          @click="mobileOpen = !mobileOpen"
        >
          <span class="relative block h-3 w-5">
            <span
              class="absolute left-0 block h-0.5 w-5 bg-ink transition-transform"
              :class="mobileOpen ? 'top-1.5 rotate-45' : 'top-0'"
            />
            <span
              class="absolute left-0 top-1.5 block h-0.5 w-5 bg-ink transition-opacity"
              :class="mobileOpen ? 'opacity-0' : 'opacity-100'"
            />
            <span
              class="absolute left-0 block h-0.5 w-5 bg-ink transition-transform"
              :class="mobileOpen ? 'top-1.5 -rotate-45' : 'top-3'"
            />
          </span>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="border-t border-hairline/70 bg-canvas md:hidden">
      <nav class="section-container flex flex-col gap-1 py-4">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="rounded-[8px] px-2 py-2.5 text-sm text-ink/80 transition-colors hover:bg-soft-stone"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </a>
        <div class="mt-3 flex flex-col gap-3 border-t border-hairline/70 pt-4">
          <a href="#contact" class="pill-cta-dark w-full" @click="mobileOpen = false">Request a demo</a>
        </div>
      </nav>
    </div>
  </header>
</template>
