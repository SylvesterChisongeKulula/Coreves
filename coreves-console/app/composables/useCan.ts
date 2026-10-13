/** UI hints only — the server's role middleware is what actually enforces access. */
export function useCan() {
  const { user } = useUserSession()
  return {
    write: computed(() => user.value?.role === 'OWNER' || user.value?.role === 'BILLING'),
    admin: computed(() => user.value?.role === 'OWNER'),
  }
}
