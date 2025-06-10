<script setup>
  import { ref, computed, reactive, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { db } from '@/plugins/firebase'
  import { collection, addDoc, updateDoc } from 'firebase/firestore'

  import { useReservationStore } from '@store/reservationStore'

  import { parsePhoneNumberFromString } from 'libphonenumber-js'

  import moment from 'moment'
  import 'moment/dist/locale/es'

  const route = useRoute()

  const reservationStore = useReservationStore()
  const { dbName } = reservationStore

  moment.locale('es')

  const props = defineProps({
    totalNights: {
      type: Number,
      default: 0
    }
  })

  const reservationDates = defineModel('reservationDates')
  const showSuccess = defineModel('showSuccess')
  const showError = defineModel('showError')
  const isPaymentAvailable = defineModel('isPaymentAvailable')
  const isTestPaymentAvailable = defineModel('isTestPaymentAvailable')

  const hosts = ref(1)
  const pets = ref('No')
  const form = ref(null)
  const contactData = reactive({
    name: '',
    email: '',
    phone: '',
    marketingEnabled: true
  })
  const countdown = ref(0)

  const emailValidation = ref([
    v => !!v || 'Falta tu email',
    v => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || 'Email inválido'
  ])
  const phoneValidation = ref([
    v => !!v || 'Falta tu teléfono',
    v => /^\d{10}$/.test(v) || 'Teléfono inválido (debe ser un número mexicano válido)'
  ])

  const formattedCountdown = computed(() => {
    const minutes = Math.floor(countdown.value / 60)
    const seconds = countdown.value % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  })

  // Pass all the dates between the start and the end date.
  function getDatesInRange(startDate, endDate) {
    const dates = []
    let currentDate = moment(startDate).startOf('day')
    const finalDate = moment(endDate).startOf('day')

    while (currentDate.isSameOrBefore(finalDate)) {
      // Set the time to 00:00:00 and convert to ISO format.
      const normalizedDate = moment(currentDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      dates.push(normalizedDate)
      currentDate.add(1, 'day')
    }

    return dates
  }

  async function sendData() {
    const { valid } = await form.value.validate()

    if (valid) {
      try {
        const reservationData = {
          name: contactData.name,
          email: contactData.email,
          phone: normalizePhoneNumber(contactData.phone),
          marketingEnabled: contactData.marketingEnabled,
          hosts: hosts.value,
          pets: pets.value,
          dates: getDatesInRange(reservationDates.value[0], reservationDates.value[1]),
          totalNights: props.totalNights,
          status: 'pending',
          createdAt: moment().toISOString(),
          isBrevoDisabled: route.query?.brevo === 'disabled'
        }

        const docRef = await addDoc(collection(db, dbName), reservationData)

        sessionStorage.setItem('idReservation', docRef.id)

        // Need aditional time to give time to register the user un Brevo and after that, update the ID and status.
        setTimeout(() => {
          updateDoc(docRef, { id: docRef.id })
        }, 2000)

        isPaymentAvailable.value = true
        showSuccess.value = true
        setTimeout(() => {
          showSuccess.value = false
          if (props.totalNights >= 6 && !isTestPaymentAvailable.value) resetData()
        }, 6000)
      } catch (error) {
        showError.value = true
        setTimeout(() => {
          showError.value = false
        }, 6000)
        console.error('Error al guardar la reserva:', error)
      }
    }
  }

  function normalizePhoneNumber(rawNumber, countryCode = 'MX') {
    const phoneNumber = parsePhoneNumberFromString(rawNumber, countryCode)
    return phoneNumber?.isValid() ? phoneNumber.number : null
  }

  async function resetData() {
    await form.value.reset()
    pets.value = 'No'
    hosts.value = 1
    reservationDates.value = []
    contactData.marketingEnabled = true
    isPaymentAvailable.value = false
  }

  function sendWhatsapp() {
    window.open(
      'https://api.whatsapp.com/send?phone=5214421128615&text=Hola!%20Acabo%20de%20realizar%20una%20reserva.',
      '_blank'
    )
  }

  onMounted(() => {
    // Stripe button.
    // const script = document.createElement('script')
    // script.src = 'https://js.stripe.com/v3/buy-button.js'
    // script.async = true
    // document.head.appendChild(script)
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
          resetData()
        }
      }, 1000)
    }
  })
</script>

<template>
  <v-form ref="form" class="mb-4">
    <v-row>
      <v-col class="d-flex flex-column ga-4 mb-2" cols="12" md="12">
        <v-row>
          <v-col cols="12" md="6">
            <v-number-input
              v-model="hosts"
              :reverse="false"
              controlVariant="split"
              label="Número de huéspedes"
              prepend-icon="mdi-account-multiple-check"
              :hideInput="false"
              :min="1"
              :max="4"
              hide-details="auto"
              variant="solo"
            ></v-number-input>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="pets"
              label="¿Llevas mascotas?"
              :items="['Si', 'No']"
              prepend-icon="mdi-paw"
              variant="solo"
              hide-details="auto"
            ></v-select>
          </v-col>
        </v-row>
        <p>Datos de contacto</p>
        <v-text-field
          v-model="contactData.name"
          required
          :rules="[v => !!v || 'Falta tu nombre']"
          label="Nombre"
          prepend-icon="mdi-account-box-edit-outline"
          hide-details="auto"
          variant="solo"
        ></v-text-field>
        <v-text-field
          v-model="contactData.email"
          required
          :rules="emailValidation"
          label="Email"
          prepend-icon="mdi-email"
          hide-details="auto"
          variant="solo"
        ></v-text-field>
        <v-text-field
          v-model="contactData.phone"
          required
          :rules="phoneValidation"
          label="Móvil"
          prepend-icon="mdi-cellphone"
          hide-details="auto"
          variant="solo"
          type="tel"
        ></v-text-field>
        <v-checkbox
          v-model="contactData.marketingEnabled"
          color="success"
          label="¿Te gustaría recibir información de Amealco y conocer nuestras promociones?"
          class="text-left"
          hide-details="auto"
          variant="solo"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-row v-if="!isPaymentAvailable" class="d-flex justify-center">
      <v-col cols="12" md="6">
        <v-btn color="success" block :disabled="props.totalNights === 0" @click="sendData">
          Solicitar reserva
        </v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn color="error" block @click="resetData">Borrar</v-btn>
      </v-col>
    </v-row>
    <v-row v-else align="center" justify="center">
      <!--Add stripe buttons-->
      <p>
        Si prefieres realizar el pago mediante transferencia bancaria. Envía un mensaje vía
        Whatsapp.
      </p>
      <v-col cols="12" md="6">
        <v-btn
          density="default"
          color="primary"
          prepend-icon="mdi-whatsapp"
          block
          @click="sendWhatsapp"
        >
          Contacta
        </v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn color="error" block @click="resetData">Borrar</v-btn>
      </v-col>
    </v-row>
    <!--Add testing logic-->
  </v-form>
</template>

<style lang="css" scoped>
  .stripe-btn {
    margin: -20px 0;
  }

  .contact-btn {
    display: flex;
    padding: 20px 55px;
    margin: 0 auto;
    margin-bottom: 20px;
  }

  .reset-btn {
    display: flex;
    padding: 20px 55px;
    margin: 0 auto;
    margin-bottom: 20px;
  }
</style>
