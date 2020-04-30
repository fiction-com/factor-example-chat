<template>
  <div class="chat-view">
    <factor-form class="input-form">
      <div class="meta">
        <factor-input-wrap v-model="data.name" input="factor-input-text" label="Name" />
        <factor-input-wrap v-model="data.email" input="factor-input-email" label="Email" />
      </div>
      <factor-input-wrap v-model="data.text" input="factor-input-textarea" label="Message" />

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
import { onEvent } from "@factor/api"
import { sendMessage } from "../socket-client"

export default Vue.extend({
  components: { factorBtn, factorForm, factorInputWrap, factorAvatar },
  data() {
    return {
      messages: [],
      data: {
        email: "",
        name: "",
        text: ""
      }
    }
  },
  metaInfo: {
    title: "Chat"
  },
  mounted(this: any) {
    onEvent("received-message", (data: MessageEvent) => {
      this.messages.unshift(data)
    })
  },
  methods: {
    async send(this: any) {
      await sendMessage(this.data)
      this.messages.unshift({ ...this.data }) // remove mutable
      this.data.text = ""
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
