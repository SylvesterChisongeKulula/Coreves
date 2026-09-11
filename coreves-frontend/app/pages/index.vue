<script setup lang="ts">
const { public: { siteUrl } } = useRuntimeConfig()

const title = 'Coreves Finance — Loan Management Software for Microfinance & Lending | Coreves'
const description =
  'Coreves Finance is loan management software for microfinance and lending institutions — credit assessment, repayments, portfolio monitoring and compliance. Built by Coreves, a Zambia-based software studio also delivering custom software and digital operations solutions.'
const ogImage = `${siteUrl}/og-image.png`

useSeoMeta({
  title,
  description,
  keywords:
    'loan management software, microfinance software, lending software Zambia, loan management system, credit assessment software, digital operations, custom software development Zambia',
  ogTitle: 'Coreves Finance — Loan Management Software for Microfinance & Lending',
  ogDescription: description,
  ogType: 'website',
  ogUrl: `${siteUrl}/`,
  ogImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogSiteName: 'Coreves',
  ogLocale: 'en_ZM',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Coreves Finance — Loan Management Software for Microfinance & Lending',
  twitterDescription: description,
  twitterImage: ogImage,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/` }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Coreves Software Solutions',
            url: `${siteUrl}/`,
            logo: `${siteUrl}/apple-touch-icon.png`,
            description:
              'Coreves designs practical business software, digital operations tooling and industry-focused products, including Coreves Finance, a loan management platform for microfinance and lending institutions.',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Lusaka',
              addressCountry: 'ZM',
            },
            sameAs: [],
          },
          {
            '@type': 'SoftwareApplication',
            '@id': `${siteUrl}/#coreves-finance`,
            name: 'Coreves Finance',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            description:
              'Loan management platform for microfinance and lending institutions covering customer records, loan processing, repayments, portfolio monitoring, credit assessment and compliance support.',
            provider: { '@id': `${siteUrl}/#organization` },
            url: `${siteUrl}/#finance`,
          },
        ],
      }),
    },
  ],
})
</script>

<template>
  <div>
    <HomeHeroSection />
    <HomeTrustStrip />
    <HomeProductSuiteSection />
    <HomeProductSpotlight />
    <HomeProductBand />
    <HomeValuesSection />
    <HomeContactCta />
  </div>
</template>
