import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const payload = await readBody(event)

  const message = `<b>📥 New message from portfolio 📬</b>

<b>👤 Full name:</b> ${payload?.name} 
<b>📧 Email:</b> ${payload?.email}
<b>💬 Message:</b> ${payload.message}`

  const res = await $fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
    method: 'POST',
    body: {
      text: message,
      chat_id: '5820590165',
      parse_mode: 'HTML',
    },
  })

  return { ok: res.ok }
})
