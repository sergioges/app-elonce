import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// Vuetify
import vuetify from './plugins/vuetify'

const app = createApp(App)

app.component('VueDatePicker', VueDatePicker)

app.use(router)

app.use(createPinia())

app.use(vuetify)

app.mount('#app')
