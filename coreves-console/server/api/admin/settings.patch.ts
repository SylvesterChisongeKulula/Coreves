import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../db'

const text = z.string().trim().max(2000).nullable().optional()
const Body = z.object({
  legalName: z.string().trim().min(1).max(200).optional(),
  address: text, taxId: text, email: text, phone: text, bankDetails: text, invoiceFooter: text,
  paymentTermsDays: z.number().int().min(0).max(90).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, Body.parse)
  const { user } = await requireUserSession(event)
  const db = useDb()
  const [s] = await db.update(schema.settings).set({ ...body, updatedAt: new Date() })
    .where(eq(schema.settings.id, 1)).returning()
  await audit(db, user.id, 'settings.update', 'settings', 1, body)
  return s
})
