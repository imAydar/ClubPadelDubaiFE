import { computed } from 'vue'

export function useUserRole() {
  const getRolesFromJwt = () => {
    const token = localStorage.getItem('jwt')
    if (!token) return []
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const payload = JSON.parse(decodeURIComponent(escape(window.atob(base64))))
      let roles = payload.role
      if (!roles) return []
      if (typeof roles === 'string') roles = [roles]
      return roles
    } catch {
      return []
    }
  }

  const userRoles = computed(() => getRolesFromJwt())
  const isAdmin = computed(() =>
    userRoles.value.some(role => role.toLowerCase() === 'admin')
  )

  return { userRoles, isAdmin }
}