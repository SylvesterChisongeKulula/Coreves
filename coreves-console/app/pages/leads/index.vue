<script setup lang="ts">
const route = useRoute()
const status = computed(() => (route.query.status as string) || '')
const { data } = await useFetch('/api/admin/leads', { query: { status } })
const tabs = ['', 'NEW', 'CONTACTED', 'DEMO', 'WON', 'LOST']
</script>

<template>
  <div>
    <PageHeader title="Leads" eyebrow="Website enquiries" />
    <div class="mb-4 flex flex-wrap gap-1">
      <NuxtLink v-for="t in tabs" :key="t" :to="{ query: t ? { status: t } : {} }"
        class="rounded-full px-3 py-1 text-sm" :class="status === t ? 'bg-primary text-white' : 'bg-soft-stone text-body-muted'">
        {{ t ? t.toLowerCase() : 'all' }}
      </NuxtLink>
    </div>
    <div class="card overflow-x-auto p-0">
      <p v-if="!data?.length" class="p-5 text-sm text-body-muted">No leads here. Demo requests from coreves.software land in this list.</p>
      <table v-else class="table">
        <thead><tr><th>Company</th><th>Contact</th><th>Interest</th><th>Received</th><th>Status</th></tr></thead>
        <tbody>
          <tr v-for="l in data" :key="l.id" class="link" @click="navigateTo(`/leads/${l.id}`)">
            <td class="font-medium">{{ l.company }}</td>
            <td>{{ l.name }}<p class="text-xs text-body-muted">{{ l.email }}</p></td>
            <td class="text-body-muted">{{ l.inquiryType || '—' }}</td>
            <td>{{ day(l.receivedAt) }}</td>
            <td><Badge :value="l.status" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
