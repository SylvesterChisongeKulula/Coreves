<script setup lang="ts">
const { public: { siteUrl } } = useRuntimeConfig()

const title = 'Privacy Policy | Coreves'
const description =
  'How Coreves collects, uses and protects information submitted through this website, including the contact form and analytics.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: `${siteUrl}/privacy`,
  ogImage: `${siteUrl}/og-image.png`,
  ogSiteName: 'Coreves',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: `${siteUrl}/og-image.png`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/privacy` }],
})

const updated = 'September 2026'
</script>

<template>
  <div class="section-container py-24">
    <div class="max-w-3xl">
      <p class="mono-label">Legal</p>
      <h1 class="display-heading mt-5 text-4xl text-ink sm:text-5xl">Privacy Policy</h1>
      <p class="mt-4 text-sm text-body-muted">Last updated: {{ updated }}</p>

      <div class="prose-legal mt-10 space-y-8 text-body-muted">
        <p>
          This policy explains what information Coreves Software Solutions ("Coreves", "we", "us")
          collects through coreves.software (this website), how it is used, and who it is shared
          with. It applies only to this marketing website — not to any software product delivered
          to a client, including Coreves Finance, which is governed by its own project or service
          agreement.
        </p>

        <section>
          <h2 class="text-xl text-ink">Information we collect</h2>
          <p class="mt-3">
            <strong class="text-ink">Contact and demo requests.</strong> When you submit the
            contact form on this site, we collect your name, company, email address, phone number,
            inquiry type and message. This is sent to our team to respond to your enquiry.
          </p>
          <p class="mt-3">
            <strong class="text-ink">Analytics.</strong> We use Google Analytics (GA4) to
            understand how visitors use this site — pages viewed and interactions such as button
            clicks. GA4 uses cookies and similar technologies and may collect device, browser and
            approximate location information. Analytics only runs when a Google Analytics
            measurement ID is configured for this site.
          </p>
          <p class="mt-3">
            We do not collect payment information, passwords, or customer lending data through
            this website. We do not run advertising pixels or sell any information we collect.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">How we use this information</h2>
          <p class="mt-3">
            We use contact form submissions to respond to enquiries, schedule demos and follow up
            on project or product interest. We use analytics data in aggregate to understand and
            improve the site.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">Who we share it with</h2>
          <p class="mt-3">
            <strong class="text-ink">Resend</strong> (resend.com) delivers the confirmation and
            internal notification emails triggered by the contact form. <strong class="text-ink"
              >Google Analytics</strong
            > (Google LLC) processes site analytics data when enabled. We do not otherwise sell or
            share the information you submit with third parties.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">Cookies</h2>
          <p class="mt-3">
            This site does not currently present a cookie consent banner. If Google Analytics is
            enabled, its cookies may be set when you visit. If you are visiting from a
            jurisdiction that requires consent before non-essential cookies are set, please be
            aware of this until a consent mechanism is added.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">Data retention</h2>
          <p class="mt-3">
            We retain contact form submissions for as long as reasonably needed to respond to your
            enquiry and maintain a record of business communications, or as required by law.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">Your rights</h2>
          <p class="mt-3">
            You can ask us to access, correct or delete personal information you have submitted to
            us by contacting us through the details below.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">Changes to this policy</h2>
          <p class="mt-3">
            We may update this policy from time to time. The "last updated" date above reflects
            the most recent revision.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">Contact</h2>
          <p class="mt-3">
            Questions about this policy or your information can be sent through the
            <NuxtLink to="/#contact" class="text-link">contact form</NuxtLink>.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
