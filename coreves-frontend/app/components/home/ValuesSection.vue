<script setup lang="ts">
const values = [
  { title: 'Reliability', body: 'The systems our clients depend on must work — every time. Stability is not optional in financial software.' },
  { title: 'Transparency', body: 'In pricing, in delivery timelines, in what our software does. No surprises for clients.' },
  { title: 'Purposeful innovation', body: 'We build what solves real problems for our market — not features for their own sake.' },
  { title: 'Quality execution', body: 'Every deliverable — code, document, or client call — reflects the standard we set for ourselves.' },
]
</script>

<template>
  <section id="company" class="py-24">
    <div class="section-container">
      <div class="grid gap-12 lg:grid-cols-3">
        <div class="lg:col-span-1">
          <p class="mono-label">What we stand for</p>
          <h2 class="display-heading mt-5 text-4xl text-ink sm:text-5xl">
            A product company for the lending sector.
          </h2>
          <p class="mt-5 leading-relaxed text-body-muted">
            We build opinionated, focused tools for financial services — trustworthy, technically
            rigorous, and close to our clients.
          </p>
        </div>

        <dl class="grid gap-px overflow-hidden rounded-[16px] border border-hairline/70 bg-hairline/70 sm:grid-cols-2 lg:col-span-2">
          <div v-for="value in values" :key="value.title" class="bg-canvas p-8">
            <dt class="text-lg text-ink">{{ value.title }}</dt>
            <dd class="mt-3 text-sm leading-relaxed text-body-muted">{{ value.body }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>
