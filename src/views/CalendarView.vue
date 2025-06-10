<script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

  import CalendarHeader from '@/components/calendar/CalendarHeader.vue'
  import CalendarPicker from '@/components/calendar/CalendarPicker.vue'
  import CalendarForm from '@/components/calendar/CalendarForm.vue'
  import FooterApp from '@/components/FooterApp.vue'

  import { useReservationStore } from '@store/reservationStore'

  import moment from 'moment'
  import 'moment/dist/locale/es'

  const reservationStore = useReservationStore()
  const { dbName, fetchReservations } = reservationStore

  moment.locale('es')

  const reservationDates = ref([])
  const countdown = ref(0)
  const totalNights = ref(0)
  const showSuccess = ref(false)
  const showError = ref(false)
  const isPaymentAvailable = ref(false)
  const isTestPaymentAvailable = ref(false)

  const formattedCountdown = computed(() => {
    const minutes = Math.floor(countdown.value / 60)
    const seconds = countdown.value % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  })

  watch(isPaymentAvailable, newVal => {
    if (newVal) {
      countdown.value = 180
      const timer = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--
        } else {
          clearInterval(timer)
          isPaymentAvailable.value = false
        }
      }, 1000)
    }
  })

  onMounted(async () => {
    await fetchReservations()
    if (dbName === 'test-cuca') isTestPaymentAvailable.value = true
  })

  onUnmounted(() => {
    sessionStorage.removeItem('idReservation')
  })
</script>

<template>
  <v-container>
    <v-alert
      v-if="showSuccess"
      class="toast-alert"
      title="Hemos recibido tu solicitud de reserva"
      type="success"
      border="end"
      closable
    >
      <p v-if="totalNights >= 3">
        Tan pronto revisemos tu solucitud nos pondremos en conacto contigo. Si lo deseas, puedes
        escribirnos a
        <a href="mailto:cucadellumcasarural@gmail.com">nuestro mail.</a>
      </p>
      <p v-else>
        Ahora continua con el proceso de pago. Recuerda que tienes {{ formattedCountdown }} minutos
        para realizarlo.
      </p>
    </v-alert>
    <v-alert
      v-if="showError"
      class="toast-alert"
      title="Algo ha fallado"
      type="error"
      border="end"
      closable
    >
      <p>
        Por favor inténtalo de nuevo más tarde. Para cualquier duda, puedes escribirnos a
        <a href="mailto:cucadellumcasarural@gmail.com">nuestro mail.</a>
      </p>
    </v-alert>
    <v-row align="start" justify="center" class="mt-5">
      <v-col class="d-flex flex-column ga-4" cols="12" md="8">
        <CalendarHeader />
        <CalendarPicker v-model="reservationDates" @update:totalNights="totalNights = $event" />
        <CalendarForm
          v-model:showSuccess="showSuccess"
          v-model:showError="showError"
          v-model:reservationDates="reservationDates"
          v-model:isPaymentAvailable="isPaymentAvailable"
          v-model:isTestPaymentAvailable="isTestPaymentAvailable"
          :total-nights="totalNights"
        />
      </v-col>
    </v-row>
    <FooterApp />
  </v-container>
</template>

<style scoped>
  .toast-alert {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    max-width: 600px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    padding: 16px;
    text-align: left;
  }

  @media (max-width: 600px) {
    .toast-alert {
      top: 20px;
      right: auto;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
    }
  }

  .toast-alert a {
    color: #ffffff;
    font-weight: bold;
    text-decoration: none;
  }
</style>
