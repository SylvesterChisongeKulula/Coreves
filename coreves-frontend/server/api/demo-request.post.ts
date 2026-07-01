import { Resend } from 'resend'
import type { DemoRequestBody } from '../utils/demoRequest'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<DemoRequestBody>>(event)

  const errors = validateDemoRequest(body)
  if (errors.length) {
    throw createError({ statusCode: 400, statusMessage: errors[0] })
  }

  const demoRequest = body as DemoRequestBody
  const config = useRuntimeConfig(event)
  const resend = new Resend(config.resendApiKey)

  const [clientResult, adminResult] = await Promise.allSettled([
    resend.emails.send({
      from: config.demoFromEmail,
      to: demoRequest.email,
      subject: 'We received your Coreves demo request',
      html: renderClientConfirmationEmail(demoRequest),
    }),
    resend.emails.send({
      from: config.demoFromEmail,
      to: config.demoNotificationEmail,
      subject: `New demo request — ${demoRequest.company}`,
      html: renderAdminNotificationEmail(demoRequest),
    }),
  ])

  // The Resend SDK resolves with { data, error } instead of rejecting on API errors,
  // so a failed send must be detected via `.error`, not via allSettled's rejection state.
  const clientFailed = clientResult.status === 'rejected' || !!clientResult.value.error
  const adminFailed = adminResult.status === 'rejected' || !!adminResult.value.error

  if (clientFailed && adminFailed) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to send email right now. Please try again later.',
    })
  }

  if (clientFailed) {
    const reason = clientResult.status === 'rejected' ? clientResult.reason : clientResult.value.error
    console.error('Demo request client confirmation failed:', reason)
  }
  if (adminFailed) {
    const reason = adminResult.status === 'rejected' ? adminResult.reason : adminResult.value.error
    console.error('Demo request admin notification failed:', reason)
  }

  return { success: true }
})
