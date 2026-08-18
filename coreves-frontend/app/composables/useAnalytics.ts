export type AnalyticsEventName =
  | 'demo_cta_click'
  | 'contact_cta_click'
  | 'demo_request_submit'
  | 'contact_sales_submit'
  | 'resource_download'
  | 'calculator_start'
  | 'calculator_complete'
  | 'email_interest_submit'

export type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>

export function useAnalytics() {
  const config = useRuntimeConfig()

  function trackEvent(eventName: AnalyticsEventName, params: AnalyticsEventParams = {}) {
    if (!config.public.gaMeasurementId || import.meta.server) {
      return
    }

    window.gtag?.('event', eventName, params)
  }

  return { trackEvent }
}
