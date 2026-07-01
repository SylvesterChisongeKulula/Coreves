<script setup lang="ts">
const suite = [
  { name: 'Coreves Finance', desc: 'Loan management system', status: 'Live', tone: 'green' },
  { name: 'Credit Scoring', desc: 'Smarter lending decisions', status: 'Coming', tone: 'muted' },
  { name: 'Reporting & Compliance', desc: 'Regulator-ready records', status: 'Coming', tone: 'muted' },
]
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="section-container pt-20 pb-16 text-center sm:pt-28">
      <p class="mono-label">Coreves Software Solutions</p>

      <h1
        class="display-heading mx-auto mt-6 max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] text-ink"
      >
        Reliable software<br class="hidden sm:block" /> for Africa's lenders.
      </h1>

      <p class="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-body-muted">
        Coreves builds purpose-built software that empowers microfinance and lending institutions to
        manage credit with speed, accuracy, and confidence — built for African lending realities, not
        adapted from elsewhere.
      </p>

      <div class="mt-9 flex flex-wrap items-center justify-center gap-4">
        <a href="#contact" class="pill-cta-dark">Request a demo</a>
        <a href="#products" class="text-link">
          Explore our products
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>

    <!-- Media composition -->
    <div class="section-container pb-20">
      <div class="grid gap-5 lg:grid-cols-5">
        <!-- Product suite preview over animated brand gradient -->
        <div class="gradient-fallback relative overflow-hidden rounded-[22px] p-6 text-on-dark sm:p-8 lg:col-span-3">
          <HeroGradient />

          <div class="relative z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-white/25" />
                <span class="h-2.5 w-2.5 rounded-full bg-white/25" />
                <span class="h-2.5 w-2.5 rounded-full bg-white/25" />
              </div>
              <span class="font-mono text-[11px] uppercase tracking-[0.12em] text-white/55">
                The Coreves suite
              </span>
            </div>

            <div class="mt-8 space-y-2.5">
              <div
                v-for="product in suite"
                :key="product.name"
                class="flex items-center justify-between rounded-[8px] bg-white/10 px-4 py-3.5 backdrop-blur-sm"
              >
                <div>
                  <p class="text-sm font-medium text-white">{{ product.name }}</p>
                  <p class="text-xs text-white/60">{{ product.desc }}</p>
                </div>
                <span
                  class="rounded-full px-2.5 py-1 text-[11px] font-medium"
                  :class="{
                    'bg-emerald-400/20 text-emerald-200': product.tone === 'green',
                    'bg-white/15 text-white/70': product.tone === 'muted',
                  }"
                >
                  {{ product.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Warm stone accent card -->
        <div class="flex flex-col justify-between rounded-[22px] bg-soft-stone p-6 sm:p-8 lg:col-span-2">
          <p class="font-mono text-xs uppercase tracking-[0.12em] text-slate">Who we are</p>
          <div>
            <p class="display-heading text-3xl text-ink sm:text-4xl">A software product company for lenders.</p>
            <p class="mt-4 text-sm leading-relaxed text-body-muted">
              Not a generic IT shop. We build opinionated, focused tools for the financial services
              sector — trustworthy, technically rigorous, and close to our clients.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
