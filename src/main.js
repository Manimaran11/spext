import Vue from 'vue'
import App from './App.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import { BootstrapVue } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.component('audio-player', AudioPlayer);
Vue.use(BootstrapVue);

new Vue({
    el: '#app',
    render: h => h(App)
  })

require('./freqtimeupdate.js')
