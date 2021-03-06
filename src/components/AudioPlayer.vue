<template>
  <div id="audio-player-root">
    <!-- Hide the default audio player -->
    <div>
      <audio
        v-on:ended="onEnd"
        style="display: none"
        ref="player"
        :id="playerid"
      >
        <source :src="currUrl" type="audio/mpeg" />
      </audio>
    </div>
    <input
      class="slider"
      v-model="playbackTime"
      type="range"
      min="0"
      :max="audioDuration"
      id="position"
      name="position"
    />

    <div
      class="flex-container"
      style="justify-content: space-between; margin-top: 12px; color: #aa9bbe"
    >
      <span class="text-sm" v-html="elapsedTime()"> </span>

      <span class="text-sm" v-html="totalTime()"> </span>
    </div>

    <!-- outer gray border -->
  </div>
  <!-- white bg -->
  <!-- root -->
</template>

<script>
//import { mapState } from 'vuex'
export default {
  props: ["url", "playerid"],
  /**
   * playbackTime = local var that syncs to audio.currentTime
   * audioDuration = duration of audio file in seconds
   * isPlaying = boolean (true if audio is playing)
   *
   **/

  data() {
    return {
      playbackTime: 0,
      audioDuration: 100,
      audioLoaded: false,
      isPlaying: false,
      currUrl: this.url[0],
    };
  },
  methods: {
    //Set the range slider max value equal to audio duration
    initSlider() {
      var audio = this.$refs.player;
      if (audio) {
        this.audioDuration = Math.round(audio.duration);
      }
    },

    //Convert audio current time from seconds to min:sec display
    convertTime(seconds) {
      if (!seconds) return "0:00";
      const format = (val) => `0${Math.floor(val)}`.slice(-2);
      // var hours = seconds / 3600;
      var minutes = (seconds % 3600) / 60;
      //console.log(format, minutes);

      return [minutes, seconds % 60].map(format).join(":");
    },

    //Show the total duration of audio file
    totalTime() {
      var audio = this.$refs.player;
      if (audio) {
        var seconds = audio.duration;
        return this.convertTime(seconds);
      } else {
        return "00:00";
      }
    },

    //Display the audio time elapsed so far
    elapsedTime() {
      var audio = this.$refs.player;
      if (audio) {
        var seconds = audio.currentTime;
        this.setCSSProperty();
        return this.convertTime(seconds);
      } else {
        return "00:00";
      }
    },

    //Playback listener function runs every 100ms while audio is playing
    playbackListener() {
      var audio = this.$refs.player;

      //Sync local 'playbackTime' var to audio.currentTime and update global state
      this.playbackTime = audio.currentTime;

      //Add listeners for audio pause and audio end events
      audio.addEventListener("ended", this.endListener);
      audio.addEventListener("pause", this.pauseListener);
    },

    //Function to run when audio is paused by user
    pauseListener() {
      this.isPlaying = false;
      this.listenerActive = false;
      this.cleanupListeners();
    },
    //Function to run when audio play reaches the end of file
    endListener() {
      this.isPlaying = false;
      this.listenerActive = false;
      this.cleanupListeners();
    },
    //Remove listeners after audio play stops
    cleanupListeners() {
      var audio = this.$refs.player;
      //console.log(audio);
      audio.removeEventListener("freqtimeupdate", this.playbackListener);
      audio.removeEventListener("ended", this.endListener);
      audio.removeEventListener("pause", this.pauseListener);

      ////console.log("All cleaned up!");
    },
    toggleAudio() {
      var audio = this.$refs.player;
      // var audio1 = document.getElementById("audio-player");
      // //console.log(audio,audio1)
      if (audio.paused) {
        audio.play();
        this.isPlaying = true;
      } else {
        audio.pause();
        this.isPlaying = false;
      }
    },
    playThis(ind) {
      console.log(ind);
      this.$refs.player.pause();
      this.isPlaying = false;
      this.currUrl = this.url[ind];
      this.$refs.player.load();
      this.toggleAudio();
      this.initSlider();
    },
    setCSSProperty() {
      let inputElement = document.getElementById("position");
      const percent =
        ((inputElement.value - inputElement.min) /
          (inputElement.max - inputElement.min)) *
        100;
      inputElement.style.setProperty("--webkitProgressPercent", `${percent}%`);
    },
    onEnd() {
      this.isPlaying = false;
      this.$emit("audio-ended");
    },
  },
  mounted: function () {
    // nextTick code will run only after the entire view has been rendered
    this.$nextTick(function () {
      var audio = this.$refs.player;
      //console.log(audio)
      //Wait for audio to load, then run initSlider() to get audio duration and set the max value of our slider
      // "loademetadata" Event https://www.w3schools.com/tags/av_event_loadedmetadata.asp
      audio.addEventListener(
        "loadedmetadata",
        function () {
          this.initSlider();
        }.bind(this)
      );

      // "canplay" HTML Event lets us know audio is ready for play https://www.w3schools.com/tags/av_event_canplay.asp
      audio.addEventListener(
        "canplay",
        function () {
          this.audioLoaded = true;
        }.bind(this)
      );

      //Wait for audio to begin play, then start playback listener function
      this.$watch("isPlaying", function () {
        if (this.isPlaying) {
          var audio = this.$refs.player;
          this.initSlider();
          ////console.log("Audio playback started.");

          //prevent starting multiple listeners at the same time
          if (!this.listenerActive) {
            this.listenerActive = true;

            audio.addEventListener("freqtimeupdate", this.playbackListener);
          }
        }
      });

      //Update current audio position when user drags progress slider
      this.$watch("playbackTime", function () {
        // var audio=this.$refs.player;

        var diff = Math.abs(this.playbackTime - this.$refs.player.currentTime);

        //Throttle synchronization to prevent infinite loop between playback listener and this watcher
        if (diff > 0.01) {
          this.$refs.player.currentTime = this.playbackTime;
        }
      });
    });
  },
};
</script>

