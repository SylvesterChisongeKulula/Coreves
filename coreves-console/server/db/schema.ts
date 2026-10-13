import { sql } from 'drizzle-orm'
import {
  boolean, date, index, integer, jsonb, numeric, pgTable, serial, text, timestamp, uniqueIndex,
} from 'drizzle-orm/pg-core'

const ts = (name: string) => timestamp(name, { withTimezone: true, mode: 'date' })
const money = (name: string) => numeric(name, { precision: 12, scale: 2 })

// ── Team ─────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['OWNER', 'BILLING', 'VIEWER'] }).notNull(),
  active: boolean('active').notNull().default(true),
  createdAt: ts('created_at').notNull().defaultNow(),
}, t => [uniqueIndex('users_email_uq').on(sql`lower(${t.email})`)])

export const loginCodes = pgTable('login_codes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  codeHash: text('code_hash').notNull(),
  expiresAt: ts('expires_at').notNull(),
  attempts: integer('attempts').notNull().default(0),
  usedAt: ts('used_at'),
  createdAt: ts('created_at').notNull().defaultNow(),
})

// ── Sales ────────────────────────────────────────────────────────────────────

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  contactName: text('contact_name'),
  email: text('email').notNull(),
  phone: text('phone'),
  address: text('address'),
  taxId: text('tax_id'),
  notes: text('notes'),
  createdAt: ts('created_at').notNull().defaultNow(),
})

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  company: text('company').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  inquiryType: text('inquiry_type'),
  message: text('message'),
  source: text('source').notNull().default('website'),
  status: text('status', { enum: ['NEW', 'CONTACTED', 'DEMO', 'WON', 'LOST'] }).notNull().default('NEW'),
  notes: text('notes'),
  customerId: integer('customer_id').references(() => customers.id, { onDelete: 'set null' }),
  receivedAt: ts('received_at').notNull().defaultNow(),
}, t => [index('leads_received_idx').on(t.receivedAt)])

// ── Licensing ────────────────────────────────────────────────────────────────

export const deployments = pgTable('deployments', {
  id: serial('id').primaryKey(),
  /** = BILLING_DEPLOYMENT_ID on the client server and the licence `sub`. Immutable. */
  slug: text('slug').notNull().unique(),
  customerId: integer('customer_id').notNull().references(() => customers.id),
  /** = APP_DOMAIN on the client server and the licence `domain`. */
  domain: text('domain').notNull(),
  plan: text('plan', { enum: ['MONTHLY', 'ANNUAL'] }).notNull().default('MONTHLY'),
  planName: text('plan_name').notNull().default('CoreVesFin Loans'),
  priceAmount: money('price_amount').notNull(),
  currency: text('currency').notNull().default('ZMW'),
  graceDays: integer('grace_days').notNull().default(7),
  paidThrough: ts('paid_through'),
  cancelledAt: ts('cancelled_at'),
  apiKeyHash: text('api_key_hash').notNull(),
  apiKeyPrefix: text('api_key_prefix').notNull(),
  lastSeenAt: ts('last_seen_at'),
  lastSeenIp: text('last_seen_ip'),
  lastEnforcement: text('last_enforcement'),
  notes: text('notes'),
  createdAt: ts('created_at').notNull().defaultNow(),
})

export const licences = pgTable('licences', {
  id: serial('id').primaryKey(),
  deploymentId: integer('deployment_id').notNull().references(() => deployments.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  domain: text('domain').notNull(),
  paidThrough: ts('paid_through').notNull(),
  graceDays: integer('grace_days').notNull(),
  issuedAt: ts('issued_at').notNull(),
  issuedBy: integer('issued_by').references(() => users.id, { onDelete: 'set null' }),
  reason: text('reason').notNull(),
}, t => [index('licences_deployment_idx').on(t.deploymentId, t.issuedAt)])

// ── Billing ──────────────────────────────────────────────────────────────────

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  number: text('number').notNull().unique(),
  customerId: integer('customer_id').notNull().references(() => customers.id),
  deploymentId: integer('deployment_id').notNull().references(() => deployments.id),
  description: text('description').notNull(),
  periodStart: date('period_start', { mode: 'string' }).notNull(),
  periodEnd: date('period_end', { mode: 'string' }).notNull(),
  amount: money('amount').notNull(),
  currency: text('currency').notNull(),
  status: text('status', { enum: ['DRAFT', 'SENT', 'PAID', 'VOID'] }).notNull().default('DRAFT'),
  issuedAt: date('issued_at', { mode: 'string' }).notNull(),
  dueAt: date('due_at', { mode: 'string' }).notNull(),
  sentAt: ts('sent_at'),
  paidAt: ts('paid_at'),
  createdAt: ts('created_at').notNull().defaultNow(),
}, t => [uniqueIndex('invoices_period_uq').on(t.deploymentId, t.periodStart).where(sql`${t.status} <> 'VOID'`)])

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').notNull().references(() => invoices.id),
  amount: money('amount').notNull(),
  paidAt: date('paid_at', { mode: 'string' }).notNull(),
  method: text('method', { enum: ['BANK_TRANSFER', 'MOBILE_MONEY', 'OTHER'] }).notNull(),
  reference: text('reference'),
  recordedBy: integer('recorded_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: ts('created_at').notNull().defaultNow(),
})

// ── Settings + audit ─────────────────────────────────────────────────────────

export const settings = pgTable('settings', {
  id: integer('id').primaryKey().default(1),
  legalName: text('legal_name').notNull().default('Coreves'),
  address: text('address'),
  taxId: text('tax_id'),
  email: text('email'),
  phone: text('phone'),
  bankDetails: text('bank_details'),
  invoiceFooter: text('invoice_footer'),
  paymentTermsDays: integer('payment_terms_days').notNull().default(7),
  invoiceYear: integer('invoice_year').notNull().default(0),
  invoiceSequence: integer('invoice_sequence').notNull().default(0),
  updatedAt: ts('updated_at').notNull().defaultNow(),
})

export const auditLog = pgTable('audit_log', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: integer('entity_id'),
  detail: jsonb('detail'),
  at: ts('at').notNull().defaultNow(),
}, t => [index('audit_entity_idx').on(t.entity, t.entityId)])
