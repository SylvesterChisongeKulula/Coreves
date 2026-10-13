/** Every /api/admin/** call needs a fully signed-in user whose role allows it. */
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  if (!path.startsWith('/api/admin')) return
  const { user } = await requireUserSession(event)
  if (!roleAllows(user.role, event.method, path)) {
    throw createError({ statusCode: 403, statusMessage: 'Your role does not allow this action' })
  }
})
