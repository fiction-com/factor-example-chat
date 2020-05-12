<template>
  <div class="chat-view">
    <div class="messages">
      <div v-for="(message, i) in messages" :key="i" class="message">
        <div class="media">
          <factor-avatar v-if="isMessageFromAdmin(message)" url="https://picsum.photos/id/0/50/50" />
          <factor-avatar v-else url="https://picsum.photos/id/1025/50/50" />
        </div>
        <div class="content">
          <div class="name" v-if="isMessageFromAdmin(message)">Admin:</div>
          <div class="name" v-else>Guest:</div>
          <div class="text">{{ message.content }}</div>
        </div>
      </div>
    </div>
    <factor-form class="input-form">
      <factor-input-wrap @keydown.enter="submit" class="input" placeholder="Type your message here..." v-model="messageText" input="factor-input-textarea"/>
      <factor-btn btn="primary" @click="send()">Send</factor-btn>
    </factor-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorBtn, factorAvatar, factorForm, factorInputWrap, factorModal } from "@factor/ui"
import { currentUser, requestEmbeddedPost, onEvent, currentUserId, offEvent, userInitialized } from "@factor/api"
import { initChat } from "../endpoints/chat/client"
import { ChatWebsocketService } from "../socket-client"

export default Vue.extend({
  name: 'v-chat',
  components: { factorBtn, factorForm, factorInputWrap, factorAvatar, factorModal },
  props: {
    chatId: {
      type: String,
    }
  },
  data() {
    return {
      registeredChatId: null,
      messages: [],
      messageText: "",
      webSocketService: null as ChatWebsocketService | null,
    }
  },
  async mounted (this: any) {
    onEvent("received-message", this.onChatMessage)
    this.startChat()
  },
  beforeDestroy () {
    offEvent("received-message", this.onChatMessage)
    this.webSocketService?.close()
  },
  methods: {
    submit (event: KeyboardEvent) {
      if (event.ctrlKey || event.shiftKey) {
        return
      }
      this.send()
      event.preventDefault()
    },
    async startChat (this: any) {
      this.messages = []

      await userInitialized()

      // Create chat on backend.
      if (!this.chatIdComputed) {
        this.registeredChatId = await initChat()
      }

      // Get all chat messages.
      const chat = await requestEmbeddedPost({
        parentId: this.chatIdComputed, // parent post ID
        skip: 0, // embedded post to skip
        limit: 50, // number of embedded posts returned
        action: "retrieve",
      })
      console.log('chat', chat)
      this.messages = chat.embedded

      // Connect websocket
      this.webSocketService = new ChatWebsocketService()
      await this.webSocketService.initialize(this.chatIdComputed)
    },
    onChatMessage (message: any) {
      this.messages = [...this.messages, ...message.embedded]
    },
    async send (this: any) {
      await this.webSocketService.sendMessage({_id: this.chatIdComputed, text: this.messageText, authorId: currentUserId()})
      this.messageText = ''
    },
    isMessageFromAdmin (message: any): boolean {
      return message.author.length
    },
  },
  computed: {
    chatIdComputed (this: any): string {
      return this.chatId || this.registeredChatId
    },
    currentUser () {
      return currentUser()
    }
  }
})
</script>
<style lang="less" scoped>
.message {
  display: grid;
  grid-template-columns: 3rem 1fr;
  grid-gap: 1rem;
  padding: 1rem 0;
  text-align: left;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border);
  }

  .name {
    font-weight: var(--font-weight-bold, 700);
  }
  .text {
    margin-top: 0.5rem;
  }
  .avatar {
    width: inherit;
  }
}
.input-form {
  margin-top: 1rem;
  .meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
  }
}
</style>
