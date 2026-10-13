<script setup lang="ts">
const { user } = useUserSession()
const { data, refresh } = await useFetch('/api/admin/users')
const form = reactive({ open: false, name: '', email: '', role: 'BILLING', password: '' })
const err = ref(''); const ok = ref('')

async function run(fn: () => Promise<unknown>, msg: string) {
  err.value = ''; ok.value = ''
  try { await fn(); ok.value = msg; await refresh() } catch (e) { err.value = errorMessage(e) }
}
const add = () => run(async () => {
  const { open: _o, ...body } = form
  await api('/api/admin/users', { method: 'POST', body })
  Object.assign(form, { open: false, name: '', email: '', password: '' })
}, 'User added. Share the temporary password with them privately.')
function patchUser(id: number, body: Record<string, unknown>) {
  return api(`/api/admin/users/${id}`, { method: 'PATCH', body })
}
const setRole = (id: number, role: string) => run(() => patchUser(id, { role }), 'Role updated.')
const setActive = (id: number, active: boolean) => run(() => patchUser(id, { active }), active ? 'Enabled.' : 'Disabled.')
function resetPassword(id: number) {
  const password = prompt('New password (at least 12 characters):')
  if (password) run(() => patchUser(id, { password }), 'Password changed.')
}
</script>

<template>
  <div class="max-w-4xl">
    <PageHeader title="Team" eyebrow="Console access">
      <button v-if="!form.open" class="btn-dark" @click="form.open = true">Add user</button>
    </PageHeader>
    <Notice v-if="ok" tone="ok" class="mb-4">{{ ok }}</Notice>
    <Notice v-if="err" tone="error" class="mb-4">{{ err }}</Notice>

    <form v-if="form.open" class="card mb-4 grid gap-3 sm:grid-cols-2" @submit.prevent="add">
      <div><label class="label">Name</label><input v-model="form.name" class="field" required></div>
      <div><label class="label">Email</label><input v-model="form.email" type="email" class="field" required></div>
      <div><label class="label">Role</label><select v-model="form.role" class="field"><option value="OWNER">Owner — everything</option><option value="BILLING">Billing — customers, invoices, payments, licences</option><option value="VIEWER">Viewer — read-only</option></select></div>
      <div><label class="label">Temporary password (12+ chars)</label><input v-model="form.password" type="text" minlength="12" class="field" required></div>
      <div class="flex gap-2"><button class="btn-dark">Add</button><button type="button" class="btn-ghost" @click="form.open = false">Cancel</button></div>
    </form>

    <div class="card overflow-x-auto p-0">
      <table class="table">
        <thead><tr><th>Name</th><th>Role</th><th>Status</th><th /></tr></thead>
        <tbody>
          <tr v-for="u in data" :key="u.id">
            <td><p class="font-medium">{{ u.name }}</p><p class="text-xs text-body-muted">{{ u.email }}</p></td>
            <td>
              <select :value="u.role" class="field !w-auto !py-1" :disabled="u.id === user?.id" @change="setRole(u.id, ($event.target as HTMLSelectElement).value)">
                <option value="OWNER">owner</option><option value="BILLING">billing</option><option value="VIEWER">viewer</option>
              </select>
            </td>
            <td><span :class="u.active ? 'badge-green' : 'badge-grey'">{{ u.active ? 'active' : 'disabled' }}</span></td>
            <td class="space-x-2 whitespace-nowrap text-right">
              <button class="btn-ghost !py-1 text-xs" @click="resetPassword(u.id)">Reset password</button>
              <button v-if="u.id !== user?.id" class="btn-ghost !py-1 text-xs" @click="setActive(u.id, !u.active)">{{ u.active ? 'Disable' : 'Enable' }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
