<script setup>
  import { useRouter } from 'vue-router'

  import { useReservationStore } from '@store/reservationStore'

  import moment from 'moment'
  import 'moment/dist/locale/es'

  const router = useRouter()

  const reservationStore = useReservationStore()
  const { reservations } = reservationStore

  moment.locale('es')

  const headers = [
    {
      align: 'center',
      sortable: false,
      key: 'id',
      title: 'ID'
    },
    {
      align: 'center',
      sortable: true,
      key: 'createdAt',
      title: 'Creación'
    },
    {
      align: 'center',
      sortable: true,
      key: 'name',
      title: 'Nombre'
    },
    {
      align: 'center',
      sortable: false,
      key: 'phone',
      title: 'Teléfono'
    },
    {
      align: 'center',
      sortable: true,
      key: 'email',
      title: 'Email'
    },
    {
      align: 'center',
      sortable: true,
      key: 'dates',
      title: 'Reserva'
    },
    {
      align: 'center',
      sortable: false,
      key: 'totalNights',
      title: 'Noches'
    },
    {
      align: 'center',
      sortable: false,
      key: 'hosts',
      title: 'Huespedes'
    },
    {
      align: 'center',
      sortable: false,
      key: 'pets',
      title: 'Mascotas'
    },
    {
      align: 'center',
      sortable: true,
      key: 'status',
      title: 'Estado'
    }
  ]

  const showEditForm = defineModel('showEditForm')
  const emit = defineEmits(['fetchReservation'])

  async function fetchSelectedReservation(id) {
    showEditForm.value = true
    emit('fetchReservation', id)
  }

  function setStatusColor(status) {
    switch (status) {
      case 'paid':
        return 'green'
      case 'pending':
        return 'orange'
      case 'cancelled':
        return 'red'
      default:
        return 'grey'
    }
  }

  function closeSession() {
    localStorage.removeItem('authToken')
    router.push('/calendar')
  }
</script>

<template>
  <v-container class="data-table">
    <v-row>
      <v-col>
        <v-data-table-virtual
          :headers="headers"
          :items="reservations"
          fixed-header
          height="400"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Reservas</v-toolbar-title>
            </v-toolbar>
          </template>
          <template v-slot:item.id="{ item }">
            <v-btn color="primary" @click="fetchSelectedReservation(item.id)">
              {{ item.id.slice(-5) }}
            </v-btn>
          </template>
          <template v-slot:item.dates="{ item }">
            <p>
              {{ moment(item.dates[0]).format('DD/MM') }}
              -
              {{ moment(item.dates[item.dates.length - 1]).format('DD/MM') }}
            </p>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="setStatusColor(item.status)" text-color="white">
              {{ item.status }}
            </v-chip>
          </template>
        </v-data-table-virtual>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn @click="closeSession" color="error">Cerrar sesión</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="css" scoped>
  .data-table {
    max-width: max-content;
  }
</style>
