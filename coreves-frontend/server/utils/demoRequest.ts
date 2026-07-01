export interface DemoRequestBody {
  name: string
  company: string
  email: string
  phone: string
  message: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateDemoRequest(body: Partial<DemoRequestBody>): string[] {
  const errors: string[] = []
  if (!body.name?.trim()) errors.push('Full name is required.')
  if (!body.company?.trim()) errors.push('Institution is required.')
  if (!body.email?.trim() || !EMAIL_RE.test(body.email.trim())) errors.push('A valid email is required.')
  if (!body.phone?.trim()) errors.push('Phone number is required.')
  if (!body.message?.trim()) errors.push('Please tell us how we can help.')
  return errors
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function renderClientConfirmationEmail(body: DemoRequestBody): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #1a1a1a;">
      <h2>Thanks for reaching out, ${escapeHtml(body.name)}.</h2>
      <p>We received your request for a Coreves Finance demo on behalf of
      <strong>${escapeHtml(body.company)}</strong>. Our team will reach out to
      ${escapeHtml(body.email)} or ${escapeHtml(body.phone)} shortly to schedule
      a walkthrough tailored to your lending operation.</p>
      <p>Your message:</p>
      <blockquote style="border-left: 3px solid #ccc; margin: 0; padding-left: 12px; color: #555;">
        ${escapeHtml(body.message)}
      </blockquote>
      <p>— The Coreves team</p>
    </div>
  `
}

export function renderAdminNotificationEmail(body: DemoRequestBody): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #1a1a1a;">
      <h2>New demo request</h2>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(body.name)}</li>
        <li><strong>Institution:</strong> ${escapeHtml(body.company)}</li>
        <li><strong>Email:</strong> ${escapeHtml(body.email)}</li>
        <li><strong>Phone:</strong> ${escapeHtml(body.phone)}</li>
      </ul>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(body.message)}</p>
    </div>
  `
}
