import { VuePermissionStatus } from '@/components/PermissionStatus'
import { describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import * as usePermissionStatusComposable from '@/composables/usePermissionStatus'
import { ref } from 'vue-demi'

const PROPS = {
  permissions: undefined
}

const SLOTS = {
  default: 'DEFAULT',
  granted: 'GRANTED',
  prompt: 'PROMPT',
  denied: 'DENIED'
}

const render = (props = PROPS, slots = SLOTS) => {
  return mount(VuePermissionStatus, {
    props,
    slots
  })
}

const usePermissionStatus = vi.fn().mockName('usePermissionStatus').mockReturnValue({})
vi.spyOn(usePermissionStatusComposable, 'usePermissionStatus').mockImplementation(
  usePermissionStatus
)

describe('permission status component', () => {
  test('should show default when no information', () => {
    const permissions = {
      states: {},
      granted: ref(false),
      prompt: ref(false),
      denied: ref(false)
    }
    usePermissionStatus.mockReturnValue(permissions)
    const wrapper = render({ permissions: ['camera'] })
    expect(wrapper.text()).toBe('DEFAULT')
  })

  test('should show granted when is granted', () => {
    const permissions = {
      states: {},
      granted: ref(true),
      prompt: ref(false),
      denied: ref(false)
    }
    usePermissionStatus.mockReturnValue(permissions)
    const wrapper = render({ permissions: ['camera'] })
    expect(wrapper.text()).toBe('GRANTED')
  })

  test('should show prompt when is prompt', () => {
    const permissions = {
      states: {},
      granted: ref(false),
      prompt: ref(true),
      denied: ref(false)
    }
    usePermissionStatus.mockReturnValue(permissions)
    const wrapper = render({ permissions: ['camera', 'microphone'] })
    expect(wrapper.text()).toBe('PROMPT')
  })

  test('should show denied when denied', () => {
    const permissions = {
      states: {},
      granted: ref(false),
      prompt: ref(false),
      denied: ref(true)
    }
    usePermissionStatus.mockReturnValue(permissions)
    const wrapper = render({ permissions: ['camera', 'microphone'] })
    expect(wrapper.text()).toBe('DENIED')
  })
})