<style>
.slider {
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  outline: none;
  margin: auto;
  width: 100%;
  border-radius: 15px;
  height: 13px;
  --webkitProgressPercent: 0%;
}

.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  box-sizing: content-box;
  border: .4rem solid #fff;
  height: .9rem;
  width: .9rem;
  border-radius: 50%;
  background-color: #5d24d6;
  background-image: linear-gradient(-180deg, #917ce4 0%, #5d24d6 100%);
  box-shadow: 2px 3px 10px 3px rgb(98 75 242 / 63%), inset 10px 10px 15px rgb(255 255 255 / 20%);
  cursor: pointer;
  margin: -8px 0 0 0;
}

.slider::-moz-range-thumb {
  -webkit-appearance: none;
  box-sizing: content-box;
  border: 7px solid #fff;
  height: 13px;
  width: 13px;
  border-radius: 50%;
  background-color: #5d24d6;
  background: linear-gradient(327.56deg, #5d24d6 19.23%, #7e74ed 81.76%);
  box-shadow: 2px 3px 5px rgba(98, 75, 242, 0.63),
    inset 10px 10px 15px rgba(255, 255, 255, 0.2);
  cursor: pointer;
  margin: 0px 0 0 0;
}

input[type="range"]::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  background-image: linear-gradient(
    90deg,
    #5d24d6 var(--webkitProgressPercent),
    #dedde3 var(--webkitProgressPercent)
  );
  width: 100%;
  height: 14px;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: -3px -3px 5px #ffffff, 3px 3px 5px rgba(0, 0, 0, 0.05),
    inset 3px 3px 5px rgba(0, 0, 0, 0.05), inset -3px -3px 5px #ffffff;
}

/** FF*/
input[type="range"]::-moz-range-progress {
  background-color: #5d24d6;
  width: 100%;
  height: 7px;
  border-radius: 20px;
  box-shadow: 0px 3px 5px rgba(98, 75, 242, 0.63),
    inset 10px 10px 15px rgba(255, 255, 255, 0.2);
  cursor: pointer;
}
input[type="range"]::-moz-range-track {
  background-color: #dedde3;
  box-shadow: -3px -3px 5px #ffffff, 3px 3px 5px rgba(0, 0, 0, 0.05),
    inset 3px 3px 5px rgba(0, 0, 0, 0.05), inset -3px -3px 5px #ffffff;
  width: 100%;
  height: 5px;
  border-radius: 20px;
  cursor: pointer;
  padding: 5px 4px;
}
/* IE*/
input[type="range"]::-ms-fill-lower {
  background-color: #5d24d6;
}
input[type="range"]::-ms-fill-upper {
  background-color: #9a905d;
}
</style>
