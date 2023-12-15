import { defineComponent } from 'vue-demi'
import { usePermissionStatus } from '@/composables/usePermissionStatus'

export const VuePermissionStatus = defineComponent({
  name: 'VuePermissionStatus',
  props: {
    permissions: {
      type: Array<PermissionName>,
      required: true
    }
  },
  setup(props, ctx) {
    const { states, prompt, granted, denied } = usePermissionStatus(props.permissions)

    return () => {
      const slotName: string =
        (prompt.value && 'prompt') ||
        (denied.value && 'denied') ||
        (granted.value && 'granted') ||
        'default'
      return ctx.slots[slotName]?.(states) ?? null
    }
  }
})
