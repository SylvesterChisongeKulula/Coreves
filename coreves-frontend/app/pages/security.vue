<script setup lang="ts">
const { public: { siteUrl } } = useRuntimeConfig()

const title = 'Security | Coreves'
const description =
  'How the Coreves website handles data in transit and via its contact form, the third parties it relies on, and how to report a security concern.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: `${siteUrl}/security`,
  ogImage: `${siteUrl}/og-image.png`,
  ogSiteName: 'Coreves',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: `${siteUrl}/og-image.png`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/security` }],
})

const updated = 'September 2026'
</script>

<template>
  <div class="section-container py-24">
    <div class="max-w-3xl">
      <p class="mono-label">Legal</p>
      <h1 class="display-heading mt-5 text-4xl text-ink sm:text-5xl">Security</h1>
      <p class="mt-4 text-sm text-body-muted">Last updated: {{ updated }}</p>

      <div class="prose-legal mt-10 space-y-8 text-body-muted">
        <p>
          This page describes how coreves.software (this website) handles data. It does not
          describe the security posture of software Coreves delivers to clients, including
          Coreves Finance — product-level security documentation is provided separately to
          customers as part of an engagement.
        </p>

        <section>
          <h2 class="text-xl text-ink">This website</h2>
          <p class="mt-3">
            The site is served over HTTPS, so traffic between your browser and our servers is
            encrypted in transit. The contact form is submitted directly to our own server, which
            validates the submission before forwarding it — form data is not sent to a
            third-party form service.
          </p>
          <p class="mt-3">
            We do not collect payment details, account passwords or customer lending data through
            this website.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">Third parties we rely on</h2>
          <p class="mt-3">
            <strong class="text-ink">Resend</strong> delivers emails triggered by the contact
            form. <strong class="text-ink">Google Analytics</strong> processes site usage data
            when enabled. Both are established providers responsible for the security of their
            own infrastructure; see their respective security and trust documentation for details.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">Reporting a concern</h2>
          <p class="mt-3">
            If you believe you've found a security issue affecting this website, please tell us
            through the <NuxtLink to="/#contact" class="text-link">contact form</NuxtLink>,
            describing the issue so we can look into it.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
