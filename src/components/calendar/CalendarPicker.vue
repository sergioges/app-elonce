<script setup>
  import { computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'

  import VueDatePicker from '@vuepic/vue-datepicker'
  import '@vuepic/vue-datepicker/dist/main.css'

  import { useReservationStore } from '@store/reservationStore'

  import { useDisplay } from 'vuetify'

  import moment from 'moment'
  import 'moment/dist/locale/es'

  const display = useDisplay()

  const reservationStore = useReservationStore()
  const { reservations } = storeToRefs(reservationStore)

  moment.locale('es')

  const reservationDates = defineModel()
  const emit = defineEmits(['update:totalNights'])

  const isMobile = computed(() => display.smAndDown)
  // eslint-disable-next-line no-unused-vars
  const isDesktop = computed(() => display.mdAndUp)

  const formattedDate = computed(() => {
    if (!reservationDates.value || reservationDates.value.length === 0) return
    let dateFormat
    if (isMobile.value.value) {
      dateFormat = reservationDates.value.map(d => moment(d).format('DD/MM/YYYY')).join(' --- ')
    } else {
      dateFormat = reservationDates.value
        .map(d => moment(d).format('DD/MM/YYYY (dddd)'))
        .join(' --- ')
    }

    return dateFormat
  })

  const totalNights = computed(() => {
    if (!reservationDates.value || reservationDates.value.length < 2) return 0
    const [start, end] = reservationDates.value
    return moment(end).diff(moment(start), 'days')
  })

  // Filter reservations with status “pending” or “paid”.
  const disabledDates = computed(() => {
    const filteredReservations = reservations.value.filter(
      reservation => reservation.status === 'paid'
    )

    // Extract and flatten all the dates from the filtered reservations.
    const allDates = filteredReservations.flatMap(reservation => reservation.dates)

    // Add the current and the next day to be disabled.
    const today = moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    const tomorrow = moment().add(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')

    return [...new Set([...allDates, today, tomorrow])] // Eliminate duplicates.
  })

  watch(totalNights, newVal => {
    emit('update:totalNights', newVal)
  })
</script>

<template>
  <VueDatePicker
    v-model="reservationDates"
    class="date-picker w-100"
    range
    multi-calendars
    :enable-time-picker="false"
    :min-date="new Date()"
    :month-change-on-scroll="false"
    locale="es"
    inline
    auto-apply
    :disabled-dates="disabledDates"
  />
  <p>Selecciona en el calendario, el rango de días que deseas reservar.</p>
  <v-text-field
    v-model="formattedDate"
    label="Check-in --- Check-out"
    :rules="[v => !!v || 'Falta escoger fechas']"
    required
    readonly
    prepend-icon="mdi-calendar"
    hide-details="auto"
    variant="solo"
  ></v-text-field>
  <p>Total de noches: {{ totalNights }}</p>
</template>

<style lang="css" scoped>
  .date-picker {
    justify-content: center;
    width: 100%;
  }
</style>
