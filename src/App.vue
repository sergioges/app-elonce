<script setup>
  import { computed, onBeforeMount, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { useAuthStore } from '@store/authStore'
  import { useReservationStore } from '@store/reservationStore'

  import { config } from '@plugin/config'

  const route = useRoute()

  const authStore = useAuthStore()
  const { signInAnonymously } = authStore
  const reservationStore = useReservationStore()
  const { setDbName } = reservationStore

  const dbName = computed(() =>
    route.query['test-mode'] === 'enabled' ? config.dbNameTest : config.dbNameProd
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
    await signInAnonymously()
  })
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>
