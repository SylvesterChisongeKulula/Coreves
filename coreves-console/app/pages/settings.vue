<script setup lang="ts">
const can = useCan()
const { data } = await useFetch('/api/admin/settings')
const form = reactive({ legalName: '', address: '', taxId: '', email: '', phone: '', bankDetails: '', invoiceFooter: '', paymentTermsDays: 7 })
watchEffect(() => { if (data.value) Object.assign(form, Object.fromEntries(Object.keys(form).map(k => [k, (data.value as Record<string, unknown>)[k] ?? '']))) })
const err = ref(''); const ok = ref('')
async function save() {
  err.value = ''; ok.value = ''
  try { await api('/api/admin/settings', { method: 'PATCH', body: { ...form, paymentTermsDays: Number(form.paymentTermsDays) } }); ok.value = 'Saved.' } catch (e) { err.value = errorMessage(e) }
}
</script>

<template>
  <div class="max-w-2xl">
    <PageHeader title="Settings" eyebrow="Shown on invoices" />
    <form class="card grid gap-3" @submit.prevent="save">
      <fieldset :disabled="!can.admin.value" class="grid gap-3">
        <div><label class="label">Legal name</label><input v-model="form.legalName" class="field" required></div>
        <div class="grid gap-3 sm:grid-cols-2">
          <div><label class="label">TPIN</label><input v-model="form.taxId" class="field"></div>
          <div><label class="label">Payment terms (days)</label><input v-model="form.paymentTermsDays" type="number" min="0" max="90" class="field"></div>
          <div><label class="label">Email</label><input v-model="form.email" class="field"></div>
          <div><label class="label">Phone</label><input v-model="form.phone" class="field"></div>
        </div>
        <div><label class="label">Address</label><textarea v-model="form.address" rows="2" class="field" /></div>
        <div><label class="label">Bank details (printed on invoices)</label><textarea v-model="form.bankDetails" rows="5" class="field font-mono" placeholder="Bank: …&#10;Account name: …&#10;Account number: …&#10;Branch / sort code: …" /></div>
        <div><label class="label">Invoice footer</label><textarea v-model="form.invoiceFooter" rows="2" class="field" /></div>
      </fieldset>
      <button v-if="can.admin.value" class="btn-dark w-fit">Save</button>
      <p v-else class="text-xs text-body-muted">Only owners can change settings.</p>
      <Notice v-if="ok" tone="ok">{{ ok }}</Notice>
      <Notice v-if="err" tone="error">{{ err }}</Notice>
    </form>
  </div>
</template>
