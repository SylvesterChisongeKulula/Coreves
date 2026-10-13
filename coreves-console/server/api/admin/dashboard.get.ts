import { desc, eq, gte, inArray, isNull, sql } from 'drizzle-orm'
import { useDb, schema } from '../../db'

const DAY = 86_400_000

export default defineEventHandler(async () => {
  const db = useDb()
  const now = new Date()
  const today = toDay(now)

  const rows = await db.select({ d: schema.deployments, customer: schema.customers.name })
    .from(schema.deployments)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.deployments.customerId))
    .where(isNull(schema.deployments.cancelledAt))

  const deployments = rows.map(({ d, customer }) => ({
    id: d.id, slug: d.slug, domain: d.domain, customer,
    state: accessState(d.paidThrough, d.graceDays, now),
    paidThrough: d.paidThrough,
    daysLeft: d.paidThrough ? Math.floor((d.paidThrough.getTime() - now.getTime()) / DAY) : null,
    lastSeenAt: d.lastSeenAt,
    notSeen: !d.lastSeenAt || now.getTime() - d.lastSeenAt.getTime() > DAY,
    enforcementOff: d.lastEnforcement === 'off',
  }))

  const [revenue] = await db.select({ total: sql<string>`coalesce(sum(${schema.payments.amount}), 0)` })
    .from(schema.payments).where(gte(schema.payments.paidAt, `${today.slice(0, 7)}-01`))
  const [newLeads] = await db.select({ n: sql<number>`count(*)::int` }).from(schema.leads)
    .where(eq(schema.leads.status, 'NEW'))
  const openInvoices = await db.select({
    id: schema.invoices.id, number: schema.invoices.number, amount: schema.invoices.amount,
    currency: schema.invoices.currency, dueAt: schema.invoices.dueAt, status: schema.invoices.status,
    customer: schema.customers.name,
  }).from(schema.invoices)
    .innerJoin(schema.customers, eq(schema.customers.id, schema.invoices.customerId))
    .where(inArray(schema.invoices.status, ['DRAFT', 'SENT']))
    .orderBy(schema.invoices.dueAt).limit(20)
  const recentLeads = await db.select().from(schema.leads).orderBy(desc(schema.leads.receivedAt)).limit(5)

  return {
    deployments,
    attention: deployments.filter(d => d.state !== 'ACTIVE' || d.notSeen || d.enforcementOff
      || (d.daysLeft !== null && d.daysLeft <= 7)),
    revenueThisMonth: revenue?.total ?? '0',
    newLeads: newLeads?.n ?? 0,
    openInvoices: openInvoices.map(i => ({ ...i, overdue: i.dueAt < today })),
    recentLeads,
  }
})
