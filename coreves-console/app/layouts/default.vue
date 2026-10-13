<script setup lang="ts">
import logo from '~/assets/images/logo.svg'

const { user, clear } = useUserSession()
const can = useCan()
const nav = computed(() => [
  { to: '/', label: 'Dashboard' },
  { to: '/leads', label: 'Leads' },
  { to: '/customers', label: 'Customers' },
  { to: '/deployments', label: 'Deployments' },
  { to: '/invoices', label: 'Invoices' },
  ...(can.admin.value ? [{ to: '/team', label: 'Team' }] : []),
  { to: '/settings', label: 'Settings' },
])

async function logout() {
  await api('/api/auth/logout', { method: 'POST' })
  await clear()
  await navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen md:flex">
    <aside class="no-print border-b border-border-light bg-white md:sticky md:top-0 md:h-screen md:w-56 md:shrink-0 md:border-b-0 md:border-r">
      <div class="flex items-center gap-2 px-5 py-4">
        <img :src="logo" alt="Coreves" class="h-6">
        <span class="mono-label">Console</span>
      </div>
      <nav class="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
        <NuxtLink
          v-for="item in nav" :key="item.to" :to="item.to"
          class="whitespace-nowrap rounded-[8px] px-3 py-2 text-sm text-body-muted hover:bg-soft-stone hover:text-ink"
          exact-active-class="!bg-soft-stone !text-primary font-medium"
          :class="{ '!bg-soft-stone !text-primary font-medium': item.to !== '/' && $route.path.startsWith(item.to) }"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
      <div class="hidden px-5 py-4 text-xs text-body-muted md:absolute md:bottom-0 md:block">
        <p class="font-medium text-ink">{{ user?.name }}</p>
        <p>{{ user?.email }} · {{ user?.role.toLowerCase() }}</p>
        <button class="mt-2 underline" @click="logout">Sign out</button>
      </div>
    </aside>
    <main class="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
      <slot />
      <button class="no-print mt-10 text-xs text-body-muted underline md:hidden" @click="logout">Sign out</button>
    </main>
  </div>
</template>
