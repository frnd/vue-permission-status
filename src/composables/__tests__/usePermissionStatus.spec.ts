import { type Mock, describe, expect, test, vi } from 'vitest'
import { type App, createApp } from 'vue-demi'
import { flushPromises } from '@vue/test-utils'
import { usePermissionStatus } from '../usePermissionStatus'
;(global.navigator as any).permissions = {
  query: vi.fn().mockImplementation(() => Promise.resolve({}))
}
const query = global.navigator.permissions.query as Mock

function withSetup<T>(composable: () => T): [T, App] {
  let result: T
  const app = createApp({
    setup() {
      result = composable()
      return () => {}
    }
  })
  app.mount(document.createElement('div'))
  //@ts-ignore
  return [result, app]
}

const NOTIFICATIONS_PROMPT: Partial<PermissionStatus> = {
  name: 'notifications',
  state: 'prompt',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}
const NOTIFICATIONS_DENIED: Partial<PermissionStatus> = {
  name: 'notifications',
  state: 'denied',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}
const NOTIFICATIONS_GRANTED: Partial<PermissionStatus> = {
  name: 'notifications',
  state: 'granted',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}
const GEOLOCATION_GRANTED: Partial<PermissionStatus> = {
  name: 'geolocation',
  state: 'granted',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}

describe('use permission status composable', () => {
  test('should return false when calling with undefined', () => {
    const [result, app] = withSetup(() => usePermissionStatus(undefined))

    expect(result.prompt.value).toBeFalsy()
    expect(result.denied.value).toBeFalsy()
    expect(result.granted.value).toBeFalsy()
    expect(result.states).toEqual({})

    app.unmount()
  })

  test('should return false when calling with empty list', () => {
    const [result, app] = withSetup(() => usePermissionStatus([]))

    expect(result.prompt.value).toBeFalsy()
    expect(result.denied.value).toBeFalsy()
    expect(result.granted.value).toBeFalsy()
    expect(result.states).toEqual({})

    app.unmount()
  })

  describe('single permission', () => {
    test('should be prompt when permission is prompt', async () => {
      query.mockReturnValue(Promise.resolve(NOTIFICATIONS_PROMPT))

      const [result, app] = withSetup(() => usePermissionStatus(['notifications']))

      await flushPromises()

      expect(result.prompt.value).toBeTruthy()
      expect(result.denied.value).toBeFalsy()
      expect(result.granted.value).toBeFalsy()
      expect(result.states.notifications.value).toEqual('prompt')
      expect(Object.keys(result.states)).toEqual(['notifications'])

      expect(query).toHaveBeenCalledWith({ name: 'notifications' })

      query.mockReset()
      app.unmount()
    })

    test('should be denied when permission is denied', async () => {
      query.mockReturnValue(Promise.resolve(NOTIFICATIONS_DENIED))

      const [result, app] = withSetup(() => usePermissionStatus(['notifications']))

      await flushPromises()

      expect(result.prompt.value).toBeFalsy()
      expect(result.denied.value).toBeTruthy()
      expect(result.granted.value).toBeFalsy()
      expect(result.states.notifications.value).toEqual('denied')
      expect(Object.keys(result.states)).toEqual(['notifications'])

      expect(query).toHaveBeenCalledWith({ name: 'notifications' })

      query.mockReset()
      app.unmount()
    })

    test('should be granted when permission is granted', async () => {
      query.mockReturnValue(Promise.resolve(NOTIFICATIONS_GRANTED))

      const [result, app] = withSetup(() => usePermissionStatus(['notifications']))

      await flushPromises()

      expect(result.prompt.value).toBeFalsy()
      expect(result.denied.value).toBeFalsy()
      expect(result.granted.value).toBeTruthy()
      expect(result.states.notifications.value).toEqual('granted')
      expect(Object.keys(result.states)).toEqual(['notifications'])

      expect(query).toHaveBeenCalledWith({ name: 'notifications' })

      query.mockReset()
      app.unmount()
    })
  })

  describe('multiple permissions', () => {
    test('should be prompt when any permissions is prompt', async () => {
      query.mockReturnValueOnce(Promise.resolve(NOTIFICATIONS_PROMPT))
      query.mockReturnValueOnce(Promise.resolve(GEOLOCATION_GRANTED))

      const [result, app] = withSetup(() => usePermissionStatus(['notifications', 'geolocation']))

      await flushPromises()

      expect(result.prompt.value).toBeTruthy()
      expect(result.denied.value).toBeFalsy()
      expect(result.granted.value).toBeFalsy()
      expect(result.states.notifications.value).toEqual('prompt')
      expect(result.states.geolocation.value).toEqual('granted')
      expect(Object.keys(result.states)).toEqual(['notifications', 'geolocation'])

      expect(query).toHaveBeenCalledWith({ name: 'notifications' })

      query.mockReset()
      app.unmount()
    })

    test('should be denied when any permission is denied', async () => {
      query.mockReturnValueOnce(Promise.resolve(NOTIFICATIONS_DENIED))
      query.mockReturnValueOnce(Promise.resolve(GEOLOCATION_GRANTED))

      const [result, app] = withSetup(() => usePermissionStatus(['notifications', 'geolocation']))

      await flushPromises()

      expect(result.prompt.value).toBeFalsy()
      expect(result.denied.value).toBeTruthy()
      expect(result.granted.value).toBeFalsy()
      expect(result.states.notifications.value).toEqual('denied')
      expect(result.states.geolocation.value).toEqual('granted')
      expect(Object.keys(result.states)).toEqual(['notifications', 'geolocation'])

      expect(query).toHaveBeenCalledWith({ name: 'notifications' })

      query.mockReset()
      app.unmount()
    })

    test('should be granted when all permissions are granted', async () => {
      query.mockReturnValueOnce(Promise.resolve(NOTIFICATIONS_GRANTED))
      query.mockReturnValueOnce(Promise.resolve(GEOLOCATION_GRANTED))

      const [result, app] = withSetup(() => usePermissionStatus(['notifications', 'geolocation']))

      await flushPromises()

      expect(result.prompt.value).toBeFalsy()
      expect(result.denied.value).toBeFalsy()
      expect(result.granted.value).toBeTruthy()
      expect(result.states.notifications.value).toEqual('granted')
      expect(result.states.geolocation.value).toEqual('granted')
      expect(Object.keys(result.states)).toEqual(['notifications', 'geolocation'])

      expect(query).toHaveBeenCalledWith({ name: 'notifications' })

      query.mockReset()
      app.unmount()
    })
  })

  test('should handle errors', async () => {
    query.mockReturnValueOnce(Promise.resolve(NOTIFICATIONS_GRANTED))
    query.mockReturnValueOnce(Promise.reject('wrong permission'))

    const [result, app] = withSetup(() =>
      usePermissionStatus(['notifications', 'wrong' as PermissionName])
    )

    await flushPromises()

    expect(result.prompt.value).toBeFalsy()
    expect(result.denied.value).toBeFalsy()
    expect(result.granted.value).toBeFalsy()
    expect(result.states.notifications.value).toEqual('error')
    expect(result.states['wrong' as PermissionName].value).toEqual('error')
    expect(Object.keys(result.states)).toEqual(['notifications', 'wrong' as PermissionName])

    expect(query).toHaveBeenCalledWith({ name: 'notifications' })
    expect(query).toHaveBeenCalledWith({ name: 'wrong' })

    query.mockReset()
    app.unmount()
  })

  test.todo('permissions update')
})
