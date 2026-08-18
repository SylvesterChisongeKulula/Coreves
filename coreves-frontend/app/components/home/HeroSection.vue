<script setup lang="ts">
const suite = [
  { name: 'Custom Software', desc: 'Systems shaped around real workflows', status: 'Build', tone: 'green' },
  { name: 'Digital Operations', desc: 'Structured processes, records and reporting', status: 'Improve', tone: 'muted' },
  { name: 'Coreves Finance', desc: 'Flagship loan management platform', status: 'Product', tone: 'muted' },
]

const { trackEvent } = useAnalytics()
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="section-container pt-20 pb-16 text-center sm:pt-28">
      <p class="mono-label">Coreves Software Solutions</p>

      <h1
        class="display-heading mx-auto mt-6 max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] text-ink"
      >
        Software built around<br class="hidden sm:block" /> how business works.
      </h1>

      <p class="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-body-muted">
        Coreves designs practical software solutions, digital operations and industry-focused
        products around real business needs, helping organisations improve control, visibility and
        efficiency.
      </p>

      <div class="mt-9 flex flex-wrap items-center justify-center gap-4">
        <a
          href="#contact"
          class="pill-cta-dark"
          @click="trackEvent('demo_cta_click', { cta_location: 'hero' })"
        >
          Start a project
        </a>
        <a
          href="#solutions"
          class="text-link"
          @click="trackEvent('contact_cta_click', { cta_location: 'hero_products_link' })"
        >
          Explore solutions
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
                How we help
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
            <p class="display-heading text-3xl text-ink sm:text-4xl">Business-first software delivery.</p>
            <p class="mt-4 text-sm leading-relaxed text-body-muted">
              We start by understanding the operation, then design technology that reflects users,
              workflows, constraints and growth goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
