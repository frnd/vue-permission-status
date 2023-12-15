import { type App, inject, type InjectionKey } from 'vue-demi'
import { VuePermissionStatus } from './components/PermissionStatus'

export interface VuePermissionStatusOptions {
  theme: string
}

export interface VuePermissionStatusPlugin {
  options?: VuePermissionStatusOptions
  install(app: App): void
}

export const VuePermissionStatusSymbol: InjectionKey<VuePermissionStatusPlugin> = Symbol()

export function VuePermissionStatusPlugin(): VuePermissionStatusPlugin {
  const VuePermissionStatus = inject(VuePermissionStatusSymbol)
  if (!VuePermissionStatus) throw new Error('No VuePermissionStatusPlugin provided!!!')

  return VuePermissionStatus
}

export function createVuePermissionStatusPlugin(
  options?: VuePermissionStatusOptions
): VuePermissionStatusPlugin {
  return {
    options,
    install(app: App) {
      app.component('vue-permission-status', VuePermissionStatus)
      app.provide(VuePermissionStatusSymbol, this)
    }
  }
}
