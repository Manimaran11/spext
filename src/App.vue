<template>
  <div class="flex-container card-wrap ahover">
    <div id="album-id" class="album flex-container card" @mouseover="shuffle">
      <div class="album-pic-container">
        <img :src="images.codex" class="album-pic" />
      </div>
      <div class="album-detail-container">
        <div class="playing-text">Now Playing</div>
        <div id="album-detail" class="song-detail">
          <div class="song-title">{{ song_title }}</div>
          <div class="artist-name">{{ artist }}</div>
          <div class="artist2-name">{{ artist2 }}</div>
        </div>
        <div
          style="align-items: center; margin-left: -10px"
          class="flex-container"
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
    <!-- </div> -->
    <div id="album-play" class="album-player card" @mouseover="shuffle1">
      <div class="flex-container album-player-container">
        <div class="play-left-container">
          <img class="player-options" :src="images.shuffle" />
          <img class="player-options" :src="images.loop_all" />
        </div>
        <div class="play-middle-container flex-container">
          <div class="player-options player-next-container album-action-circle">
            <div class="purp-circle player-prev"></div>
          </div>
          <div
            class="player-options album-action-circle"
            style="width: 65px; height: 65px"
          >
            <div class="player-play purp-circle"></div>
          </div>
          <div class="player-options player-next-container album-action-circle">
            <div class="purp-circle player-next"></div>
          </div>
        </div>
        <div class="play-end-container">
          <img class="player-options" :src="images.loop" />
          <img class="player-options" :src="images.playlist" />
        </div>
      </div>

      <div id="app1">
        <audio-player :url="urls" playerid="audio-player"> </audio-player>
      </div>
    </div>
  </div>
</template>

<style>
@import "./assets/styles/styles.css";
</style>

<script>
const arr = [require("./assets/songs/01.BeatifulPeople.mp3"), require("./assets/songs/song1.mp3"), require("./assets/songs/song2.mp3")
,require("./assets/songs/song3.mp3"),require("./assets/songs/song4.mp3")];
export default {
  name: "app",
  data() {
    return {
      play_text: "Now playing",
      song_title: "Purple Haze",
      artist: "Jimi Hendix",
      artist2: "Woodstock",
      urls: arr,
      liked: true,
      theParent: null,
      images: {
        codex: require("./assets/images/codex-omega.png"),
        shuffle: require("./assets/images/shuffle.svg"),
        loop: require("./assets/images/loop.svg"),
        loop_all: require("./assets/images/loop-all.svg"),
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
  },
};
</script>

