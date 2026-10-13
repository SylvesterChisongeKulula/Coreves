<script setup lang="ts">
const { data, error } = await useFetch('/api/admin/dashboard')
</script>

<template>
  <div>
    <PageHeader title="Dashboard" eyebrow="Overview" />
    <Notice v-if="error" tone="error">{{ errorMessage(error) }}</Notice>

    <template v-if="data">
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="card"><p class="mono-label">Revenue this month</p><p class="mt-2 font-display text-2xl">{{ money(data.revenueThisMonth) }}</p></div>
        <div class="card"><p class="mono-label">Live deployments</p><p class="mt-2 font-display text-2xl">{{ data.deployments.length }}</p></div>
        <NuxtLink to="/leads?status=NEW" class="card hover:border-primary"><p class="mono-label">New leads</p><p class="mt-2 font-display text-2xl">{{ data.newLeads }}</p></NuxtLink>
      </div>

      <section class="card mt-6">
        <h2 class="text-lg font-semibold">Needs attention</h2>
        <p v-if="!data.attention.length" class="mt-2 text-sm text-body-muted">All deployments are paid up and reporting in.</p>
        <table v-else class="table mt-3">
          <thead><tr><th>Deployment</th><th>Access</th><th>Paid through</th><th>Last seen</th><th>Flags</th></tr></thead>
          <tbody>
            <tr v-for="d in data.attention" :key="d.id" class="link" @click="navigateTo(`/deployments/${d.id}`)">
              <td><p class="font-medium">{{ d.customer }}</p><p class="text-xs text-body-muted">{{ d.domain }}</p></td>
              <td><Badge :value="d.state" /></td>
              <td>{{ day(d.paidThrough) }}<span v-if="d.daysLeft !== null && d.daysLeft >= 0" class="text-xs text-body-muted"> · {{ d.daysLeft }}d left</span></td>
              <td>{{ ago(d.lastSeenAt) }}</td>
              <td class="space-x-1">
                <span v-if="d.notSeen" class="badge-amber">not reporting</span>
                <span v-if="d.enforcementOff" class="badge-red">enforcement off</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <div class="mt-6 grid gap-6 lg:grid-cols-2">
        <section class="card">
          <h2 class="text-lg font-semibold">Open invoices</h2>
          <p v-if="!data.openInvoices.length" class="mt-2 text-sm text-body-muted">Nothing outstanding.</p>
          <table v-else class="table mt-3">
            <tbody>
              <tr v-for="i in data.openInvoices" :key="i.id" class="link" @click="navigateTo(`/invoices/${i.id}`)">
                <td><p class="font-medium">{{ i.number }}</p><p class="text-xs text-body-muted">{{ i.customer }}</p></td>
                <td>{{ money(i.amount, i.currency) }}</td>
                <td><Badge :value="i.status" /> <span v-if="i.overdue" class="badge-red">overdue</span></td>
              </tr>
            </tbody>
          </table>
        </section>
        <section class="card">
          <h2 class="text-lg font-semibold">Latest leads</h2>
          <p v-if="!data.recentLeads.length" class="mt-2 text-sm text-body-muted">No enquiries yet.</p>
          <table v-else class="table mt-3">
            <tbody>
              <tr v-for="l in data.recentLeads" :key="l.id" class="link" @click="navigateTo(`/leads/${l.id}`)">
                <td><p class="font-medium">{{ l.company }}</p><p class="text-xs text-body-muted">{{ l.name }}</p></td>
                <td>{{ ago(l.receivedAt) }}</td>
                <td><Badge :value="l.status" /></td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </template>
  </div>
</template>
