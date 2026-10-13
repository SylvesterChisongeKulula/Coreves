<script setup lang="ts">
const id = Number(useRoute().params.id)
const can = useCan()
const { data, refresh } = await useFetch(`/api/admin/invoices/${id}`)
const err = ref(''); const ok = ref(''); const busy = ref(false)
const pay = reactive({ open: false, amount: '', paidAt: today(), method: 'BANK_TRANSFER', reference: '' })

const paidSoFar = computed(() => (data.value?.payments ?? []).reduce((s, p) => s + Number(p.amount), 0))
const outstanding = computed(() => data.value ? Math.max(0, Number(data.value.invoice.amount) - paidSoFar.value) : 0)

async function run(fn: () => Promise<unknown>) {
  busy.value = true; err.value = ''; ok.value = ''
  try { await fn(); await refresh() } catch (e) { err.value = errorMessage(e) } finally { busy.value = false }
}
const send = () => run(async () => {
  await api(`/api/admin/invoices/${id}/send`, { method: 'POST' })
  ok.value = `Emailed to ${data.value!.customer.email}.`
})
const voidIt = () => confirm('Void this invoice?') && run(() => api(`/api/admin/invoices/${id}/void`, { method: 'POST' }))
function openPay() { pay.amount = outstanding.value.toFixed(2); pay.open = true }
const record = () => run(async () => {
  const res = await api(`/api/admin/invoices/${id}/payments`, { method: 'POST', body: { ...pay, open: undefined } })
  pay.open = false
  ok.value = res.fullyPaid
    ? `Paid in full. Access extended to ${day(res.paidThrough)} and a new licence signed — the client server picks it up within the hour (or on "Check now").`
    : `Part-payment recorded. Still outstanding: ${money(res.outstanding, data.value!.invoice.currency)}.`
})
</script>

<template>
  <div v-if="data" class="max-w-3xl">
    <PageHeader :title="data.invoice.number" :eyebrow="data.customer.name">
      <NuxtLink :to="`/invoices/${id}/print`" target="_blank" class="btn-ghost">Print / PDF</NuxtLink>
      <template v-if="can.write.value && (data.invoice.status === 'DRAFT' || data.invoice.status === 'SENT')">
        <button class="btn-outline" :disabled="busy" @click="send">{{ data.invoice.status === 'SENT' ? 'Resend' : 'Send' }}</button>
        <button class="btn-dark" :disabled="busy" @click="openPay">Record payment</button>
      </template>
    </PageHeader>

    <Notice v-if="ok" tone="ok" class="mb-4">{{ ok }}</Notice>
    <Notice v-if="err" tone="error" class="mb-4">{{ err }}</Notice>

    <form v-if="pay.open" class="card mb-4 grid gap-3 sm:grid-cols-2" @submit.prevent="record">
      <div><label class="label">Amount received</label><input v-model="pay.amount" class="field" required></div>
      <div><label class="label">Date received</label><input v-model="pay.paidAt" type="date" class="field" required></div>
      <div><label class="label">Method</label><select v-model="pay.method" class="field"><option value="BANK_TRANSFER">Bank transfer</option><option value="MOBILE_MONEY">Mobile money</option><option value="OTHER">Other</option></select></div>
      <div><label class="label">Reference</label><input v-model="pay.reference" class="field" placeholder="Bank reference"></div>
      <div class="flex gap-2 sm:col-span-2"><button class="btn-dark" :disabled="busy">Record payment</button><button type="button" class="btn-ghost" @click="pay.open = false">Cancel</button></div>
    </form>

    <div class="card text-sm">
      <div class="flex items-start justify-between">
        <div><p class="mono-label">Status</p><p class="mt-1"><Badge :value="data.invoice.status" /></p></div>
        <div class="text-right"><p class="mono-label">Amount</p><p class="mt-1 font-display text-2xl">{{ money(data.invoice.amount, data.invoice.currency) }}</p></div>
      </div>
      <dl class="mt-4 grid gap-3 border-t border-border-light pt-4 sm:grid-cols-2">
        <div><dt class="mono-label">Description</dt><dd>{{ data.invoice.description }}</dd></div>
        <div><dt class="mono-label">Deployment</dt><dd><NuxtLink :to="`/deployments/${data.deployment.id}`" class="underline">{{ data.deployment.slug }}</NuxtLink></dd></div>
        <div><dt class="mono-label">Issued / due</dt><dd>{{ day(data.invoice.issuedAt) }} / {{ day(data.invoice.dueAt) }}</dd></div>
        <div><dt class="mono-label">Sent</dt><dd>{{ data.invoice.sentAt ? ago(data.invoice.sentAt) : 'not yet' }}</dd></div>
      </dl>
    </div>

    <section class="card mt-4">
      <h2 class="text-lg font-semibold">Payments</h2>
      <p v-if="!data.payments.length" class="mt-2 text-sm text-body-muted">None recorded.</p>
      <table v-else class="table mt-3">
        <tbody>
          <tr v-for="p in data.payments" :key="p.id">
            <td>{{ day(p.paidAt) }}</td><td>{{ money(p.amount, data.invoice.currency) }}</td>
            <td>{{ p.method.replace('_', ' ').toLowerCase() }}</td><td class="text-body-muted">{{ p.reference || '' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="data.invoice.status !== 'PAID' && data.payments.length" class="mt-2 text-sm">Outstanding: <strong>{{ money(outstanding, data.invoice.currency) }}</strong></p>
    </section>

    <button v-if="can.write.value && data.invoice.status !== 'PAID' && data.invoice.status !== 'VOID'" class="btn-danger mt-6" @click="voidIt">Void invoice</button>
  </div>
</template>
