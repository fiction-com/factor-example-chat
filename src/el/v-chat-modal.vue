<template>
  <factor-modal :vis.sync="show">
    <v-chat v-if="show" :chat-id="chatId"/>
  </factor-modal>
</template>

<script lang="ts">
import Vue from "vue"
import { factorModal } from "@factor/ui"
import { onEvent, offEvent } from "@factor/api"
import vChat from './v-chat.vue'

export default Vue.extend({
  name: 'v-chat-modal',
  components: { factorModal, vChat },
  data() {
    return {
      show: false,
      chatId: null,
    }
  },
  mounted (this: any) {
    onEvent('open-chat', this.openChat)
  },
  beforeDestroy () {
    offEvent('open-chat', this.openChat)
  },
  methods: {
    async openChat (this: any, chatId: string) {
      // Open modal
      this.chatId = chatId
      this.show = true
    },
  },
})
</script>
