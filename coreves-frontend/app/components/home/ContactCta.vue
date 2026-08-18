<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  company: '',
  email: '',
  phone: '',
  message: '',
})

type Status = 'idle' | 'submitting' | 'success' | 'error'
const status = ref<Status>('idle')
const errorMessage = ref('')
const { trackEvent } = useAnalytics()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(): string | null {
  if (!form.name.trim()) return 'Please enter your full name.'
  if (!form.company.trim()) return 'Please enter your organisation.'
  if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) return 'Please enter a valid work email.'
  if (!form.phone.trim()) return 'Please enter a phone number.'
  if (!form.message.trim()) return 'Please tell us how we can help.'
  return null
}

async function handleSubmit() {
  const validationError = validate()
  if (validationError) {
    status.value = 'error'
    errorMessage.value = validationError
    return
  }

  status.value = 'submitting'
  errorMessage.value = ''

  try {
    await $fetch('/api/demo-request', {
      method: 'POST',
      body: { ...form },
    })
    trackEvent('demo_request_submit', { form_location: 'contact_section' })
    status.value = 'success'
    Object.assign(form, { name: '', company: '', email: '', phone: '', message: '' })
  } catch (err: any) {
    status.value = 'error'
    errorMessage.value = err?.data?.statusMessage || 'Something went wrong. Please try again.'
  }
}
</script>

<template>
  <section id="contact" class="bg-soft-stone py-24">
    <div class="section-container">
      <div class="grid items-start gap-12 lg:grid-cols-2">
        <div class="lg:pt-6">
          <p class="mono-label">Get started</p>
          <h2 class="display-heading mt-5 text-4xl text-ink sm:text-5xl">
            Have a business process that needs a better system?
          </h2>
          <p class="mt-5 max-w-md text-lg leading-relaxed text-body-muted">
            Whether you are replacing manual processes, improving an existing platform or developing
            a new digital product, Coreves can help turn the operational requirement into a practical
            software solution.
          </p>
          <ul class="mt-8 space-y-3 text-sm text-body-muted">
            <li>· Custom software solutions</li>
            <li>· Business process digitalisation</li>
            <li>· Coreves Finance enquiries</li>
          </ul>
        </div>

        <div class="rounded-[22px] bg-canvas p-7 sm:p-9">
          <form class="grid grid-cols-1 gap-5 sm:grid-cols-2" @submit.prevent="handleSubmit">
            <div class="sm:col-span-1">
              <label for="name" class="mb-1.5 block text-sm text-ink">Full name</label>
              <input id="name" v-model="form.name" type="text" placeholder="Jane Banda" class="form-input" />
            </div>

            <div class="sm:col-span-1">
              <label for="company" class="mb-1.5 block text-sm text-ink">Organisation</label>
              <input id="company" v-model="form.company" type="text" placeholder="Your organisation" class="form-input" />
            </div>

            <div class="sm:col-span-1">
              <label for="email" class="mb-1.5 block text-sm text-ink">Work email</label>
              <input id="email" v-model="form.email" type="email" placeholder="jane@institution.co.zm" class="form-input" />
            </div>

            <div class="sm:col-span-1">
              <label for="phone" class="mb-1.5 block text-sm text-ink">Phone</label>
              <input id="phone" v-model="form.phone" type="tel" placeholder="+260 …" class="form-input" />
            </div>

            <div class="sm:col-span-2">
              <label for="message" class="mb-1.5 block text-sm text-ink">How can we help?</label>
              <textarea
                id="message"
                v-model="form.message"
                rows="4"
                placeholder="Tell us about the process, product or system you want to improve…"
                class="form-input resize-none"
              />
            </div>

            <div class="sm:col-span-2">
              <button
                type="submit"
                :disabled="status === 'submitting'"
                class="pill-cta-dark w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {{ status === 'submitting' ? 'Sending…' : 'Start a project' }}
              </button>
              <p v-if="status === 'success'" class="mt-4 text-sm text-emerald-700">
                Thanks! We've received your request and will be in touch shortly.
              </p>
              <p v-else-if="status === 'error'" class="mt-4 text-sm text-red-600">
                {{ errorMessage }}
              </p>
              <p v-else class="mt-4 text-xs text-muted">
                By submitting, you agree to be contacted about Coreves solutions. We never share your data.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
