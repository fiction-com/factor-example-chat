<template>
  <div class="home-page">
    <v-chat v-if="userInitialized"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { currentUser, emitEvent } from "@factor/api"
import vChat from '../el/v-chat.vue'
import { userInitialized } from "@factor/api"

export default Vue.extend({
  name: 'home',
  metaInfo: {
    title: "Home"
  },
  data() {
    return {
      userInitialized: false,
    }
  },
  async mounted (this: any) {
    this.userInitialized = await userInitialized()
  },
  components: { vChat},
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
  padding-top: 0.5rem;
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
