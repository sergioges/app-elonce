<script setup>
  import { computed, onBeforeMount, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { useAuthStore } from '@store/authStore'
  import { useReservationStore } from '@store/reservationStore'

  const route = useRoute()

  const authStore = useAuthStore()
  const { loginDataBase } = authStore
  const reservationStore = useReservationStore()
  const { setDbName } = reservationStore

  const dbName = computed(() =>
    route.query['test-mode'] === 'enabled' ? 'test-cuca' : 'reservations'
  )

  // For testing porpuses, need to watch if there is a test query param - test-mode=enabled
  watch(
    dbName,
    newVal => {
      setDbName(newVal)
    },
    { immediate: true }
  )

  onBeforeMount(async () => {
    await loginDataBase(import.meta.env.VITE_LOGIN_USER, import.meta.env.VITE_LOGIN_PASSWORD)
  })
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>
