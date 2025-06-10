<script setup>
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useDisplay } from 'vuetify'

  import { db } from '../../plugins/firebase'
  import { updateDoc, doc } from 'firebase/firestore'

  import { useReservationStore } from '@store/reservationStore'

  import moment from 'moment'
  import 'moment/dist/locale/es'

  import VueDatePicker from '@vuepic/vue-datepicker'
  import '@vuepic/vue-datepicker/dist/main.css'

  const display = useDisplay()

  const reservationStore = useReservationStore()
  const { fetchReservations, dbName } = reservationStore
  const { reservations } = storeToRefs(reservationStore)

  moment.locale('es')

  const reservationStatus = ['paid', 'pending', 'cancelled']

  const showEditForm = defineModel('showEditForm')
  const selectedReservation = defineModel('selectedReservation')
  const showError = defineModel('showError')
  const showSuccess = defineModel('showSuccess')

  const valid = ref(false)

  const isMobile = computed(() => display.smAndDown)
  // eslint-disable-next-line no-unused-vars
  const isDesktop = computed(() => display.mdAndUp)

  const totalNights = computed(() => {
    if (!selectedReservation.value.dates || selectedReservation.value.dates.length < 2) return 0
    const [start, end] = selectedReservation.value.dates
    return moment(end).diff(moment(start), 'days')
  })

  const disabledDates = computed(() => {
    // Filter reservations with status “pending” or “paid”.
    const filteredReservations = reservations.value.filter(
      reservation => reservation.status === 'paid'
    )

    // Extract and flatten all the dates from the filtered reservations.
    const allDates = filteredReservations.flatMap(reservation => reservation.dates)

    // Normalize the dates so that all have time set to 00:00 and remove duplicates.
    const normalizedDates = allDates.map(date => {
      const normalizedDate = new Date(date)
      normalizedDate.setHours(0, 0, 0, 0) // Set the time to 00:00.
      return normalizedDate.toISOString() // Convert to ISO format.
    })

    return [...new Set(normalizedDates)] // Eliminate duplicates.
  })

  const maxDate = computed(() => {
    const today = new Date()
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
    return nextYear
  })

  const formattedDate = computed(() => {
    if (!selectedReservation.value.dates || selectedReservation.value.dates.length === 0) return
    let dateFormat
    if (isMobile.value.value) {
      dateFormat = selectedReservation.value.dates
        .map(d => moment(d).format('DD/MM/YYYY'))
        .join(' --- ')
    } else {
      dateFormat = selectedReservation.value.dates
        .map(d => moment(d).format('DD/MM/YYYY (dddd)'))
        .join(' --- ')
    }

    return dateFormat
  })

  function getTotalNights(dateVal) {
    const message = isMobile.value.value ? `Noches:` : `Total de noches:`
    if (!dateVal || dateVal.length < 2) return message
    const [start, end] = dateVal
    return `${message} ${moment(end).diff(moment(start), 'days')}`
  }

  function getDatesInRange(startDate, endDate) {
    const dates = []
    let currentDate = moment(startDate).startOf('day')
    const finalDate = moment(endDate).startOf('day')

    while (currentDate.isSameOrBefore(finalDate)) {
      // Convert the date to a Date object and set the time to 00:00:00.
      const normalizedDate = moment(currentDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      dates.push(normalizedDate) // Add the date in ISO format.
      currentDate.add(1, 'day') // Move forward one day.
    }

    return dates
  }

  async function updateReservation() {
    if (!selectedReservation.value.id) {
      console.error('El ID de la reserva no está definido.')
      return
    }

    try {
      const reservationRef = doc(db, dbName, selectedReservation.value.id)
      await updateDoc(reservationRef, {
        name: selectedReservation.value.name,
        phone: selectedReservation.value.phone,
        email: selectedReservation.value.email,
        dates: getDatesInRange(
          selectedReservation.value.dates[0],
          selectedReservation.value.dates[1]
        ),
        totalNights: totalNights.value,
        hosts: selectedReservation.value.hosts,
        pets: selectedReservation.value.pets,
        status: selectedReservation.value.status
      })
      showSuccess.value = true
      setTimeout(() => {
        showSuccess.value = false
      }, 5000)
      await fetchReservations()
      cancelEditReservation()
    } catch (error) {
      showError.value = true
      setTimeout(() => {
        showError.value = false
        cancelEditReservation()
      }, 5000)
      console.error('Error al actualizar la reserva:', error)
    }
  }

  function cancelEditReservation() {
    showEditForm.value = false
    selectedReservation.value = {
      id: '',
      createdAt: '',
      name: '',
      phone: '',
      email: '',
      dates: [],
      totalNights: 0,
      hosts: 0,
      pets: 0,
      status: ''
    }
  }
</script>

<template>
  <v-container v-if="showEditForm">
    <v-card class="pa-4">
      <v-card-title class="text-h5">Editar Reserva</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="selectedReservation.createdAt"
            label="Creación"
            prepend-icon="mdi-account-wrench"
            outlined
            readonly
          ></v-text-field>

          <v-text-field
            v-model="selectedReservation.name"
            label="Nombre"
            prepend-icon="mdi-rename"
            outlined
            required
          ></v-text-field>

          <v-text-field
            v-model="selectedReservation.phone"
            label="Teléfono"
            prepend-icon="mdi-phone-outgoing"
            outlined
            required
          ></v-text-field>

          <v-text-field
            v-model="selectedReservation.email"
            label="Email"
            prepend-icon="mdi-email-arrow-right"
            outlined
            required
          ></v-text-field>

          <v-row>
            <v-col cols="12" class="d-flex justify-center mb-4">
              <VueDatePicker
                v-model="selectedReservation.dates"
                :min-date="new Date()"
                :max-date="maxDate"
                range
                format="dd/MM/yyyy"
                :enable-time-picker="false"
                locale="es"
                teleport-center
                cancelText="Cancelar"
                selectText="Seleccionar"
                :disabled-dates="disabledDates"
              >
                <template #trigger>
                  <v-text-field
                    v-model="formattedDate"
                    label="Check-in --- Check-out"
                    readonly
                    outlined
                    prepend-icon="mdi-calendar"
                    hide-details="auto"
                  ></v-text-field>
                </template>
                <template #right-sidebar>
                  <p>Fechas escogidas previamente:</p>
                  <p>
                    {{ moment(selectedReservation.dates[0]).format('DD/MM') }}
                    -
                    {{
                      moment(
                        selectedReservation.dates[selectedReservation.dates.length - 1]
                      ).format('DD/MM')
                    }}
                  </p>
                </template>
                <template #action-preview="{ value }">
                  <h3>{{ getTotalNights(value) }}</h3>
                </template>
              </VueDatePicker>
            </v-col>
          </v-row>

          <v-text-field
            v-model="selectedReservation.hosts"
            label="Huéspedes"
            prepend-icon="mdi-account-multiple"
            outlined
            required
            type="number"
          ></v-text-field>

          <v-text-field
            v-model="selectedReservation.pets"
            label="Mascotas"
            prepend-icon="mdi-paw"
            outlined
            required
            type="string"
          ></v-text-field>

          <v-select
            v-model="selectedReservation.status"
            :items="reservationStatus"
            label="Estado"
            prepend-icon="mdi-list-status"
            outlined
            required
          ></v-select>
        </v-form>
      </v-card-text>
      <v-row justify="center" align="center" class="pa-3">
        <v-btn color="success" class="mx-2" @click="updateReservation">Guardar</v-btn>
        <v-btn color="error" class="mx-2" @click="cancelEditReservation">Cancelar</v-btn>
      </v-row>
    </v-card>
  </v-container>
</template>

<style lang="css" scoped>
  .v-card {
    max-width: 600px;
    margin: auto;
  }
</style>
