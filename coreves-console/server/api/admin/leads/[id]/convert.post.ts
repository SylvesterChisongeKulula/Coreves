import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../../../db'

/** Turn a lead into a customer (pre-filled from the enquiry) and mark it WON. */
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { user } = await requireUserSession(event)
  const db = useDb()
  return db.transaction(async (tx) => {
    const [lead] = await tx.select().from(schema.leads).where(eq(schema.leads.id, id)).for('update')
    if (!lead) throw createError({ statusCode: 404, statusMessage: 'Lead not found' })
    if (lead.customerId) return { customerId: lead.customerId }
    const [customer] = await tx.insert(schema.customers).values({
      name: lead.company, contactName: lead.name, email: lead.email, phone: lead.phone,
      notes: lead.message ? `From website enquiry: ${lead.message}` : null,
    }).returning()
    await tx.update(schema.leads).set({ customerId: customer!.id, status: 'WON' }).where(eq(schema.leads.id, id))
    await audit(tx, user.id, 'lead.convert', 'lead', id, { customerId: customer!.id })
    return { customerId: customer!.id }
  })
})
