<script setup lang="ts">
const id = Number(useRoute().params.id)
const can = useCan()
const { data, refresh } = await useFetch(`/api/admin/customers/${id}`)
const editing = ref(false)
const form = reactive({ name: '', email: '', contactName: '', phone: '', address: '', taxId: '', notes: '' })
const dep = reactive({ slug: '', domain: '', plan: 'MONTHLY', priceAmount: '1000.00', graceDays: 7 })
const showDep = ref(false)
const err = ref(''); const newKey = ref(''); const newDeploymentId = ref<number | null>(null)

function startEdit() {
  const c = data.value!.customer
  Object.assign(form, { name: c.name, email: c.email, contactName: c.contactName ?? '', phone: c.phone ?? '', address: c.address ?? '', taxId: c.taxId ?? '', notes: c.notes ?? '' })
  editing.value = true
}
async function saveCustomer() {
  err.value = ''
  try { await api(`/api/admin/customers/${id}`, { method: 'PATCH', body: form }); editing.value = false; await refresh() } catch (e) { err.value = errorMessage(e) }
}
async function addDeployment() {
  err.value = ''
  try {
    const res = await api('/api/admin/deployments', { method: 'POST', body: { ...dep, customerId: id, graceDays: Number(dep.graceDays) } })
    newKey.value = res!.apiKey; newDeploymentId.value = res!.deployment.id; showDep.value = false
    await refresh()
  } catch (e) { err.value = errorMessage(e) }
}
</script>

<template>
  <div v-if="data" class="max-w-4xl">
    <PageHeader :title="data.customer.name" eyebrow="Customer">
      <button v-if="can.write.value && !editing" class="btn-outline" @click="startEdit">Edit</button>
    </PageHeader>

    <div v-if="!editing" class="card grid gap-3 text-sm sm:grid-cols-2">
      <p><span class="mono-label">Billing email</span><br>{{ data.customer.email }}</p>
      <p><span class="mono-label">Contact</span><br>{{ data.customer.contactName || '—' }} · {{ data.customer.phone || '—' }}</p>
      <p><span class="mono-label">TPIN</span><br>{{ data.customer.taxId || '—' }}</p>
      <p><span class="mono-label">Address</span><br><span class="whitespace-pre-wrap">{{ data.customer.address || '—' }}</span></p>
      <p v-if="data.customer.notes" class="sm:col-span-2"><span class="mono-label">Notes</span><br><span class="whitespace-pre-wrap">{{ data.customer.notes }}</span></p>
    </div>
    <form v-else class="card grid gap-3 sm:grid-cols-2" @submit.prevent="saveCustomer">
      <div class="sm:col-span-2"><label class="label">Company name</label><input v-model="form.name" class="field" required></div>
      <div><label class="label">Billing email</label><input v-model="form.email" type="email" class="field" required></div>
      <div><label class="label">Contact person</label><input v-model="form.contactName" class="field"></div>
      <div><label class="label">Phone</label><input v-model="form.phone" class="field"></div>
      <div><label class="label">TPIN</label><input v-model="form.taxId" class="field"></div>
      <div class="sm:col-span-2"><label class="label">Address</label><textarea v-model="form.address" rows="2" class="field" /></div>
      <div class="sm:col-span-2"><label class="label">Notes</label><textarea v-model="form.notes" rows="3" class="field" /></div>
      <div class="flex gap-2"><button class="btn-dark">Save</button><button type="button" class="btn-ghost" @click="editing = false">Cancel</button></div>
    </form>

    <section class="card mt-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Deployments</h2>
        <button v-if="can.write.value && !showDep" class="btn-outline" @click="showDep = true">Add deployment</button>
      </div>
      <ApiKeyReveal v-if="newKey" :api-key="newKey" class="mt-3" />
      <NuxtLink v-if="newDeploymentId" :to="`/deployments/${newDeploymentId}`" class="text-link mt-2 inline-block text-sm underline">Open the new deployment →</NuxtLink>

      <form v-if="showDep" class="mt-4 grid gap-3 rounded-[8px] bg-soft-stone/50 p-4 sm:grid-cols-2" @submit.prevent="addDeployment">
        <div><label class="label">Deployment id (permanent)</label><input v-model="dep.slug" class="field" placeholder="acme-loans" pattern="[a-z0-9][a-z0-9-]{1,62}" required></div>
        <div><label class="label">App domain</label><input v-model="dep.domain" class="field" placeholder="app.acmelending.co.zm" required></div>
        <div><label class="label">Plan</label><select v-model="dep.plan" class="field"><option value="MONTHLY">Monthly</option><option value="ANNUAL">Annual</option></select></div>
        <div><label class="label">Price per period (ZMW)</label><input v-model="dep.priceAmount" class="field" required></div>
        <div><label class="label">Grace days</label><input v-model="dep.graceDays" type="number" min="0" max="60" class="field"></div>
        <div class="flex items-end gap-2"><button class="btn-dark">Create</button><button type="button" class="btn-ghost" @click="showDep = false">Cancel</button></div>
      </form>

      <p v-if="!data.deployments.length && !showDep" class="mt-2 text-sm text-body-muted">No deployments yet.</p>
      <table v-else-if="data.deployments.length" class="table mt-3">
        <thead><tr><th>Deployment</th><th>Plan</th><th>Paid through</th><th>Last seen</th></tr></thead>
        <tbody>
          <tr v-for="d in data.deployments" :key="d.id" class="link" @click="navigateTo(`/deployments/${d.id}`)">
            <td><p class="font-medium">{{ d.slug }}</p><p class="text-xs text-body-muted">{{ d.domain }}</p></td>
            <td>{{ d.plan.toLowerCase() }} <span v-if="d.cancelledAt" class="badge-grey">cancelled</span></td>
            <td>{{ day(d.paidThrough) }}</td>
            <td>{{ ago(d.lastSeenAt) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card mt-6">
      <h2 class="text-lg font-semibold">Invoices</h2>
      <p v-if="!data.invoices.length" class="mt-2 text-sm text-body-muted">No invoices yet.</p>
      <table v-else class="table mt-3">
        <tbody>
          <tr v-for="i in data.invoices" :key="i.id" class="link" @click="navigateTo(`/invoices/${i.id}`)">
            <td class="font-medium">{{ i.number }}</td><td>{{ day(i.periodStart) }} – {{ day(i.periodEnd) }}</td>
            <td>{{ money(i.amount, i.currency) }}</td><td><Badge :value="i.status" /></td>
          </tr>
        </tbody>
      </table>
    </section>
    <Notice v-if="err" tone="error" class="mt-4">{{ err }}</Notice>
  </div>
</template>
