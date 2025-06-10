<script setup>
  import { onMounted, ref } from 'vue'

  import AdminHeader from '@/components/admin/AdminHeader.vue'
  import AdminTable from '@/components/admin/AdminTable.vue'
  import AdminForm from '@/components/admin/AdminForm.vue'

  import { db } from '../plugins/firebase'
  import { doc, getDoc } from 'firebase/firestore'

  import { useReservationStore } from '@store/reservationStore'

  import moment from 'moment'
  import 'moment/dist/locale/es'

  const reservationStore = useReservationStore()
  const { dbName, fetchReservations } = reservationStore

  moment.locale('es')

  const selectedReservation = ref({
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
  })

  const showEditForm = ref(false)
  const showSuccess = ref(false)
  const showError = ref(false)

  async function fetchSelectedReservation(id) {
    showEditForm.value = true
    try {
      const reservationRef = doc(db, dbName, id)
      const reservationSnapshot = await getDoc(reservationRef)
      if (reservationSnapshot.exists()) {
        const data = reservationSnapshot.data()
        selectedReservation.value = {
          id,
          createdAt: new Date(data.createdAt).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          name: data.name,
          phone: data.phone,
          email: data.email,
          dates: [data.dates[0], data.dates[data.dates.length - 1]],
          totalNights: data.totalNights,
          hosts: data.hosts,
          pets: data.pets,
          status: data.status
        }
      } else {
        console.error('El documento no existe.')
        return
      }
    } catch (error) {
      console.error('Error al actualizar la reserva:', error)
    }
  }

  onMounted(async () => {
    await fetchReservations()
  })
</script>

<template>
  <v-alert
    v-if="showSuccess"
    class="toast-alert"
    title="Hemos recibido tu solicitud de reserva"
    type="success"
    border="end"
    closable
  >
    <p>La reserva se ha actualizado con éxito.</p>
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
  <AdminHeader />
  <AdminForm
    v-model:showEditForm="showEditForm"
    v-model:selectedReservation="selectedReservation"
    v-model:showError="showError"
    v-model:showSuccess="showSuccess"
  />
  <AdminTable v-model:showEditForm="showEditForm" @fetchReservation="fetchSelectedReservation" />
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
