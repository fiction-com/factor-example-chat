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
          <div class="text">{{ message.content }}</div>
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
import { currentUserId, requestEmbeddedPost } from "@factor/api"
import { initChat, sendMessageToChat } from "../endpoints/chat/client";

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
  async mounted (this: any) {
    console.log('this.chatIdComputed', this.chatIdComputed)
    if (!this.chatIdComputed) {
      this.registeredChatId = await initChat()
    }
    registerChat(this.onChatMessage)
    const chat = await requestEmbeddedPost({
      parentId: this.chatIdComputed, // parent post ID
      skip: 0, // embedded post to skip
      limit: 50, // number of embedded posts returned
      action: "retrieve",
    })
    this.messages = chat.embedded
  },
  metaInfo: {
    title: "Chat"
  },
  methods: {
    onChatMessage (message: string) {
      console.log('message', message)
    },
    async send (this: any) {
      // Set up a post
      const postData = {
        content: this.messageText,
        author: [currentUserId()]
      }

      // Save as embedded
      const result = await requestEmbeddedPost({
        action: "save",
        postType: 'chat',
        data: postData,
        parentId: this.chatIdComputed,
      })

      // await sendMessageToChat({chatId: this.chatIdComputed, message: this.messageText})
      await sendMessage({_id: this.chatIdComputed, text: this.messageText})
      // this.messages.unshift({ ...this.data }) // remove mutable
      // this.messageText = ""
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
