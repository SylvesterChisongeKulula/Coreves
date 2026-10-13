<script setup lang="ts">
const route = useRoute()
const status = computed(() => (route.query.status as string) || '')
const { data } = await useFetch('/api/admin/invoices', { query: { status } })
const tabs = ['', 'DRAFT', 'SENT', 'PAID', 'VOID']
</script>

<template>
  <div>
    <PageHeader title="Invoices" eyebrow="Billing" />
    <div class="mb-4 flex flex-wrap gap-1">
      <NuxtLink v-for="t in tabs" :key="t" :to="{ query: t ? { status: t } : {} }"
        class="rounded-full px-3 py-1 text-sm" :class="status === t ? 'bg-primary text-white' : 'bg-soft-stone text-body-muted'">
        {{ t ? t.toLowerCase() : 'all' }}
      </NuxtLink>
    </div>
    <div class="card overflow-x-auto p-0">
      <p v-if="!data?.length" class="p-5 text-sm text-body-muted">No invoices. Drafts are created on the 25th for the next period, or from a deployment's page.</p>
      <table v-else class="table">
        <thead><tr><th>Number</th><th>Customer</th><th>Period</th><th>Amount</th><th>Due</th><th>Status</th></tr></thead>
        <tbody>
          <tr v-for="r in data" :key="r.invoice.id" class="link" @click="navigateTo(`/invoices/${r.invoice.id}`)">
            <td class="font-medium">{{ r.invoice.number }}</td>
            <td>{{ r.customer }}<p class="text-xs text-body-muted">{{ r.slug }}</p></td>
            <td>{{ day(r.invoice.periodStart) }} – {{ day(r.invoice.periodEnd) }}</td>
            <td>{{ money(r.invoice.amount, r.invoice.currency) }}</td>
            <td>{{ day(r.invoice.dueAt) }}</td>
            <td><Badge :value="r.invoice.status" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
