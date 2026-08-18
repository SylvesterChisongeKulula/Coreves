type GtagArguments = unknown[]

declare global {
  interface Window {
    dataLayer?: GtagArguments[]
    gtag?: (...args: unknown[]) => void
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const gaMeasurementId = config.public.gaMeasurementId

  if (!gaMeasurementId) {
    return
  }

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`,
        async: true,
      },
    ],
  })

  window.dataLayer = window.dataLayer || []
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args)
  }

  window.gtag('js', new Date())
  window.gtag('config', gaMeasurementId, { send_page_view: false })

  const route = useRoute()

  nuxtApp.hook('page:finish', () => {
    window.gtag?.('event', 'page_view', {
      page_path: route.fullPath,
      page_location: window.location.href,
      page_title: document.title,
    })
  })
})
