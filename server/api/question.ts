import { sendPushoverNotification } from '../utils/pushover'

export default defineEventHandler(async (event) => {
  if (event.method === 'OPTIONS')
    return null
  assertMethod(event, 'POST')

  const { question } = await readBody(event)
  if (!question || typeof question !== 'string' || !question.trim()) {
    throw createError({ statusCode: 422, statusMessage: 'question is required' })
  }

  const notify = sendPushoverNotification(event, {
    title: 'Anonymous question',
    message: question,
    priority: 0,
  })

  await Promise.all([notify])

  return null
})
