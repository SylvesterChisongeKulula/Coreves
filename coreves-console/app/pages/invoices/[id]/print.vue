<script setup lang="ts">
import logo from '~/assets/images/logo.svg'

definePageMeta({ layout: 'bare' })

const id = Number(useRoute().params.id)
const { data } = await useFetch(`/api/admin/invoices/${id}`)
useHead({ title: () => data.value ? `Invoice ${data.value.invoice.number}` : 'Invoice' })
const printPage = () => window.print()
</script>

<template>
  <div v-if="data" class="mx-auto max-w-3xl bg-white p-10 text-sm print:p-0">
    <div class="no-print mb-6 flex justify-end"><button class="btn-dark" @click="printPage">Print / Save as PDF</button></div>
    <div class="flex items-start justify-between">
      <div>
        <img :src="logo" alt="Coreves" class="h-8">
        <p class="mt-3 font-medium">{{ data.settings.legalName }}</p>
        <p class="whitespace-pre-wrap text-body-muted">{{ data.settings.address }}</p>
        <p v-if="data.settings.taxId" class="text-body-muted">TPIN {{ data.settings.taxId }}</p>
        <p class="text-body-muted">{{ data.settings.email }} {{ data.settings.phone }}</p>
      </div>
      <div class="text-right">
        <h1 class="text-3xl font-semibold">Invoice</h1>
        <p class="mt-1 font-mono">{{ data.invoice.number }}</p>
        <p class="mt-3 text-body-muted">Issued {{ day(data.invoice.issuedAt) }}</p>
        <p class="text-body-muted">Due {{ day(data.invoice.dueAt) }}</p>
        <p v-if="data.invoice.status === 'PAID'" class="mt-2"><span class="badge-green">Paid</span></p>
      </div>
    </div>

    <div class="mt-10">
      <p class="mono-label">Billed to</p>
      <p class="mt-1 font-medium">{{ data.customer.name }}</p>
      <p v-if="data.customer.contactName" class="text-body-muted">Attn: {{ data.customer.contactName }}</p>
      <p class="whitespace-pre-wrap text-body-muted">{{ data.customer.address }}</p>
      <p v-if="data.customer.taxId" class="text-body-muted">TPIN {{ data.customer.taxId }}</p>
    </div>

    <table class="table mt-10">
      <thead><tr><th>Description</th><th class="!text-right">Amount</th></tr></thead>
      <tbody>
        <tr><td>{{ data.invoice.description }}</td><td class="text-right">{{ money(data.invoice.amount, data.invoice.currency) }}</td></tr>
        <tr><td class="text-right font-medium">Total due</td><td class="text-right font-display text-lg">{{ money(data.invoice.amount, data.invoice.currency) }}</td></tr>
      </tbody>
    </table>

    <div v-if="data.settings.bankDetails" class="mt-10 rounded-[8px] bg-soft-stone p-4">
      <p class="mono-label">Pay by bank transfer</p>
      <p class="mt-2 whitespace-pre-wrap">{{ data.settings.bankDetails }}</p>
      <p class="mt-2">Reference: <strong>{{ data.invoice.number }}</strong></p>
    </div>
    <p v-if="data.settings.invoiceFooter" class="mt-8 text-xs text-body-muted">{{ data.settings.invoiceFooter }}</p>
  </div>
</template>
