<script setup lang="ts">
const values = [
  { title: 'Built around your operations', body: 'The system should adapt to the business. We design around actual workflows, users, responsibilities and reporting needs.' },
  { title: 'Built for growth', body: "Software should solve today's problems without becoming tomorrow's limitation. Scalability, maintainability and future integration are considered from the start." },
  { title: 'Partnership beyond delivery', body: 'Software continues to evolve after launch. We build long-term working relationships so systems improve as organisations change.' },
  { title: 'Practical outcomes', body: 'Technology is a means. Better control, visibility, consistency and operational efficiency are the outcome.' },
]
</script>

<template>
  <section id="company" class="py-24">
    <div class="section-container">
      <div class="grid gap-12 lg:grid-cols-3">
        <div class="lg:col-span-1">
          <p class="mono-label">What we stand for</p>
          <h2 class="display-heading mt-5 text-4xl text-ink sm:text-5xl">
            Understand the operation first.
          </h2>
          <p class="mt-5 leading-relaxed text-body-muted">
            Every successful system begins with understanding the problem. The business requirement
            stays visible from discovery through deployment and continued improvement.
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
