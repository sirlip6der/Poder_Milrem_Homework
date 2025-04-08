import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import markerIcon2x from './assets/marker-icon-2x.png'
import markerIcon from './assets/marker-icon.png'
import markerShadow from './assets/marker-shadow.png'

// @ts-ignore → ignoreerime tüübi errorit
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
