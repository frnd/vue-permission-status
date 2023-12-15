<script setup lang="ts">
import { VuePermissionStatus } from '@/components/PermissionStatus'

const requestGeolocation = () => navigator.geolocation.getCurrentPosition(() => {})
</script>

<template>
  <header>
    <h2>Vue Permission Status</h2>
  </header>

  <main>
    <vue-permission-status :permissions="['geolocation', 'notifications']">
      <template #granted="{ geolocation, notifications }">
        <h3>granted</h3>
        <p>geolocation: {{ geolocation }}</p>
        <p>notifications: {{ notifications }}</p>
      </template>
      <template #prompt="{ geolocation, notifications }">
        <h3>prompt</h3>
        <p>geolocation: {{ geolocation }}</p>
        <p>notifications: {{ notifications }}</p>
      </template>
      <template #denied="{ geolocation, notifications }">
        <h3>denied</h3>
        <p>geolocation: {{ geolocation }}</p>
        <p>notifications: {{ notifications }}</p>
      </template>
    </vue-permission-status>

    <button @click="requestGeolocation">Request geolocation</button>
  </main>
</template>
