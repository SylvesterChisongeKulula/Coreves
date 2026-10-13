import type { schema } from '../db'

type Invoice = typeof schema.invoices.$inferSelect
type Customer = typeof schema.customers.$inferSelect
type Settings = typeof schema.settings.$inferSelect

const wrap = (body: string) => `
<div style="font-family:Inter,Arial,sans-serif;color:#212121;max-width:600px;margin:0 auto;line-height:1.5">
  ${body}
  <p style="color:#93939f;font-size:12px;margin-top:32px">Coreves · coreves.software</p>
</div>`

const row = (k: string, v: string) =>
  `<tr><td style="padding:4px 16px 4px 0;color:#616161">${k}</td><td style="padding:4px 0"><strong>${v}</strong></td></tr>`

export function renderInvoiceEmail(i: Invoice, c: Customer, s: Settings) {
  const total = formatMoney(i.amount, i.currency)
  const printUrl = `${useRuntimeConfig().public.consoleUrl}/invoices/${i.id}/print`
  const html = wrap(`
    <h2 style="margin:0 0 8px">Invoice ${escapeHtml(i.number)}</h2>
    <p>Dear ${escapeHtml(c.contactName || c.name)},</p>
    <p>Please find your invoice from ${escapeHtml(s.legalName)} below.</p>
    <table style="border-collapse:collapse;margin:16px 0">
      ${row('Billed to', escapeHtml(c.name))}
      ${row('Description', escapeHtml(i.description))}
      ${row('Amount due', total)}
      ${row('Issued', i.issuedAt)}
      ${row('Due by', i.dueAt)}
    </table>
    ${s.bankDetails ? `<p style="margin-bottom:4px"><strong>Pay by bank transfer to:</strong></p>
      <pre style="font-family:inherit;background:#eeece7;padding:12px;border-radius:8px;white-space:pre-wrap">${escapeHtml(s.bankDetails)}</pre>
      <p>Please use <strong>${escapeHtml(i.number)}</strong> as the payment reference.</p>` : ''}
    <p>A printable copy: <a href="${printUrl}">${printUrl}</a></p>
    ${s.invoiceFooter ? `<p style="color:#616161;font-size:13px">${escapeHtml(s.invoiceFooter)}</p>` : ''}
  `)
  const text = [
    `Invoice ${i.number} from ${s.legalName}`,
    `Billed to: ${c.name}`, `Description: ${i.description}`, `Amount due: ${total}`,
    `Issued: ${i.issuedAt}`, `Due by: ${i.dueAt}`,
    s.bankDetails ? `\nPay by bank transfer to:\n${s.bankDetails}\nReference: ${i.number}` : '',
  ].join('\n')
  return { subject: `Invoice ${i.number} — ${total} due ${i.dueAt}`, html, text }
}

export function renderReceiptEmail(i: Invoice, c: Customer, p: { amount: string, paidAt: string, reference?: string }) {
  const html = wrap(`
    <h2 style="margin:0 0 8px">Payment received — thank you</h2>
    <p>Dear ${escapeHtml(c.contactName || c.name)},</p>
    <p>We have received your payment for invoice <strong>${escapeHtml(i.number)}</strong>.</p>
    <table style="border-collapse:collapse;margin:16px 0">
      ${row('Amount', formatMoney(p.amount, i.currency))}
      ${row('Received', p.paidAt)}
      ${p.reference ? row('Reference', escapeHtml(p.reference)) : ''}
      ${row('Covers', `${i.periodStart} to ${i.periodEnd}`)}
    </table>
    <p>Your CoreVesFin licence has been extended to ${i.periodEnd} and is delivered to your server automatically.</p>
  `)
  const text = `Payment received for invoice ${i.number}: ${formatMoney(p.amount, i.currency)} on ${p.paidAt}. `
    + `Your licence now runs to ${i.periodEnd}.`
  return { subject: `Receipt for invoice ${i.number}`, html, text }
}
