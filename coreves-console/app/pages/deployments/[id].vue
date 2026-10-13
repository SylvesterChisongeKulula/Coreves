<script setup lang="ts">
const id = Number(useRoute().params.id)
const can = useCan()
const { data, refresh } = await useFetch(`/api/admin/deployments/${id}`)
const err = ref(''); const ok = ref(''); const newKey = ref(''); const licence = ref('')
const edit = reactive({ open: false, domain: '', plan: 'MONTHLY', priceAmount: '', graceDays: 7, planName: '' })
const manual = reactive({ open: false, paidThrough: '', reason: '' })

const envBlock = computed(() => data.value
  ? `BILLING_DEPLOYMENT_ID=${data.value.clientEnv.BILLING_DEPLOYMENT_ID}\nBILLING_API_URL=${data.value.clientEnv.BILLING_API_URL}\nBILLING_API_KEY=<the key shown when the deployment was created>\nAPP_DOMAIN=${data.value.clientEnv.APP_DOMAIN}`
  : '')

async function run(fn: () => Promise<unknown>, success: string) {
  err.value = ''; ok.value = ''
  try { await fn(); ok.value = success; await refresh() } catch (e) { err.value = errorMessage(e) }
}
function openEdit() {
  const d = data.value!.deployment
  Object.assign(edit, { open: true, domain: d.domain, plan: d.plan, priceAmount: d.priceAmount, graceDays: d.graceDays, planName: d.planName })
}
const saveEdit = () => run(async () => {
  const { open: _o, ...body } = edit
  await api(`/api/admin/deployments/${id}`, { method: 'PATCH', body: { ...body, graceDays: Number(body.graceDays) } })
  edit.open = false
}, 'Saved. If the domain or grace days changed, the next poll issues a new licence.')
const createInvoice = () => run(async () => {
  const inv = await api('/api/admin/invoices', { method: 'POST', body: { deploymentId: id } })
  await navigateTo(`/invoices/${inv!.id}`)
}, '')
const setPaidThrough = () => run(async () => {
  await api(`/api/admin/deployments/${id}/paid-through`, { method: 'POST', body: { paidThrough: manual.paidThrough, reason: manual.reason } })
  manual.open = false
}, 'Paid-through updated and a new licence signed.')
const rotate = () => {
  if (!confirm('Issue a new API key? The client server stops syncing until its .env is updated.')) return
  return run(async () => { newKey.value = (await api(`/api/admin/deployments/${id}/rotate-key`, { method: 'POST' })).apiKey }, '')
}
const cancel = () => {
  if (!confirm('Cancel this deployment? Its app goes read-only on the next sync.')) return
  return run(() => api(`/api/admin/deployments/${id}/cancel`, { method: 'POST' }), 'Cancelled.')
}
const reactivate = () => run(() => api(`/api/admin/deployments/${id}/reactivate`, { method: 'POST' }), 'Reactivated.')
const copyLicence = () => run(async () => {
  const res = await api(`/api/admin/deployments/${id}/licence`)
  licence.value = res.token
  await navigator.clipboard.writeText(res.token).catch(() => {})
}, 'Licence copied — paste it on the client\'s Settings → Subscription page.')
</script>

