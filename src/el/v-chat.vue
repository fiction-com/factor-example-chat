<template>
  <div class="chat-view">
    <factor-form class="input-form">
      <factor-input-wrap v-model="messageText" input="factor-input-textarea" label="Message" />

      <factor-btn btn="primary" @click="send()">Send</factor-btn>
    </factor-form>
    <div class="messages">
      <div v-for="(message, i) in messages" :key="i" class="message">
        <div class="media">
          <factor-avatar :email="message.email" />
        </div>
        <div class="content">
          <div class="name">{{ message.name }}</div>
          <div class="text">{{ message.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorBtn, factorAvatar, factorForm, factorInputWrap } from "@factor/ui"
import { sendMessage } from "../socket-client"
import { registerChat } from "../chat-service";
import { initChat, sendMessageToChat } from "../api";

export default Vue.extend({
  name: 'v-chat',
  components: { factorBtn, factorForm, factorInputWrap, factorAvatar },
  props: {
    chatId: {
      type: String,
    },
  },
  data() {
    return {
      registeredChatId: null,
      messages: [],
      messageText: ""
    }
  },
  async mounted () {
    if (!this.chatIdComputed) {
      this.registeredChatId = await initChat()
    }
    registerChat(this.onChatMessage)
  },
  metaInfo: {
    title: "Chat"
  },
  methods: {
    onChatMessage(message: string) {

    },
    async send(this: any) {
      await sendMessage({_id: this.chatIdComputed, text: this.messageText})
      // this.messages.unshift({ ...this.data }) // remove mutable
      this.text = ""
    }
  },
  computed: {
    chatIdComputed (this: any): string {
      return this.chatId || this.registeredChatId
    }
  }
})
</script>
<style lang="less">
.message {
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
  display: grid;
  grid-template-columns: 3rem 1fr;
  grid-gap: 1rem;
  .name {
    font-weight: var(--font-weight-bold, 700);
  }
  .text {
    margin-top: 0.5rem;
  }
}
.input-form {
  margin: 3rem 0;
  .meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
  }
}
</style>
