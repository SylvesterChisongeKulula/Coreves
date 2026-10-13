<script setup lang="ts">
const id = useRoute().params.id
const can = useCan()
const { data: lead, refresh } = await useFetch(`/api/admin/leads/${id}`)
const notes = ref(lead.value?.notes ?? '')
const msg = ref(''); const err = ref('')

async function update(body: Record<string, unknown>) {
  err.value = ''; msg.value = ''
  try { await api(`/api/admin/leads/${id}`, { method: 'PATCH', body }); await refresh(); msg.value = 'Saved' } catch (e) { err.value = errorMessage(e) }
}
async function convert() {
  try {
    const { customerId } = await api(`/api/admin/leads/${id}/convert`, { method: 'POST' })
    await navigateTo(`/customers/${customerId}`)
  } catch (e) { err.value = errorMessage(e) }
}
</script>

<template>
  <div v-if="lead" class="max-w-3xl">
    <PageHeader :title="lead.company" eyebrow="Lead">
      <NuxtLink v-if="lead.customerId" :to="`/customers/${lead.customerId}`" class="btn-outline">Open customer</NuxtLink>
      <button v-else-if="can.write.value" class="btn-dark" @click="convert">Convert to customer</button>
    </PageHeader>
    <div class="card space-y-3 text-sm">
      <p><span class="mono-label">Contact</span><br>{{ lead.name }} · <a :href="`mailto:${lead.email}`" class="underline">{{ lead.email }}</a> · {{ lead.phone || '—' }}</p>
      <p><span class="mono-label">Interest</span><br>{{ lead.inquiryType || '—' }}</p>
      <p><span class="mono-label">Message</span><br><span class="whitespace-pre-wrap">{{ lead.message || '—' }}</span></p>
      <p class="text-xs text-body-muted">Received {{ day(lead.receivedAt) }} via {{ lead.source }}</p>
    </div>
    <div class="card mt-4 space-y-3">
      <div>
        <p class="label">Status</p>
        <div class="flex flex-wrap gap-1">
          <button v-for="s in ['NEW','CONTACTED','DEMO','WON','LOST']" :key="s" :disabled="!can.write.value"
            class="rounded-full px-3 py-1 text-sm" :class="lead.status === s ? 'bg-primary text-white' : 'bg-soft-stone text-body-muted'"
            @click="update({ status: s })">{{ s.toLowerCase() }}</button>
        </div>
      </div>
      <div>
        <label class="label" for="notes">Notes</label>
        <textarea id="notes" v-model="notes" rows="4" class="field" :disabled="!can.write.value" />
      </div>
      <button v-if="can.write.value" class="btn-outline" @click="update({ notes })">Save notes</button>
      <Notice v-if="msg" tone="ok">{{ msg }}</Notice>
      <Notice v-if="err" tone="error">{{ err }}</Notice>
    </div>
  </div>
</template>
