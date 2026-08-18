<script setup lang="ts">
const consoleRows = [
  { name: 'Loan #LMS-4821', status: 'Disbursed', tone: 'green' },
  { name: 'Loan #LMS-4822', status: 'In review', tone: 'amber' },
  { name: 'Loan #LMS-4823', status: 'Repaying', tone: 'blue' },
]

const capabilities = [
  {
    title: 'Manage',
    body: 'Customer records, loan details, repayments and day-to-day lending operations kept in one structured environment.',
    icon: 'doc',
  },
  {
    title: 'Monitor',
    body: 'Portfolio performance, operational activity and reporting made visible for teams that need clearer control.',
    icon: 'cycle',
  },
  {
    title: 'Assess & control',
    body: 'Credit assessment, scoring, compliance support and administrative oversight that strengthen lending decisions.',
    icon: 'shield',
  },
]

const { trackEvent } = useAnalytics()
</script>

<template>
  <section id="finance" class="py-24">
    <div class="section-container">
      <div class="grid gap-12 lg:grid-cols-2 lg:items-center">
        <!-- Copy -->
        <div class="max-w-xl">
          <p class="mono-label">Flagship product</p>
          <h2 class="display-heading mt-5 text-4xl text-ink sm:text-5xl">Coreves Finance</h2>
          <p class="mt-5 text-lg leading-relaxed text-body-muted">
            Our flagship loan management platform brings customer, loan, repayment and portfolio
            information into one operational environment, helping lending teams move away from
            fragmented records toward structured, visible operations.
          </p>
          <a
            href="#contact"
            class="pill-cta-dark mt-8"
            @click="trackEvent('demo_cta_click', { cta_location: 'product_spotlight' })"
          >
            Request a Finance demo
          </a>
        </div>

        <!-- Console mock -->
        <div class="rounded-[22px] bg-primary p-6 text-on-dark sm:p-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span class="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span class="h-2.5 w-2.5 rounded-full bg-white/20" />
            </div>
            <span class="font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
              Coreves Finance · Portfolio
            </span>
          </div>

          <div class="mt-8 grid grid-cols-3 gap-4">
            <div v-for="stat in [['Active loans', '1,248'], ['Portfolio', 'K 8.4M'], ['PAR 30', '2.1%']]" :key="stat[0]" class="rounded-[8px] bg-white/[0.04] p-4">
              <p class="text-xs text-white/45">{{ stat[0] }}</p>
              <p class="mt-2 text-xl font-medium text-white">{{ stat[1] }}</p>
            </div>
          </div>

          <div class="mt-5 space-y-2.5">
            <div
              v-for="row in consoleRows"
              :key="row.name"
              class="flex items-center justify-between rounded-[8px] bg-white/[0.04] px-4 py-3"
            >
              <span class="text-sm text-white/80">{{ row.name }}</span>
              <span
                class="rounded-full px-2.5 py-1 text-[11px] font-medium"
                :class="{
                  'bg-emerald-400/15 text-emerald-300': row.tone === 'green',
                  'bg-amber-400/15 text-amber-300': row.tone === 'amber',
                  'bg-sky-400/15 text-sky-300': row.tone === 'blue',
                }"
              >
                {{ row.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Inside Coreves Finance -->
      <div class="mt-16">
        <p class="text-sm font-medium text-ink">Inside Coreves Finance</p>
        <div class="mt-5 grid gap-px overflow-hidden rounded-[16px] border border-hairline/70 bg-hairline/70 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="cap in capabilities"
            :key="cap.title"
            class="bg-canvas p-8 transition-colors hover:bg-soft-stone/40"
          >
            <div class="flex h-11 w-11 items-center justify-center rounded-[10px] border border-hairline text-ink">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" class="h-5 w-5">
                <template v-if="cap.icon === 'doc'">
                  <path d="M6 3h8l4 4v14H6z" stroke-linejoin="round" />
                  <path d="M14 3v4h4M9 13h6M9 17h6" stroke-linecap="round" />
                </template>
                <template v-else-if="cap.icon === 'cycle'">
                  <path d="M4 12a8 8 0 0 1 13.5-5.8M20 12a8 8 0 0 1-13.5 5.8" stroke-linecap="round" />
                  <path d="M17 3v3.5h-3.5M7 21v-3.5h3.5" stroke-linecap="round" stroke-linejoin="round" />
                </template>
                <template v-else>
                  <path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" stroke-linejoin="round" />
                  <path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round" />
                </template>
              </svg>
            </div>

            <h3 class="mt-6 text-xl text-ink">{{ cap.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-body-muted">{{ cap.body }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
