<template>
  <div class="home-page">
    <factor-btn btn="primary" @click="openChat()">
      Show Chat
    </factor-btn>
    <factor-modal :vis.sync="showChat">
      <v-chat
        :chatId="chatId"
        v-if="showChat"
      />
    </factor-modal>
    <test-panel/>
    <chat-list @openChat="chatId = $event, openChat()"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorBtn, factorModal } from "@factor/ui"
import vChat from './../el/v-chat.vue'
import testPanel from '../test-panel.vue'
import ChatList from "../el/chat-list.vue"

export default Vue.extend({
  name: 'home',
  components: {ChatList, factorBtn, factorModal, vChat, testPanel},
  data() {
    return {
      showChat: false,
      chatId: null,
    }
  },
  mounted () {
    getCurrentUser()
  },
  metaInfo: {
    title: "Home"
  },
  methods: {
    openChat () {
      this.showChat = !this.showChat
    }
  }
})
</script>

<style lang="less">
.home-page {

}
</style>
