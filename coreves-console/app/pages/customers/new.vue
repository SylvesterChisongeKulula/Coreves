<script setup lang="ts">
const form = reactive({ name: '', email: '', contactName: '', phone: '', address: '', taxId: '', notes: '' })
const err = ref(''); const busy = ref(false)
async function save() {
  busy.value = true; err.value = ''
  try {
    const c = await api('/api/admin/customers', { method: 'POST', body: form })
    await navigateTo(`/customers/${c!.id}`)
  } catch (e) { err.value = errorMessage(e) } finally { busy.value = false }
}
</script>

<template>
  <div class="max-w-2xl">
    <PageHeader title="New customer" eyebrow="Customers" />
    <form class="card grid gap-3 sm:grid-cols-2" @submit.prevent="save">
      <div class="sm:col-span-2"><label class="label">Company name *</label><input v-model="form.name" class="field" required></div>
      <div><label class="label">Billing email *</label><input v-model="form.email" type="email" class="field" required></div>
      <div><label class="label">Contact person</label><input v-model="form.contactName" class="field"></div>
      <div><label class="label">Phone</label><input v-model="form.phone" class="field"></div>
      <div><label class="label">TPIN / tax id</label><input v-model="form.taxId" class="field"></div>
      <div class="sm:col-span-2"><label class="label">Address</label><textarea v-model="form.address" rows="2" class="field" /></div>
      <div class="sm:col-span-2"><label class="label">Notes</label><textarea v-model="form.notes" rows="3" class="field" /></div>
      <div class="sm:col-span-2 flex gap-2"><button class="btn-dark" :disabled="busy">Create customer</button><NuxtLink to="/customers" class="btn-ghost">Cancel</NuxtLink></div>
      <Notice v-if="err" tone="error" class="sm:col-span-2">{{ err }}</Notice>
    </form>
  </div>
</template>
