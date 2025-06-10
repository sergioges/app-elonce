import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          background: '#FFFFFF'
        }
      }
    }
  },
  components,
  directives,
  icons: {
    defaultSet: 'mdi'
  }
})

export default vuetify

// https://vuetifyjs.com/en/getting-started/quick-start
