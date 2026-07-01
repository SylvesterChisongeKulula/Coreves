<script setup lang="ts">
import emblemUrl from '~/assets/images/emblem.svg'

const year = new Date().getFullYear()

const columns = [
  {
    title: 'Product',
    links: ['Coreves Finance', 'Credit scoring', 'Mobile money', 'Regulatory reporting'],
  },
  {
    title: 'Solutions',
    links: ['Microfinance institutions', 'SACCOs & credit unions', 'Private lenders', 'Digital lenders'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Contact', 'Security'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API reference', 'Onboarding guides', 'Compliance'],
  },
]
</script>

<template>
  <footer class="bg-primary text-on-dark">
    <!-- Newsletter band -->
    <div class="section-container border-b border-white/10 py-16">
      <div class="grid gap-10 lg:grid-cols-2 lg:items-end">
        <div>
          <p class="font-mono text-xs uppercase tracking-[0.12em] text-coral">Credit moves fast</p>
          <h2 class="display-heading mt-4 max-w-md text-3xl text-white sm:text-4xl">
            Stay close to what we ship next.
          </h2>
        </div>
        <div class="w-full lg:ml-auto lg:max-w-md">
          <form class="flex w-full items-center gap-3" @submit.prevent>
            <input
              type="email"
              placeholder="Work email"
              disabled
              class="h-12 w-full rounded-[8px] border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="submit"
              disabled
              class="flex h-12 shrink-0 items-center justify-center rounded-[8px] bg-white px-5 text-sm font-medium text-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Subscribe
            </button>
          </form>
          <p class="mt-2 text-xs text-white/40">Coming soon</p>
        </div>
      </div>
    </div>

    <!-- Link columns -->
    <div class="section-container grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-6">
      <div class="lg:col-span-2">
        <div class="flex items-center gap-3">
          <img :src="emblemUrl" alt="" class="h-8 w-8 invert" />
          <span class="text-base font-medium text-white">Coreves</span>
        </div>
        <p class="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
          Software solutions for microfinance and lending institutions across Africa.
        </p>
        <p class="mt-6 text-sm text-white/55">Lusaka, Zambia</p>
      </div>

      <div v-for="col in columns" :key="col.title">
        <h3 class="text-sm font-medium text-white">{{ col.title }}</h3>
        <ul class="mt-4 space-y-3">
          <li v-for="link in col.links" :key="link">
            <a href="#" class="text-sm text-white/55 transition-colors hover:text-white">{{ link }}</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Legal bar -->
    <div class="border-t border-white/10">
      <div class="section-container flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/45 sm:flex-row">
        <p>© {{ year }} Coreves Software Solutions. All rights reserved.</p>
        <div class="flex items-center gap-6">
          <a href="#" class="transition-colors hover:text-white/80">Privacy</a>
          <a href="#" class="transition-colors hover:text-white/80">Terms</a>
          <a href="#" class="transition-colors hover:text-white/80">Security</a>
        </div>
      </div>
    </div>
  </footer>
</template>
