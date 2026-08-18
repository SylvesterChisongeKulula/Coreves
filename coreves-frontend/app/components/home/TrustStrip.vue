<script setup lang="ts">
const credibility = [
  {
    label: 'Custom software',
    body: 'Systems designed around specific users, workflows and business requirements.',
  },
  {
    label: 'Digital operations',
    body: 'Structured processes that replace manual, fragmented or repetitive work.',
  },
  {
    label: 'Software products',
    body: 'Focused products for industries with recurring operational challenges.',
  },
]
</script>

<template>
  <section class="border-y border-hairline/60 bg-canvas py-16">
    <div class="section-container">
      <p class="text-center text-sm text-body-muted">
        Practical software for teams that need better control, visibility and efficiency.
      </p>
      <div class="mt-10 grid gap-px overflow-hidden rounded-[16px] border border-hairline/70 bg-hairline/70 md:grid-cols-3">
        <article
          v-for="item in credibility"
          :key="item.label"
          class="bg-canvas p-6 text-center"
        >
          <h2 class="font-mono text-xs uppercase tracking-[0.12em] text-ink">{{ item.label }}</h2>
          <p class="mt-3 text-sm leading-relaxed text-body-muted">{{ item.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
