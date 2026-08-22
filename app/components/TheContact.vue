<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

const { onLoaded } = useScriptNpm({
  packageName: 'js-confetti',
  file: 'dist/js-confetti.browser.js',
  version: '0.12.0',
  scriptOptions: {
    use() {
      return { JSConfetti: (window as any).JSConfetti }
    },
  },
})

const schema = toTypedSchema(z.object({
  name: z.string().min(1, 'Min a character'),
  email: z.string().email('Invalid email'),
  message: z.string().min(2, 'Min 2 characters'),
}))

const { handleSubmit, defineField, errors, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    email: '',
    message: '',
  },
})

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [message, messageAttrs] = defineField('message')

const onSubmit = handleSubmit(async (values) => {
  const { data } = await useFetch('/api/contact', {
    method: 'POST',
    body: values,
  })

  if (data.value?.ok) {
    onLoaded(({ JSConfetti }) => {
      const confetti = new JSConfetti()
      confetti.addConfetti({ emojis: ['✅'] })
    })
  }

  resetForm()
})
</script>

<template>
  <form class="flex flex-col gap-4 max-w-4xl w-full" @submit.prevent="onSubmit">
    <div>
      <label for="name" class="sr-only">Name</label>
      <input id="name" v-model="name" placeholder="Name" inp type="text" name="name" v-bind="nameAttrs">
      <span class="text-sm text-red-500">{{ errors.name }}</span>
    </div>

    <div>
      <label for="email" class="sr-only">Email</label>
      <input id="email" v-model="email" inp placeholder="Email" type="email" name="email" v-bind="emailAttrs">
      <span class="text-sm text-red-500">{{ errors.email }}</span>
    </div>

    <div>
      <label for="message" class="sr-only">Message</label>
      <textarea id="message" v-model="message" class="min-h-10ch" inp placeholder="Message" type="text" name="message" v-bind="messageAttrs" />
      <span class="text-sm text-red-500">{{ errors.message }}</span>
    </div>

    <button type="submit" btn :disabled="isSubmitting">
      Send
      <span v-if="isSubmitting" class="i-svg-spinners-90-ring-with-bg" />
    </button>
  </form>
</template>