<template>
  <div v-if="data" class="max-w-4xl">
    <PageHeader :title="data.deployment.slug" :eyebrow="data.customer.name">
      <template v-if="can.write.value">
        <button v-if="!data.deployment.cancelledAt" class="btn-dark" @click="createInvoice">Invoice next period</button>
        <button class="btn-outline" @click="copyLicence">Copy licence</button>
      </template>
    </PageHeader>

    <div class="grid gap-4 sm:grid-cols-3">
      <div class="card"><p class="mono-label">Access</p><p class="mt-2"><Badge :value="data.deployment.state" /></p><p class="mt-1 text-sm text-body-muted">Paid through {{ day(data.deployment.paidThrough) }}</p></div>
      <div class="card"><p class="mono-label">Last seen</p><p class="mt-2 text-sm">{{ ago(data.deployment.lastSeenAt) }}</p><p class="mt-1 text-xs text-body-muted">{{ data.deployment.lastSeenIp || '' }}</p></div>
      <div class="card"><p class="mono-label">Enforcement</p><p class="mt-2"><span v-if="data.deployment.lastEnforcement === 'off'" class="badge-red">off — investigate</span><span v-else-if="data.deployment.lastEnforcement === 'on'" class="badge-green">on</span><span v-else class="badge-grey">not reported yet</span></p></div>
    </div>

    <ApiKeyReveal v-if="newKey" :api-key="newKey" class="mt-4" />
    <Notice v-if="ok" tone="ok" class="mt-4">{{ ok }}</Notice>
    <Notice v-if="err" tone="error" class="mt-4">{{ err }}</Notice>
    <div v-if="licence" class="card mt-4"><p class="mono-label">Current licence</p><code class="mt-2 block break-all font-mono text-xs">{{ licence }}</code></div>

    <section class="card mt-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Terms</h2>
        <button v-if="can.write.value && !edit.open" class="btn-ghost" @click="openEdit">Edit</button>
      </div>
      <dl v-if="!edit.open" class="mt-3 grid gap-3 text-sm sm:grid-cols-4">
        <div><dt class="mono-label">Domain</dt><dd>{{ data.deployment.domain }}</dd></div>
        <div><dt class="mono-label">Plan</dt><dd>{{ data.deployment.planName }} · {{ data.deployment.plan.toLowerCase() }}</dd></div>
        <div><dt class="mono-label">Price</dt><dd>{{ money(data.deployment.priceAmount, data.deployment.currency) }}</dd></div>
        <div><dt class="mono-label">Grace</dt><dd>{{ data.deployment.graceDays }} days</dd></div>
      </dl>
      <form v-else class="mt-3 grid gap-3 sm:grid-cols-2" @submit.prevent="saveEdit">
        <div><label class="label">Domain</label><input v-model="edit.domain" class="field"></div>
        <div><label class="label">Plan name</label><input v-model="edit.planName" class="field"></div>
        <div><label class="label">Billing</label><select v-model="edit.plan" class="field"><option value="MONTHLY">Monthly</option><option value="ANNUAL">Annual</option></select></div>
        <div><label class="label">Price</label><input v-model="edit.priceAmount" class="field"></div>
        <div><label class="label">Grace days</label><input v-model="edit.graceDays" type="number" class="field"></div>
        <div class="flex items-end gap-2"><button class="btn-dark">Save</button><button type="button" class="btn-ghost" @click="edit.open = false">Cancel</button></div>
      </form>
    </section>

    <section class="card mt-6">
      <h2 class="text-lg font-semibold">Client server settings</h2>
      <p class="mt-1 text-sm text-body-muted">These go in the client's <code>/opt/corevesfin/.env</code>.</p>
      <pre class="mt-3 overflow-x-auto rounded-[8px] bg-soft-stone p-3 font-mono text-xs">{{ envBlock }}</pre>
      <p class="mt-2 text-xs text-body-muted">API key prefix: <code>{{ data.deployment.apiKeyPrefix }}…</code></p>
    </section>

    <section class="card mt-6">
      <h2 class="text-lg font-semibold">Invoices</h2>
      <p class="mt-1 text-sm text-body-muted">Next period: {{ day(data.nextPeriod.periodStart) }} – {{ day(data.nextPeriod.periodEnd) }}</p>
      <table v-if="data.invoices.length" class="table mt-3">
        <tbody>
          <tr v-for="i in data.invoices" :key="i.id" class="link" @click="navigateTo(`/invoices/${i.id}`)">
            <td class="font-medium">{{ i.number }}</td><td>{{ day(i.periodStart) }} – {{ day(i.periodEnd) }}</td>
            <td>{{ money(i.amount, i.currency) }}</td><td><Badge :value="i.status" /></td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card mt-6">
      <h2 class="text-lg font-semibold">Licences</h2>
      <p v-if="!data.licences.length" class="mt-2 text-sm text-body-muted">None yet — one is signed when the first invoice is paid.</p>
      <table v-else class="table mt-3">
        <thead><tr><th>Issued</th><th>Paid through</th><th>Grace</th><th>Reason</th></tr></thead>
        <tbody>
          <tr v-for="l in data.licences" :key="l.id">
            <td>{{ day(l.issuedAt) }} <span class="text-xs text-body-muted">{{ ago(l.issuedAt) }}</span></td>
            <td>{{ day(l.paidThrough) }}</td><td>{{ l.graceDays }}d</td><td class="text-body-muted">{{ l.reason }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-if="can.write.value" class="card mt-6">
      <h2 class="text-lg font-semibold">Admin actions</h2>
      <div class="mt-3 flex flex-wrap gap-2">
        <button class="btn-outline" @click="manual.open = !manual.open">Set paid-through manually</button>
        <button class="btn-outline" @click="rotate">Rotate API key</button>
        <button v-if="!data.deployment.cancelledAt" class="btn-danger" @click="cancel">Cancel deployment</button>
        <button v-else class="btn-outline" @click="reactivate">Reactivate</button>
      </div>
      <form v-if="manual.open" class="mt-4 grid gap-3 sm:grid-cols-3" @submit.prevent="setPaidThrough">
        <div><label class="label">Paid through (date)</label><input v-model="manual.paidThrough" type="date" class="field" required></div>
        <div class="sm:col-span-2"><label class="label">Reason (audited)</label><input v-model="manual.reason" class="field" placeholder="Go-live before first invoice" required minlength="3"></div>
        <div><button class="btn-dark">Set and sign licence</button></div>
      </form>
    </section>
  </div>
</template>
