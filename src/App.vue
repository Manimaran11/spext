<template>
  <!-- <div class="row" style="height: inherit;"> -->
  <div class="container-fluid card-wrap ahover">
    <div class="row h-100 align-items-center">
      <div
        id="album-id"
        class="col-lg-6 col-md-6 col-sm-10 col-11 album flex-container"
        @mouseover="shuffle"
      >
        <div class="col-6 align-self-center">
          <b-img
            thumbnail
            fluid
            :src="images.codex"
            class="album-pic rounded-border"
          />
        </div>
        <div class="album-detail-container col-6">
          <div class="playing-text">Now Playing</div>
          <div id="album-detail" class="song-detail">
            <div class="song-title">{{ song_title }}</div>
            <div class="artist-name">{{ artist }}</div>
            <div class="artist2-name">{{ artist2 }}</div>
          </div>
          <div
            style="margin-left: -10px"
            class="flex-container justify-flex-start align-items-center"
          >
            <div
              id="like-song"
              @click="togglelike"
              v-bind:class="[liked ? 'like-purp' : 'like-grey']"
              class="ellipsis-container"
            ></div>
            <div class="ellipsis-container add-grey"></div>
            <div class="ellipsis-container share-grey"></div>
          </div>
        </div>
      </div>

      <div
        id="album-play"
        class="album-player col-lg-7 col-md-7 col-sm-8 col-11"
        @mouseover="shuffle1"
      >
        <div class="flex-container album-player-container">
          <div class="play-left-container">
            <img class="player-options" :src="images.shuffle" />
            <img
              class="player-options"
              @click="loopAll = !loopAll"
              :src="[loopAll ? images.loop_all_active : images.loop_all]"
            />
          </div>
          <div class="play-middle-container flex-container">
            <div @click="playprev" class="test">
              <a
                :class="{ 'disabled-prev': !loopAll && currPlayInd == 0 }"
                class="player-prev"
              ></a>
            </div>
            <div @click="playpause" class="test">
              <a
                class="btnc"
                :class="[playing ? 'player-play' : 'player-pause']"
              ></a>
            </div>

            <div @click="playnext" class="test">
              <a
                :class="{
                  'disabled-next': !loopAll && currPlayInd == urls.length - 1,
                }"
                class="player-next"
              ></a>
            </div>
          </div>
          <div class="play-end-container">
            <img
              class="player-options"
              @click="loopCurr = !loopCurr"
              :src="[loopCurr ? images.loop_active : images.loop]"
            />
            <img class="player-options" :src="images.playlist" />
          </div>
        </div>

        <div id="app1" class="audio-container">
          <audio-player
            @audio-ended="audioDone"
            ref="audioComponent"
            :url="urls"
            playerid="audio-player"
          >
          </audio-player>
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<style>
@import "./assets/styles/styles.css";
</style>

<script>
const arr = [
  require("./assets/songs/01.BeatifulPeople.mp3"),
  require("./assets/songs/song1.mp3"),
  require("./assets/songs/song2.mp3"),
  require("./assets/songs/song3.mp3"),
  require("./assets/songs/song4.mp3"),
];
export default {
  name: "app",
  data() {
    return {
      play_text: "Now playing",
      song_title: "Purple Haze",
      artist: "Jimi Hendix",
      artist2: "Woodstock",
      urls: arr,
      loopAll: false,
      loopCurr: false,
      currPlayInd: 0,
      liked: true,
      playing: false,
      theParent: null,
      images: {
        codex: require("./assets/images/codex-omega.png"),
        shuffle: require("./assets/images/shuffle.svg"),
        loop: require("./assets/images/loop.svg"),
        loop_active: require("./assets/images/loop-active.svg"),
        loop_all: require("./assets/images/loop-all.svg"),
        loop_all_active: require("./assets/images/loop-all-active.svg"),
        playlist: require("./assets/images/playlist.svg"),
      },
    };
  },
  methods: {
    shuffle: function () {
      if (!this.theParent)
        this.theParent = document.getElementsByClassName("card-wrap")[0];
      if (this.theParent.classList.contains("ahover")) {
        return;
      }
      this.theParent.classList.add("ahover");
      this.theParent.classList.remove("bhover");
    },
    togglelike: function () {
      this.liked = !this.liked;
    },
    shuffle1: function () {
      if (!this.theParent)
        this.theParent = document.getElementsByClassName("card-wrap")[0];
      if (this.theParent.classList.contains("bhover")) {
        return;
      }
      this.theParent.classList.add("bhover");
      this.theParent.classList.remove("ahover");
    },
    playpause: function () {
      // console.log("called playpause", this.$refs);
      this.playing = !this.playing;
      this.$refs.audioComponent.toggleAudio();
    },
    playnext: function () {
      if (this.loopAll && this.currPlayInd == this.urls.length - 1) {
        this.currPlayInd = -1;
      }
      if (this.currPlayInd <= this.urls.length - 2) {
        this.currPlayInd++;
        this.$refs.audioComponent.playThis(this.currPlayInd);
        this.playing = true;
      } else {
        this.playing = false;
      }
    },
    playprev: function () {
      if (this.loopAll && this.currPlayInd == 0) {
        this.currPlayInd = this.urls.length;
      }
      if (this.currPlayInd >= 1) {
        this.currPlayInd--;
        this.$refs.audioComponent.playThis(this.currPlayInd);
        this.playing = true;
      }
    },
    audioDone() {
      if (this.loopCurr) {
        this.currPlayInd--;
      }
      this.playnext();
    },
  },
};
</script>

