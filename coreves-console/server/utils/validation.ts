import { z } from 'zod'

const optionalText = (max = 500) => z.string().trim().max(max).nullable().optional()
  .transform(v => (v === '' ? null : v))

export const CustomerBody = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email(),
  contactName: optionalText(200),
  phone: optionalText(50),
  address: optionalText(1000),
  taxId: optionalText(50),
  notes: optionalText(10_000),
})

const domain = z.string().trim().toLowerCase()
  .regex(/^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/, 'A host name like app.lender.co.zm')
const amount = z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount like 1000 or 1000.00')

export const DeploymentCreateBody = z.object({
  /** Becomes BILLING_DEPLOYMENT_ID — lowercase letters, digits and dashes; can never change. */
  slug: z.string().trim().regex(/^[a-z0-9][a-z0-9-]{1,62}$/, 'Lowercase letters, digits and dashes'),
  customerId: z.number().int().positive(),
  domain,
  plan: z.enum(['MONTHLY', 'ANNUAL']).default('MONTHLY'),
  planName: z.string().trim().min(1).max(200).default('CoreVesFin Loans'),
  priceAmount: amount,
  currency: z.string().trim().length(3).toUpperCase().default('ZMW'),
  graceDays: z.number().int().min(0).max(60).default(7),
  notes: optionalText(10_000),
})

export const DeploymentUpdateBody = DeploymentCreateBody.omit({ slug: true, customerId: true }).partial()
