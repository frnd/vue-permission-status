# vue-permission-status

Vue 2/3 Component and composable to query for Web API permission state.

Example for Vue2: https://codesandbox.io/p/sandbox/vue2-permission-status-example-f67lx5

Example for Vue3: https://codesandbox.io/p/sandbox/vue3-permission-status-example-t8ff49

## Setup

```typescript
import { createVuePermissionStatusPlugin } from 'vue-permission-status'

const VuePermissionStatusPlugin = createVuePermissionStatusPlugin()

createApp(App).use(VuePermissionStatusPlugin).mount('#app')
```

## Component

```vue
<vue-permission-status :permissions="['geolocation', 'notifications']">
  <template #granted="{ geolocation, notifications }">
    All permissions granted.
    <p>Status for geolocation is {{ geolocation }}</p>
    <p>Status for notifications is {{ notifications }}</p>
  </template>
  <template #prompt="{ geolocation, notifications }">
    A permission is prompting to the user
    <p>Status for geolocation is {{ geolocation }}</p>
    <p>Status for notifications is {{ notifications }}</p>
  </template>
  <template #denied="{ geolocation, notifications }">
    Any permission was denied
    <p>Status for geolocation is {{ geolocation }}</p>
    <p>Status for notifications is {{ notifications }}</p>
  </template>
</vue-permission-status>

```

## Composable

```typescript
const permissions = ['geolocation', 'notifications']

const { states, prompt, granted, denied } = usePermissionStatus(permissions)

```

## Development

### Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
