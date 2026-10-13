<script setup lang="ts">
definePageMeta({ layout: 'bare' })

const { fetch } = useUserSession()
const step = ref<'password' | 'code'>('password')
const email = ref('')
const password = ref('')
const code = ref('')
const busy = ref(false)
const error = ref('')

async function submitPassword() {
  busy.value = true; error.value = ''
  try {
    await api('/api/auth/login', { method: 'POST', body: { email: email.value, password: password.value } })
    step.value = 'code'
  } catch (e) { error.value = errorMessage(e, 'Sign-in failed') } finally { busy.value = false }
}

async function submitCode() {
  busy.value = true; error.value = ''
  try {
    await api('/api/auth/verify', { method: 'POST', body: { code: code.value.trim() } })
    await fetch()
    await navigateTo('/')
  } catch (e) { error.value = errorMessage(e, 'Verification failed') } finally { busy.value = false }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <div class="card w-full max-w-sm">
      <p class="mono-label">Coreves Console</p>
      <h1 class="mt-1 text-xl font-semibold">Sign in</h1>

      <form v-if="step === 'password'" class="mt-5 space-y-3" @submit.prevent="submitPassword">
        <div><label class="label" for="email">Email</label><input id="email" v-model="email" type="email" class="field" autocomplete="username" required></div>
        <div><label class="label" for="pw">Password</label><input id="pw" v-model="password" type="password" class="field" autocomplete="current-password" required></div>
        <button class="btn-dark w-full" :disabled="busy">Continue</button>
      </form>

      <form v-else class="mt-5 space-y-3" @submit.prevent="submitCode">
        <p class="text-sm text-body-muted">We emailed a 6-digit code to {{ email }}.</p>
        <div><label class="label" for="code">Code</label><input id="code" v-model="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" class="field tracking-[0.3em]" required></div>
        <button class="btn-dark w-full" :disabled="busy">Sign in</button>
        <button type="button" class="btn-ghost w-full" @click="step = 'password'; code = ''">Start again</button>
      </form>

      <Notice v-if="error" tone="error" class="mt-4">{{ error }}</Notice>
    </div>
  </div>
</template>
