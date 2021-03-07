import { createApp } from 'vue'
import App from './App.vue'
import AudioPlayer from './components/AudioPlayer.vue'

// Vue.component('audio-player', AudioPlayer);

var app = createApp(App);
app.component('audio-player',AudioPlayer)
app.mount("#app")

require('./freqtimeupdate.js')
