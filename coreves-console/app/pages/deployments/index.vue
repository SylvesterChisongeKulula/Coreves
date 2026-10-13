<script setup lang="ts">
const { data } = await useFetch('/api/admin/deployments')
</script>

<template>
  <div>
    <PageHeader title="Deployments" eyebrow="Client servers" />
    <div class="card overflow-x-auto p-0">
      <p v-if="!data?.length" class="p-5 text-sm text-body-muted">No deployments yet — add one from a customer's page.</p>
      <table v-else class="table">
        <thead><tr><th>Customer</th><th>Deployment</th><th>Access</th><th>Paid through</th><th>Last seen</th></tr></thead>
        <tbody>
          <tr v-for="d in data" :key="d.id" class="link" @click="navigateTo(`/deployments/${d.id}`)">
            <td class="font-medium">{{ d.customer }}</td>
            <td>{{ d.slug }}<p class="text-xs text-body-muted">{{ d.domain }}</p></td>
            <td><Badge :value="d.state" /> <span v-if="d.lastEnforcement === 'off'" class="badge-red">enforcement off</span></td>
            <td>{{ day(d.paidThrough) }}</td>
            <td>{{ ago(d.lastSeenAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
