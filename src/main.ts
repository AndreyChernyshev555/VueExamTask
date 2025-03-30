import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'
import router from './router'
import langRu from 'quasar/lang/ru'

const app = createApp(App)

app.use(Quasar, {
  plugins: {},
  lang: langRu,
})
app.use(createPinia())
app.use(router)

app.mount('#app')
