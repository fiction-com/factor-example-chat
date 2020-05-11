<template>
  <div class="home-page">
    <h2>
       Factor Chat Demo
    </h2>


  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorBtn, factorIcon } from "@factor/ui"
import { currentUser, emitEvent } from "@factor/api"

export default Vue.extend({
  name: 'home',
  metaInfo: {
    title: "Home"
  },
  components: {factorBtn, factorIcon},
  watch: {
    currentUser: {
      handler (currentUser) {
        if (currentUser) {
          this.$router.push({name: 'chat-list'})
        }
      },
      immediate: true,
    },
  },
  methods: {
    openChat() {
      emitEvent("open-chat", undefined)
    }
  },
  computed: {
    currentUser() {
      return currentUser()
    }
  }
})
</script>

<style lang="less">
.home-page {

}

@keyframes chat-button-pulse
{
  0% {
    box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
  }
  100% {
    box-shadow: 0 0 0 35px rgba(0, 0, 0, 0);
  }
}

.chat-button {
  position: fixed !important;
  right: 50px;
  bottom: 50px;
  animation: chat-button-pulse 1s infinite;
}
</style>
