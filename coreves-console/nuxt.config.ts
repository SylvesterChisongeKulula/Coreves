import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: false },
  ssr: false, // internal tool: a client-rendered SPA over the Nitro API

  modules: ['nuxt-auth-utils'],

  runtimeConfig: {
    databaseUrl: '', // NUXT_DATABASE_URL
    migrationsDir: './server/db/migrations', // NUXT_MIGRATIONS_DIR (set in the Docker image)
    licencePrivateKey: '', // NUXT_LICENCE_PRIVATE_KEY — Ed25519 PEM; the key CoreVesFin images trust
    leadsWebhookSecret: '', // NUXT_LEADS_WEBHOOK_SECRET — shared with the company website
    resendApiKey: '', // NUXT_RESEND_API_KEY
    mailFrom: 'Coreves Billing <billing@mail.coreves.software>', // NUXT_MAIL_FROM
    ownerEmail: '', // NUXT_OWNER_EMAIL — first-boot owner, used only while there are no users
    ownerPassword: '', // NUXT_OWNER_PASSWORD
    session: {
      name: 'coreves-console',
      maxAge: 60 * 60 * 12,
      password: '', // NUXT_SESSION_PASSWORD — at least 32 characters
      cookie: { sameSite: 'strict' },
    },
    public: {
      consoleUrl: 'http://localhost:3000', // NUXT_PUBLIC_CONSOLE_URL — this console's public base URL
    },
  },

  nitro: {
    experimental: { tasks: true },
    scheduledTasks: { '0 6 25 * *': ['invoices:draft'] },
  },

  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },

  app: {
    head: {
      title: 'Coreves Console',
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'robots', content: 'noindex, nofollow' }],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&family=Space+Mono&display=swap' },
      ],
    },
  },
})
