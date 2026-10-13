<script setup lang="ts">
const can = useCan()
const { data } = await useFetch('/api/admin/customers')
</script>

<template>
  <div>
    <PageHeader title="Customers" eyebrow="Lending companies">
      <NuxtLink v-if="can.write.value" to="/customers/new" class="btn-dark">New customer</NuxtLink>
    </PageHeader>
    <div class="card overflow-x-auto p-0">
      <p v-if="!data?.length" class="p-5 text-sm text-body-muted">No customers yet. Convert a lead or add one.</p>
      <table v-else class="table">
        <thead><tr><th>Name</th><th>Contact</th><th>Deployments</th></tr></thead>
        <tbody>
          <tr v-for="c in data" :key="c.id" class="link" @click="navigateTo(`/customers/${c.id}`)">
            <td class="font-medium">{{ c.name }}</td>
            <td>{{ c.contactName || '—' }}<p class="text-xs text-body-muted">{{ c.email }}</p></td>
            <td>{{ c.deployments }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
