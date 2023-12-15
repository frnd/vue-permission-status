import { type ComputedRef, type Ref, computed, onUnmounted, ref } from 'vue-demi'

export const usePermissionStatus = <T extends PermissionName>(
  permissions: Array<T> = []
): {
  states: Record<T, Ref<PermissionState | 'error'>>
  denied: ComputedRef<any>
  prompt: ComputedRef<any>
  granted: ComputedRef<any>
} => {
  let statuses: PermissionStatus[] | undefined = undefined

  const states: Record<T, Ref<PermissionState | 'error'>> = permissions.reduce(
    (o, key) => ({ ...o, [key]: ref<PermissionState>() }),
    {} as Record<T, Ref>
  )

  const set = (name: T, state: PermissionState | 'error') => {
    states[name].value = state
  }

  function changeEventListener(this: PermissionStatus) {
    const { name, state } = this
    set(name as T, state)
  }

  Promise.all(permissions.map((name) => navigator.permissions.query({ name })))
    .then((permissionStatuses) => {
      statuses = permissionStatuses
      permissionStatuses.forEach((ps) => {
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1754372
        // On Firefox this on change event is not working.
        ps.addEventListener('change', changeEventListener)
        set(ps.name as T, ps.state)
      })
    })
    .catch(() => {
      permissions.forEach((p) => set(p, 'error'))
    })

  const is = (status: string) => {
    return (permission: Ref<PermissionState | 'error'>) => {
      return permission.value === status
    }
  }

  const granted = computed(() => {
    const permissions = Object.values<Ref<PermissionState | 'error'>>(states)
    return !!permissions.length && permissions.every(is('granted'))
  })

  const prompt = computed(() => {
    const permissions = Object.values<Ref<PermissionState | 'error'>>(states)
    return permissions.some(is('prompt'))
  })

  const denied = computed(() => {
    const permissions = Object.values<Ref<PermissionState | 'error'>>(states)
    return permissions.some(is('denied'))
  })

  onUnmounted(() => {
    ;(statuses || []).forEach((ps) => {
      ps.removeEventListener('change', changeEventListener)
    })
    statuses = undefined
  })

  return {
    states,
    granted,
    prompt,
    denied
  }
}
