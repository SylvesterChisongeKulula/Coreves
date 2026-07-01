<script setup lang="ts">
const points = [
  'Local market knowledge paired with professional-grade software delivery',
  'Security is non-negotiable — built in, not bolted on after the fact',
  'Compliance is a feature: we make Bank of Zambia requirements easier to meet',
  'Documentation, onboarding, and support ship with every product',
]
</script>

<template>
  <section id="why" class="py-12">
    <div class="section-container">
      <div class="rounded-[22px] bg-deep-green px-6 py-16 text-on-dark sm:px-12 lg:px-20 lg:py-20">
        <div class="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p class="font-mono text-xs uppercase tracking-[0.12em] text-white/50">Why Coreves</p>
            <h2 class="display-heading mt-5 text-4xl text-white sm:text-5xl">
              Built for African lending realities — not adapted from elsewhere.
            </h2>
            <p class="mt-6 max-w-lg leading-relaxed text-white/65">
              Local market knowledge paired with professional-grade software delivery. We understand
              the lending context, not just the code.
            </p>
            <a
              href="#contact"
              class="mt-9 inline-flex items-center justify-center rounded-[32px] bg-white px-6 py-3 text-sm font-medium text-deep-green transition-opacity hover:opacity-90"
            >
              Talk to our team
            </a>
          </div>

          <ul class="space-y-4">
            <li
              v-for="point in points"
              :key="point"
              class="flex items-start gap-4 rounded-[12px] border border-white/10 bg-white/[0.04] p-5"
            >
              <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/25 text-xs text-white">
                ✓
              </span>
              <span class="text-sm leading-relaxed text-white/80">{{ point }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
