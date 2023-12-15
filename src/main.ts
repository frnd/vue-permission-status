import { createApp } from 'vue'
import App from './App.vue'

import { createVuePermissionStatusPlugin } from './'

const VuePermissionStatusPlugin = createVuePermissionStatusPlugin()

createApp(App).use(VuePermissionStatusPlugin).mount('#app')
