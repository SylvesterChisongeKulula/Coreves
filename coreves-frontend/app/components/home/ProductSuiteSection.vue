<script setup lang="ts">
const solutions = [
  {
    name: 'Custom Software Solutions',
    tag: 'Build',
    status: 'Tailored',
    primary: false,
    body: 'Web, mobile and backend systems designed around the specific processes, users and requirements of your organisation.',
    href: '#contact',
  },
  {
    name: 'Business Process Digitalisation',
    tag: 'Improve',
    status: 'Operational',
    primary: false,
    body: 'Manual and disconnected workflows turned into structured digital processes for better visibility, consistency and control.',
    href: '#contact',
  },
  {
    name: 'Coreves Products',
    tag: 'Products',
    status: 'Focused',
    primary: false,
    body: 'Specialised software products for industries where recurring operational challenges can be solved through focused systems.',
    href: '#finance',
  },
  {
    name: 'Coreves Finance',
    tag: 'Flagship',
    status: 'Product',
    primary: true,
    body: 'Purpose-built loan management for customer, loan, repayment and portfolio operations in one structured environment.',
    href: '#finance',
  },
]

const industries = [
  {
    name: 'Financial Services & Microfinance',
    body: 'Loan processing, customer records, repayments, portfolio monitoring, reporting, compliance support and credit assessment.',
  },
  {
    name: 'Real Estate & Property Management',
    body: 'Properties, tenants, leases, payments, documents, maintenance workflows and portfolio administration.',
  },
  {
    name: 'Commerce & Business Operations',
    body: 'E-commerce, sales, orders, inventory, dashboards, reporting and internal administrative workflows.',
  },
]

const { trackEvent } = useAnalytics()
</script>

<template>
  <section id="solutions" class="py-24">
    <div class="section-container">
      <div class="max-w-2xl">
        <p class="mono-label">Solutions</p>
        <h2 class="display-heading mt-5 text-4xl text-ink sm:text-5xl">
          Solutions shaped by the problem to solve.
        </h2>
        <p class="mt-5 text-lg leading-relaxed text-body-muted">
          We focus on business outcomes first, then choose the right technology and delivery model
          for the organisation.
        </p>
      </div>

      <div class="mt-14 grid gap-px overflow-hidden rounded-[16px] border border-hairline/70 bg-hairline/70 sm:grid-cols-2">
        <article
          v-for="solution in solutions"
          :key="solution.name"
          class="group flex flex-col bg-canvas p-8 transition-colors hover:bg-soft-stone/40"
        >
          <div class="flex items-center justify-between gap-4">
            <span class="font-mono text-xs uppercase tracking-[0.12em] text-muted">{{ solution.tag }}</span>
            <span
              class="rounded-full px-2.5 py-1 text-[11px] font-medium"
              :class="solution.primary
                ? 'bg-deep-green/10 text-deep-green'
                : 'border border-hairline text-slate'"
            >
              {{ solution.status }}
            </span>
          </div>

          <h3 class="mt-5 text-2xl text-ink">{{ solution.name }}</h3>
          <p class="mt-3 flex-1 text-sm leading-relaxed text-body-muted">{{ solution.body }}</p>

          <a
            :href="solution.href"
            class="text-link mt-6"
            @click="
              trackEvent('contact_cta_click', {
                cta_location: 'product_suite',
                product: solution.name,
              })
            "
          >
            {{ solution.primary ? 'Explore Coreves Finance' : 'Start a project' }}
            <span aria-hidden="true">→</span>
          </a>
        </article>
      </div>

      <div id="industries" class="mt-20 grid gap-10 lg:grid-cols-3 lg:items-start">
        <div>
          <p class="mono-label">Industries</p>
          <h2 class="display-heading mt-5 text-4xl text-ink sm:text-5xl">
            Industry context matters.
          </h2>
          <p class="mt-5 leading-relaxed text-body-muted">
            Our strongest work is where software needs to reflect real operational detail, not just
            generic features.
          </p>
        </div>

        <div class="grid gap-px overflow-hidden rounded-[16px] border border-hairline/70 bg-hairline/70 lg:col-span-2">
          <article
            v-for="industry in industries"
            :key="industry.name"
            class="bg-canvas p-7 transition-colors hover:bg-soft-stone/40"
          >
            <h3 class="text-xl text-ink">{{ industry.name }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-body-muted">{{ industry.body }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
