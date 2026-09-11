<script setup lang="ts">
const { public: { siteUrl } } = useRuntimeConfig()

const title = 'Terms of Service | Coreves'
const description =
  'The terms that apply to using the Coreves website, including its contact form and the descriptions of our software and digital operations services.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: `${siteUrl}/terms`,
  ogImage: `${siteUrl}/og-image.png`,
  ogSiteName: 'Coreves',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: `${siteUrl}/og-image.png`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/terms` }],
})

const updated = 'September 2026'
</script>

<template>
  <div class="section-container py-24">
    <div class="max-w-3xl">
      <p class="mono-label">Legal</p>
      <h1 class="display-heading mt-5 text-4xl text-ink sm:text-5xl">Terms of Service</h1>
      <p class="mt-4 text-sm text-body-muted">Last updated: {{ updated }}</p>

      <div class="prose-legal mt-10 space-y-8 text-body-muted">
        <p>
          These terms govern your use of coreves.software (this website), operated by Coreves
          Software Solutions ("Coreves", "we", "us"), based in Lusaka, Zambia. By using this site
          you agree to these terms. They apply only to the website itself — any software Coreves
          builds or delivers for a client, including Coreves Finance, is governed separately by
          the relevant project or service agreement.
        </p>

        <section>
          <h2 class="text-xl text-ink">About our services</h2>
          <p class="mt-3">
            This site describes Coreves' offerings: custom software development, business process
            digitalisation, and Coreves Products, including our flagship loan management platform,
            Coreves Finance. Descriptions on this site are informational; the specific scope,
            deliverables and pricing of any engagement are set out in a separate written
            agreement.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">Using this website</h2>
          <p class="mt-3">
            You agree to use this site and its contact form lawfully and in good faith — for
            example, not to submit false information, attempt to disrupt the site, or use the
            contact form to send unsolicited bulk messages.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">Intellectual property</h2>
          <p class="mt-3">
            The Coreves name, logo, and the content, design and branding of this website belong to
            Coreves and may not be copied or reused without permission.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">Third-party services</h2>
          <p class="mt-3">
            This site loads fonts from Google Fonts, may use Google Analytics for usage
            statistics, and sends form-triggered emails through Resend. Your use of the site is
            also subject to the availability of these third-party services.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">No warranty; limitation of liability</h2>
          <p class="mt-3">
            This website and its content are provided "as is," without warranties of any kind. To
            the extent permitted by law, Coreves is not liable for any loss or damage arising from
            your use of this website. This does not affect any warranty or liability terms in a
            separate service agreement for delivered software.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">Governing law</h2>
          <p class="mt-3">
            These terms are governed by the laws of the Republic of Zambia.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">Changes to these terms</h2>
          <p class="mt-3">
            We may update these terms from time to time. The "last updated" date above reflects
            the most recent revision.
          </p>
        </section>

        <section>
          <h2 class="text-xl text-ink">Contact</h2>
          <p class="mt-3">
            Questions about these terms can be sent through the
            <NuxtLink to="/#contact" class="text-link">contact form</NuxtLink>.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
