<script setup lang="ts">
const partners = ['MICROFIN', 'SACCO UNION', 'KWACHA CREDIT', 'LUSAKA LEND', 'ZANACO PARTNERS']
</script>

<template>
  <section class="border-y border-hairline/60 bg-canvas py-16">
    <div class="section-container text-center">
      <p class="text-sm text-body-muted">Trusted by lending institutions across Southern and East Africa</p>
      <div class="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
        <span
          v-for="name in partners"
          :key="name"
          class="font-mono text-sm tracking-[0.1em] text-ink/35"
        >
          {{ name }}
        </span>
      </div>
    </div>
  </section>
</template>
