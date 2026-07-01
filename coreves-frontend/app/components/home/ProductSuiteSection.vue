<script setup lang="ts">
const products = [
  {
    name: 'Coreves Finance',
    tag: 'Flagship',
    status: 'Live',
    live: true,
    body: 'Our loan management system — origination, servicing, repayments, and compliance in one reliable workflow.',
    href: '#finance',
  },
  {
    name: 'Credit Scoring',
    tag: 'Module',
    status: 'In development',
    live: false,
    body: 'Decisioning tools that help lenders assess risk and approve the right borrowers, faster.',
    href: '#contact',
  },
  {
    name: 'Reporting & Compliance',
    tag: 'Module',
    status: 'In development',
    live: false,
    body: 'Bank of Zambia–ready reporting that keeps records auditable without manual reconciliation.',
    href: '#contact',
  },
  {
    name: 'Integrations',
    tag: 'Platform',
    status: 'Ongoing',
    live: false,
    body: 'Mobile money connectivity with MTN and Airtel Zambia, plus the rails lenders depend on.',
    href: '#contact',
  },
]
</script>

<template>
  <section id="products" class="py-24">
    <div class="section-container">
      <div class="max-w-2xl">
        <p class="mono-label">Our products</p>
        <h2 class="display-heading mt-5 text-4xl text-ink sm:text-5xl">
          A growing suite for lenders.
        </h2>
        <p class="mt-5 text-lg leading-relaxed text-body-muted">
          We build focused products for the full credit lifecycle. Coreves Finance leads the way
          today, with new solutions rolling out as our clients' needs grow.
        </p>
      </div>

      <div class="mt-14 grid gap-px overflow-hidden rounded-[16px] border border-hairline/70 bg-hairline/70 sm:grid-cols-2">
        <article
          v-for="product in products"
          :key="product.name"
          class="group flex flex-col bg-canvas p-8 transition-colors hover:bg-soft-stone/40"
        >
          <div class="flex items-center justify-between gap-4">
            <span class="font-mono text-xs uppercase tracking-[0.12em] text-muted">{{ product.tag }}</span>
            <span
              class="rounded-full px-2.5 py-1 text-[11px] font-medium"
              :class="product.live
                ? 'bg-deep-green/10 text-deep-green'
                : 'border border-hairline text-slate'"
            >
              {{ product.status }}
            </span>
          </div>

          <h3 class="mt-5 text-2xl text-ink">{{ product.name }}</h3>
          <p class="mt-3 flex-1 text-sm leading-relaxed text-body-muted">{{ product.body }}</p>

          <a :href="product.href" class="text-link mt-6">
            {{ product.live ? 'Explore Coreves Finance' : 'Talk to us' }}
            <span aria-hidden="true">→</span>
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
