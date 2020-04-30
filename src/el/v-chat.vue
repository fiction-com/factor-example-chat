<template>
  <div class="chat-view">
    <div class="messages">
      <div v-for="(message, i) in messages" :key="i" class="message">
        <factor-avatar email="factor@fiction.com" />
        <div class="text">{{ message }}</div>
      </div>
    </div>
    <factor-input-textarea v-model="text" />
    <factor-btn btn="primary" @click="send()">Send</factor-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorBtn, factorAvatar, factorInputTextarea } from "@factor/ui"
import { onEvent } from "@factor/api"
import { sendMessage } from "../socket-client"

export default Vue.extend({
  components: { factorBtn, factorInputTextarea, factorAvatar },
  data() {
    return { messages: [], text: "" }
  },
  mounted(this: any) {
    onEvent("received-message", (event: MessageEvent) => {
      this.messages.push(event.data)
    })
  },
  methods: {
    async send(this: any) {
      await sendMessage(this.text)
      this.messages.push(this.text)
    }
  }
})
</script>
<style lang="less">
.message {
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
  display: flex;
}
</style>
